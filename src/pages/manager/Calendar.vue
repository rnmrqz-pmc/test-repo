<template>
  <div class="pa-2">
    <NoProfile v-if="!session.details" @goto="gotoProfile" />
    <div v-else>
        <Calendar
          :events="calendarData.events"
          :role="session.user.role"
          :team="mainData.team"
          :busy="calendarData.busy"
          :trainers="mainData.trainer_list"
          @prev="handleNavigation"
          @next="handleNavigation"
          @today="goToday"
        />
    </div>
 
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, getCurrentInstance, computed } from 'vue'
import { useSessionStore } from '@/stores/session'
import { useRouter } from 'vue-router'
import { decrypt } from '@/utils/encryptDecrypt'
import NoProfile from '@/components/common/NoProfile.vue'
import Calendar from '@/components/Calendar.vue'

// Types
interface ColorStatus {
  status: TrainingStatus
  color: string
  textColor: string
}

interface TrainingItem {
  ID: string
  title: string
  start_date: string
  end_date: string
  start_time: string
  end_time: string
  training_status: TrainingStatus
  start?: string
  end?: string
  rrule?: {
    freq: string
    dtstart: string
    until: string
  }
  color?: string
  textColor?: string
  allDay?: boolean
  description?: string
  duration?: string
}

interface DateRange {
  start: string
  end: string
}

interface CalendarOptions {
  between_start: DateRange
  between_end: DateRange
}

type TrainingStatus = 'Planned' | 'On-Going' | 'Completed' | 'Cancelled' | 'Active'
type UserRole = 'admin' | 'manager' | 'trainer'

// Composables
const session = useSessionStore()
const router = useRouter()
const { proxy } = getCurrentInstance()!

// State
const mainData = ref({
  team: [],
  teamIDs: '',
  trainer_list: []
})

const calendarData = ref({
  events: [] as TrainingItem[],
  busy: false
})

// Constants
const COLOR_STATUS_MAP: ColorStatus[] = [
  { status: 'Planned', color: '#42A5F5', textColor: 'black' },
  { status: 'On-Going', color: '#FFA726', textColor: 'black' },
  { status: 'Completed', color: '#81C784', textColor: 'black' },
  { status: 'Cancelled', color: '#fa5855', textColor: 'black' },
  { status: 'Active', color: '#388E3C', textColor: '#fff' },
]

const MONTHS_OFFSET = 3
const MS_PER_HOUR = 60 * 60 * 1000
const MS_PER_MINUTE = 60 * 1000

// Computed
const colorStatusMap = computed(() => 
  new Map(COLOR_STATUS_MAP.map(item => [item.status, item]))
)

// Utility functions
const formatDate = (date: Date): string => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

const calculateDateRange = (date: string, type: 'start' | 'end'): string => {
  const formDate = new Date(date)
  const monthOffset = type === 'start' ? -MONTHS_OFFSET : MONTHS_OFFSET
  formDate.setMonth(formDate.getMonth() + monthOffset)
  return formatDate(formDate)
}

const calculateDuration = (startTime: string, endTime: string): string => {
  const today = new Date().toLocaleDateString('en-CA')
  const startDateTime = new Date(`${today}T${startTime}`)
  const endDateTime = new Date(`${today}T${endTime}`)
  
  const duration = endDateTime.getTime() - startDateTime.getTime()
  const hours = Math.floor(duration / MS_PER_HOUR)
  const minutes = Math.floor((duration / MS_PER_MINUTE) % 60)
  
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`
}

const buildTeamFilters = (role: UserRole, team: string) => {
  const baseFilters :any = {
    team,
    admin: 0,
    manager: 0,
    trainer: 1,
    status: 1
  }

  if (role === 'admin') {
    delete baseFilters.manager
    delete baseFilters.admin
    delete baseFilters.team
    return { ...baseFilters }
  }
  
  if (role === 'manager') {
    delete baseFilters.manager
    delete baseFilters.team
    return { ...baseFilters }
  }
  
  return baseFilters
}

const transformTrainingItem = (item: TrainingItem): TrainingItem => {
  const statusConfig = colorStatusMap.value.get(item.training_status)
  
  // Set date/time properties
  if (item.start_date === item.end_date) {
    item.start = `${item.start_date}T${item.start_time}`
    item.end = `${item.end_date}T${item.end_time}`
  } else {
    item.rrule = {
      freq: 'daily',
      dtstart: `${item.start_date}T${item.start_time}`,
      until: `${item.end_date}T${item.end_time}`
    }
  }
  
  // Set styling and metadata
  item.color = statusConfig?.color
  item.textColor = statusConfig?.textColor
  item.allDay = false
  item.description = 'event1'
  item.duration = calculateDuration(item.start_time, item.end_time)
  
  return item
}

// API functions
const getTeam = async (): Promise<void> => {
  try {
    const filters = buildTeamFilters(session.user.role, session.user.team)
    const res = await proxy!.$api.getData('trainers', { filters: { admin: 0 }, limit: 100 })

    // const response = await proxy!.$api.getData('trainers',{ filters })
    
    if (res.data.status) {
      const decrypted = decrypt(res.data.data)
      decrypted.map((item: any) => {
        delete item.password
        item.name = `${item.last_name}, ${item.first_name} ${item.middle_name?.substring(0, 1) || ''}`
      })
      let team = decrypted
      Object.keys(filters).forEach(key => {
        team = team.filter((item: any) => item[key] === filters[key]);
      });

      mainData.value.team = team
      mainData.value.teamIDs = team.map((item: any) => item.ID).join(',')
      mainData.value.trainer_list = decrypted
    }
  } catch (error) {
    console.error('Error fetching team:', error)
  }
}

const getTrainings = async (options: any): Promise<void> => {
  try {
    options.status = 1
    const data = {
      filters: options,
      limit: 100,
      find_in_set_any: { trainers: mainData.value.teamIDs },
      // find: { trainers: mainData.value.teamIDs }
    }
    
    const response = await proxy!.$api.getData('training', data)
    if (response.data.status) {
      const decrypted = decrypt(response.data.data)
      const transformedEvents = decrypted.map(transformTrainingItem)
      calendarData.value.events = transformedEvents
    }
  } catch (error) {
    console.error('Error fetching trainings:', error)
  }
}

// Navigation handlers
const setBusyState = async (operation: () => Promise<void>): Promise<void> => {
  calendarData.value.busy = true
  try {
    await operation()
  } catch (error) {
    console.error('Navigation error:', error)
  } finally {
    calendarData.value.busy = false
  }
}

const buildCalendarOptions = (start: string, end: string): any => ({
  'start_date >=': start, 'end_date <=': end,
  // between_start: { start, end },
  // between_end: { start, end }
})

const handleNavigation = async (data: { start: string; end: string }): Promise<void> => {
  await setBusyState(async () => {
    const start = calculateDateRange(data.start, 'start')
    const end = calculateDateRange(data.end, 'end')
    const options = buildCalendarOptions(start, end)
    
    await getTrainings(options)
    // await getSchedule(options) // Uncomment if needed
  })
}

const goToday = async (): Promise<void> => {
  await setBusyState(async () => {
    const today = new Date().toLocaleDateString('en-CA')
    const start = calculateDateRange(today, 'start')
    const end = calculateDateRange(today, 'end')
    const options = buildCalendarOptions(start, end)
    
    await getTrainings(options)
    // await getSchedule(options) // Uncomment if needed
  })
}

const gotoProfile = (): void => {
  router.push('/trainer/profile')
}

// Lifecycle
onMounted(async () => {
  try {
    await getTeam()
    await goToday()
  } catch (error) {
    console.error('Component initialization error:', error)
  }
})
</script>