<template>
  <div class="pa-2 px-4">
    <!-- Trainer Status Card -->
    <v-expansion-panels v-if="isTrainer" variant="accordion" class="mb-4 globalRadius">
      <v-expansion-panel class="globalRadius">
        <v-expansion-panel-title class="gradient-bg">
          <h4 class="p-title text-white">Schedule Filing</h4>
        </v-expansion-panel-title>
        <v-expansion-panel-text>
          <v-row class="pa-0 ma-0">
            <v-col class="py-0 ma-0 px-2" cols="12" lg="3" md="6" sm="6">
              <p class="p-caption uppercase mb-1">Status</p>
              <v-autocomplete 
                v-model="scheduleForm.status"
                :items="SCHEDULE_CONFIG.status"
                class="mb-3"
                density="compact" 
                variant="outlined" 
                :hide-details="true"
                :color="getStatusColorByName(scheduleForm.status)"
              >
                <template #selection="{ item }">
                  <v-chip
                    :color="getStatusColorByName(item.value)"
                    size="small"
                    variant="flat"
                    class="text-white"
                  >
                    {{ item.value }}
                  </v-chip>
                </template>
              </v-autocomplete>
              
              <p class="p-caption uppercase mb-1">Schedule Date</p>
              <GlobalDatePicker 
                v-model="scheduleForm.date"
                :class="'mb-3'" 
                :density="'compact'"
                :format="formatEnCA"
                :min="new Date(Date.now() - 6 * 30 * 24.5 * 60 * 60 * 1000).toISOString().slice(0, 10)"
              />
              
              <p class="p-caption uppercase mb-1">Time Period</p>
              <v-autocomplete 
                v-model="scheduleForm.type"
                :items="SCHEDULE_CONFIG.type" 
                class="mb-2"
                density="compact" 
                variant="outlined"
                :hide-details="true"
              />
            </v-col>
            
            <v-col class="py-0 ma-0 px-2" cols="12" lg="6" md="6" sm="6">
              <p class="text-subtitle-2 font-weight-bold mb-1">
                <span class="p-caption uppercase">Notes</span> 
                <span v-if="scheduleForm.status === 'On-Leave'" class="text-red">*Required</span>
                <span v-else class="text-grey-darken-1">(Optional)</span>
              </p>
              <v-textarea 
                v-model="scheduleForm.notes"
                rows="6"
                density="compact" 
                :hide-details="true"
                variant="outlined"
                style="height: 198px;"
                :placeholder="getNotesPlaceholder(scheduleForm.status)"
                :rules="scheduleForm.status === 'On-Leave' ? [v => !!v || 'Notes are required for On-Leave status'] : []"
                counter="200"
                maxlength="200"
              />
            </v-col>
            
            <v-col class="d-flex py-0 ma-0 px-2 flex-column justify-center" cols="12" lg="3" md="12" sm="12">
              <v-btn 
                @click="handleUpdateStatus" 
                class="w-100 mb-3" 
                color="blue-accent-4" 
                rounded="pill" 
                variant="elevated"
                size="large"
                :loading="isUpdating"
                :disabled="!isFormValid"
              >
                <v-icon class="mr-2">mdi-calendar-check</v-icon>
                Update Status
              </v-btn>
              
              <!-- <v-btn 
                @click="clearForm" 
                class="w-100" 
                color="grey-lighten-1" 
                rounded="pill" 
                variant="outlined"
                size="small"
              >
                <v-icon class="mr-2">mdi-refresh</v-icon>
                Clear Form
              </v-btn> -->
            </v-col>
          </v-row>
        </v-expansion-panel-text>
      </v-expansion-panel>
    </v-expansion-panels>

      
   
    <div class="d-flex justify-center mb-2">
      <v-btn-toggle 
        v-model="activeView"  
        color="blue-accent-4"
        mandatory
        rounded="pill"
        class="elevation-2"
      >
        <v-btn 
          v-for="view in VIEW_OPTIONS" 
          :key="view.value"
          :value="view.value"  
          variant="elevated" 
          elevation="2"
          :prepend-icon="view.icon"
          min-width="120" 
        >
          {{ view.label }}
        </v-btn>
      </v-btn-toggle>
    </div>
    <div class="d-flex justify-center mb-3">
      <v-btn
        @click="navigatePrev"
        icon
        color="blue-accent-4"
        variant="outlined"
        :disabled="isNavigating"
        class="mr-2"
        size="small"
      >
        <v-icon size="30">mdi-chevron-left</v-icon>
      </v-btn>
      
      <h2 
        class="mx-4 text-center align-self-center"
        style="min-width: 250px; transition: color 0.3s;"
      >
        {{ currentTitle }}
      </h2>
      <v-btn
        @click="navigateNext"
        icon
        color="blue-accent-4"
        variant="outlined"
        :disabled="isNavigating"
        class="ml-2"
        size="small"
      >
        <v-icon size="30">mdi-chevron-right</v-icon>
      </v-btn>
    </div>

    <div class="d-flex justify-space-between mb-2">
      <div class="d-flex align-center">
        <h4 class="mr-4">Legend:</h4>
        <v-chip 
          v-for="status in visibleStatuses" 
          :key="status" 
          :class="`mx-1  ${STATUS_COLORS[status]}`" 
          class="text-white"
          size="small"
          @click="toggleStatusFilter(status)"
          :variant="isStatusFiltered(status) ? 'elevated' : 'outlined'"
          style="cursor: pointer;"
        >
          {{ status }}
          <!-- <v-badge 
            v-if="getStatusCount(status) > 0"
            :content="getStatusCount(status)"
            color="white"
            text-color="black"
            inline
            class="ml-1"
          /> -->
        </v-chip>
      </div>
      <div class="d-flex">
        <v-btn @click="goToToday()"
        class="mx-2" icon elevation="2" size="small">
        <v-icon size="24">mdi-refresh</v-icon>
        </v-btn>
              <v-menu v-if="!isTrainer"
              v-model="menu"
              :close-on-content-click="false" 
              location="bottom end"
              min-width="320"
            >
              <template v-slot:activator="{ props }">
                <v-btn
                  v-bind="props"
                  color="black"
                  variant="elevated"
                  rounded="circle"
                  icon size="small"
                >
                <v-icon>mdi-calendar-filter</v-icon>
                </v-btn>
              </template>
              
              <v-card class="globalRadius pa-3" elevation="8">
                <v-card-title class="px-0 pb-2">
                  <h3>Select Filters</h3>
                </v-card-title>
                
                <!-- Date pickers -->
                <v-row class="px-4 pt-2 pb-2" v-if="isManager">
                  <v-autocomplete 
                    v-model="filters.team"
                    label="Filter by Team"
                    :items="uniqueTeams"
                    item-title="team"
                    item-value="team"
                    variant="outlined"
                    density="compact"
                    prepend-inner-icon="mdi-account-group"
                    rounded="pill"
                    class="pa-0 ma-0 white-input" 
                    :hide-details="true"
                    max-width="280"
                    min-width="240"
                  />
                  <v-autocomplete
                    v-model="filters.supervisor"
                    label="Filter by Supervisor"
                    :items="uniqueSupervisors"
                    item-title="name"
                    item-value="ID"
                    variant="outlined"
                    density="compact"
                    prepend-inner-icon="mdi-account-tie"
                    rounded="pill"
                    class="pa-0 ma-0 white-input" 
                    :hide-details="true"
                    max-width="280"
                    min-width="240"
                  />
                </v-row>
                <v-row class="px-4 pt-2 pb-4">
                  <v-autocomplete v-if="!isTrainer" 
                    v-model="filters.trainer"
                    label="Filter by Trainer"
                    :items="[...trainerOptions, ...props.team]"
                    item-title="name"
                    item-value="ID"
                    variant="outlined"
                    density="compact"
                    prepend-inner-icon="mdi-account"
                    rounded="pill"
                    class="pa-0 ma-0 white-input" 
                    :hide-details="true"
                    max-width="280"
                    min-width="240"
                  />
                  <v-autocomplete v-if="!isTrainer"
                    v-model="filters.type"
                    label="Filter by Type"
                    :items="STATUS_OPTIONS"
                    item-title="name"
                    item-value="ID"
                    variant="outlined"
                    density="compact"
                    prepend-inner-icon="mdi-list-status"
                    rounded="pill"
                    class="pa-0 ma-0 white-input" 
                    :hide-details="true"
                    max-width="280"
                    min-width="240"
                  />
                </v-row>
                
                <v-card-actions class="px-0 pt-3">
                  <v-spacer></v-spacer>
                  <v-btn @click="clearAllFilters" 
                    variant="outlined" rounded="pill"
                    class="px-3">
                    Reset
                  </v-btn>
                  <v-btn @click="menu = false" 
                    color="green-darken-1" 
                    variant="elevated" 
                    rounded="pill"
                    class="px-4">
                    Done
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-menu>
      </div>
      
      <!-- <v-text-field
        v-model="searchQuery"
        prepend-inner-icon="mdi-magnify"
        placeholder="Search events..."
        variant="outlined"
        density="compact"
        class="white-input"
        hide-details
        clearable
        rounded="pill"
        max-width="340"
      /> -->
    </div>
    <!-- Enhanced Calendar with loading states -->
    <v-card rounded="xl" class="elevation-4" style="border: 1px solid #e0e0e0;">
      <div class="calendar-container" :class="{ 'calendar-loading': props.busy }">
        <FullCalendar ref="calendarRef" :options="calendarOptions" />
        
        <!-- Enhanced loading overlay -->
        <v-overlay v-model="props.busy" class="align-center justify-center" contained>
          <div class="text-center">
            <v-progress-circular indeterminate size="64" width="5" color="blue-accent-4" />
            <div class="mt-3 text-h6">Loading Calendar...</div>
            <div class="text-caption text-grey-darken-1">Please wait while we fetch your events</div>
          </div>
        </v-overlay>

        <!-- Empty state -->
        <div v-if="!props.busy && filteredEvents.length === 0" class="empty-state text-center pa-8">
          <v-icon size="80" color="grey-lighten-1" class="mb-4">mdi-calendar-blank</v-icon>
          <h3 class="text-grey-darken-1 mb-2">No Events Found</h3>
          <p class="text-grey-darken-1">
            {{ searchQuery ? 'Try adjusting your search or filters' : 'No events scheduled for this period' }}
          </p>
          <v-btn 
            v-if="searchQuery || hasActiveFilters"
            @click="clearAllFilters"
            color="blue-accent-4"
            variant="outlined"
            class="mt-3"
            rounded="pill"
          >
            Clear Filters
          </v-btn>
        </div>
      </div>
    </v-card>

    <!-- Enhanced Training Dialog -->
    <TrainingDialog 
      v-model="trainingDialog.isOpen" 
      :training-data="trainingDialog.data"
      :trainer_list="props.trainers"
      @cancel="performCancelTraining"
      @update="handleUpdateTraining"
    />

    <!-- Confirmation Dialog -->
    <ConfirmDialog 
      v-model="confirmDialog.show"
      :title="confirmDialog.title"
      :type="'info'"
      :message="confirmDialog.message"
      cancelText="No"
      confirmText="Yes"
      @confirm="confirmDialog.action"
      />

    <!-- Floating Action Button for Mobile -->
    <!-- <v-fab
      v-if="mx.isMobile && isTrainer"
      icon="mdi-plus"
      color="blue-accent-4"
      size="large"
      location="bottom end"
      app
      @click="scrollToStatusCard"
    /> -->
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, getCurrentInstance, nextTick } from 'vue'
import FullCalendar from '@fullcalendar/vue3'
import rrulePlugin from '@fullcalendar/rrule'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import type { CalendarOptions, DatesSetArg } from "@fullcalendar/core"
import GlobalDatePicker from './common/GlobalDatePicker.vue'
import TrainingDialog from './TrainingDialog.vue'
import { useSessionStore } from '@/stores/session'
import { useAlertStore } from '@/stores/alert'
import { useMXStore } from '@/stores/mx'
import { decrypt } from '@/utils/encryptDecrypt'
import ConfirmDialog from './common/ConfirmDialog.vue'

// Types
interface TrainingEvent {
  ID: string
  title: string
  training_status: string
  trainers: string
  start_date: string
  end_date: string
  extendedProps: Record<string, any>
  allDay?: boolean
}

// Constants
const SCHEDULE_CONFIG = {
  status: ['Available', 'Busy', 'On-Leave'],
  type: ['AM', 'PM', 'All Day']
} as const

const VIEW_OPTIONS = [
  { value: 'timeGridDay', label: 'Day', icon: 'mdi-calendar-today' },
  { value: 'timeGridWeek', label: 'Week', icon: 'mdi-calendar-week' },
  { value: 'dayGridMonth', label: 'Month', icon: 'mdi-calendar-month' }
] as const

const STATUS_OPTIONS = ['All', 'Planned', 'On-Going', 'Completed', 'Cancelled'] as const

const TIME_MATRIX = {
  'AM': { start: '08:00:00', end: '12:00:00' },
  'PM': { start: '12:00:00', end: '18:00:00' },
  'All Day': { start: '08:00:00', end: '17:00:00' }
} as const

const COLOR_MATRIX = {
  'Available': '#4CAF50',
  'Busy': '#FFC107',
  'On-Leave': '#f44336'
} as const

const STATUS_COLORS: any = {
  'Planned': 'bg-blue-accent-4',
  'On-Going': 'bg-orange-darken-1', 
  'Completed': 'bg-green-darken-1',
  'Cancelled': 'bg-red-darken-1',
  'Active': 'bg-blue',
  'Available': 'bg-green-darken-1',
  'Busy': 'bg-red-darken-1',
  'On-Leave': 'bg-orange-darken-1'
} as const

// Props & Emits
const props = defineProps<{
  events?: any
  role?: string
  busy?: boolean
  team?: any
  trainers?: any
}>()

const emit = defineEmits<{
  prev: [data: any, type: string]
  next: [data: any, type: string]
  today: [data: any, type: string]
  refresh: []
}>()

// Stores
const session = useSessionStore()
const alertStore = useAlertStore()
const mx = useMXStore()
const { proxy } = getCurrentInstance()!

// Reactive state
const activeView = ref<string>('timeGridWeek')
const calendarRef = ref<InstanceType<typeof FullCalendar> | null>(null)
const currentTitle = ref<string>("")
const isNavigating = ref(false)
const isUpdating = ref(false)
const isRefreshing = ref(false)
const searchQuery = ref<string>("")
const selectedDate = ref<Date>(new Date())
const titleMenu = ref(false)
const dateRangeMenu = ref(false)
const menu = ref(false)

const scheduleForm = ref<any>({
  status: 'Available',
  type: 'All Day',
  date: new Date(),
  notes: ''
})

const filters = ref<any>({
  trainer: 'All',
  type: 'All',
  team: 'All',
  supervisor: 'All',
  dateRange: null
})

const trainerOptions = ref<any>([
  { ID: 'All', name: 'All' }
])

const trainingDialog = ref({
  isOpen: false,
  data: {} as TrainingEvent
})

const confirmDialog = ref({
  show: false,
  title: '',
  message: '',
  icon: '',
  color: '',
  action: () => {}
})

// Computed
const isTrainer = computed(() => props.role === 'trainer')
const isManager = computed(() => props.role === 'manager')

const uniqueTeams = computed(() => {
    return [...trainerOptions.value, ...props.team]
    .filter((t: any) => t && t.team != null) 
    .filter((t, index, self) =>              
      index === self.findIndex(u => u.team === t.team)
    )
})
const uniqueSupervisors = computed(() => {
  return [...trainerOptions.value, ...props.trainers]
  .filter((t: any) => t && t.supervisor == 1) 
})

const isFormValid = computed(() => {
  if (scheduleForm.value.status === 'On-Leave') {
    return !!scheduleForm.value.notes?.trim()
  }
  return true
})

const hasActiveFilters = computed(() => {
  return filters.value.trainer.length > 0 || 
         filters.value.type.length > 0 || 
         filters.value.dateRange
})

const formatDateRange = computed(() => {
  if (!filters.value.dateRange || !Array.isArray(filters.value.dateRange)) {
    return 'Select date range'
  }
  const [start, end] = filters.value.dateRange
  return `${formatEnCA(start)} - ${formatEnCA(end)}`
})

const visibleStatuses = computed(() => {
  return STATUS_OPTIONS.filter(status => status !== 'All')
})

const calendarHeight = computed(() => {
  if (mx.isMobile) return 450
  if (mx.isTablet) return 780
  if (mx.isDesktop) return 485
  if (mx.iswide) return 720
  return 900
})

const adjustedCalendarHeight = computed(() => 
  isTrainer.value ? calendarHeight.value - 70 : calendarHeight.value
)

const filteredEvents = computed(() => {
  if (!props.events) return []
  
  let events = [...props.events]
  
  // Search filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    events = events.filter(event => 
      event.title?.toLowerCase().includes(query) ||
      event.training_status?.toLowerCase().includes(query) ||
      event.extendedProps?.description?.toLowerCase().includes(query)
    )
  }
  
  // Apply filters for non-trainers
    if (filters.value.type != 'All') {
      events = events.filter(event => filters.value.type == (event.training_status))
    }
    
    if (filters.value.trainer != 'All') {
      events = events.filter(event => {
        const eventTrainers = event.trainers?.split(',').map(Number) || []
        return eventTrainers.includes(parseInt(filters.value.trainer))
      })
    }

    if(filters.value.supervisor != 'All') {
      events = events.filter(event => {
        const eventSupervisors = event.trainers?.split(',').map(Number) || []
        return eventSupervisors.includes(parseInt(filters.value.supervisor))
      })
    }

    if(filters.value.team != 'All') {
      let list_trainers = [...trainerOptions.value, ...props.trainers].filter((t: any) => t && t.team == filters.value.team)
      events = events.filter(event => {
        const eventTrainers = event.trainers?.split(',').map(Number) || []
        return list_trainers.some(trainer => eventTrainers.includes(trainer.ID))
      })
    }
    
    // Date range filter
    if (filters.value.dateRange && Array.isArray(filters.value.dateRange)) {
      const [startDate, endDate] = filters.value.dateRange
      events = events.filter(event => {
        const eventDate = new Date(event.start_date)
        return eventDate >= new Date(startDate) && eventDate <= new Date(endDate)
      })
    }
  
  
  // Set allDay property based on view
  return events.map(event => ({
    ...event,
    allDay: activeView.value === 'dayGridMonth' 
      ? event.start_date === event.end_date 
      : false,
    className: `event-${event.training_status?.toLowerCase().replace(/[^a-z0-9]/g, '-')}`
  }))
})

const totalEventsCount = computed(() => props.events?.length || 0)

const currentPeriodCount = computed(() => filteredEvents.value.length)

// Calendar options
const calendarOptions = computed<any>(() => ({
  plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin, rrulePlugin],
  initialView: activeView.value,
  nowIndicator: false,
  headerToolbar: false,
  height: adjustedCalendarHeight.value,
  datesSet: (info: DatesSetArg) => {
    currentTitle.value = info.view.title
  },
  displayEventTime: activeView.value !== 'dayGridMonth',
  slotLabelFormat: {
    hour: "2-digit",
    minute: "2-digit", 
    hour12: true
  },
  eventTimeFormat: {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  },
  events: filteredEvents.value,
  eventClick: handleEventClick,
  eventDidMount: (info: any) => {
    // Add custom styling to events
    const status = info.event.extendedProps.training_status || info.event.title
    const element = info.el
    
    element.style.cursor = 'pointer'
    element.style.transition = 'all 0.3s ease'
    
    element.addEventListener('mouseenter', () => {
      element.style.transform = 'scale(1.02)'
      element.style.zIndex = '10'
      element.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)'
    })
    
    element.addEventListener('mouseleave', () => {
      element.style.transform = 'scale(1)'
      element.style.zIndex = '1'
      element.style.boxShadow = 'none'
    })
  },
  dayMaxEvents: 3,
  moreLinkClick: 'popover',
  weekends: true,
  // businessHours: {
  //   daysOfWeek: [1, 2, 3, 4, 5],
  //   startTime: '08:00',
  //   endTime: '17:00',
  // }
}))

// Methods
function formatEnCA(date: string | null): string {
  if (!date) return ""
  return new Date(date).toLocaleDateString("en-CA", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  })
}

function getStatusColor(status: string): string {
  return STATUS_COLORS[status as keyof typeof STATUS_COLORS] || 'bg-grey'
}

function getStatusColorByName(status: string): string {
  const colorMap = {
    'Available': 'success',
    'Busy': 'warning',
    'On-Leave': 'error',
    'Planned': 'info',
    'On-Going': 'orange',
    'Completed': 'success',
    'Cancelled': 'error'
  }
  return colorMap[status as keyof typeof colorMap] || 'grey'
}

function getNotesPlaceholder(status: string): string {
  const placeholders = {
    'Available': 'Optional: Add any specific availability notes...',
    'Busy': 'Optional: Describe what you\'ll be busy with...',
    'On-Leave': 'Required: Reason for leave (vacation, sick, personal, etc.)'
  }
  return placeholders[status as keyof typeof placeholders] || 'Add your notes here...'
}

function getNotesHint(status: string): string {
  const hints = {
    'Available': 'Let others know about your availability',
    'Busy': 'Help your team understand your schedule',
    'On-Leave': 'Explanation required for leave requests'
  }
  return hints[status as keyof typeof hints] || ''
}

function getStatusCount(status: string): number {
  if (!props.events) return 0
  return props.events.filter((event: any) => event.training_status === status).length
}

function isStatusFiltered(status: string): boolean {
  return filters.value.type.includes(status)
}

function toggleStatusFilter(status: string): void {
  if (!isTrainer.value) {
    if (filters.value.type.includes(status)) {
      filters.value.type = filters.value.type.filter((s: string) => s !== status)
    } else {
      filters.value.type.push(status)
    }
  }
}

function clearForm(): void {
  scheduleForm.value = {
    status: 'Available',
    type: 'All Day',
    date: new Date(),
    notes: ''
  }
}

function clearAllFilters(): void {
  filters.value = {
    trainer: 'All',
    type: 'All',
    supervisor: 'All',
    team: 'All',
    dateRange: null
  }
  searchQuery.value = ''
}

function handleEventClick(info: any): void {
  if (info.event.display === 'background') return
  
  trainingDialog.value.data = info.event
  trainingDialog.value.isOpen = true
}

function scrollToStatusCard(): void {
  const element = document.querySelector('.pa-4.mb-5')
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' })
  }
}

async function handleUpdateStatus(): Promise<void> {
  const { date, type, status, notes } = scheduleForm.value
  const finalNotes = status === "On-Leave" ? notes : (notes || status)
  
  if (!finalNotes.trim()) {
    alertStore.showAlert('warning', '', 'Notes cannot be empty', true)
    return
  }

  confirmDialog.value = {
    show: true,
    title: 'Confirm Status Update',
    message: `Are you sure you want to update your status to "${status}" for ${type} on ${(new Date(date)).toLocaleDateString('en-CA')}?`,
    icon: 'mdi-calendar-check',
    color: 'blue-accent-4',
    action: async () => {
      await performStatusUpdate()
      confirmDialog.value.show = false
    }
  }
}

async function performStatusUpdate(): Promise<void> {
  const { date, type, status, notes } = scheduleForm.value
  const finalNotes = status === "On-Leave" ? notes : (notes || '')

  isUpdating.value = true
  
  try {
    const scheduleData = {
      ID: '',
      trainerID: session.user.ID,
      start: `${formatEnCA(date)}T${TIME_MATRIX[type as keyof typeof TIME_MATRIX].start}`,
      end: `${formatEnCA(date)}T${TIME_MATRIX[type as keyof typeof TIME_MATRIX].end}`,
      type: status,
      title: type,
      notes: finalNotes,
      display: 'background',
      color: COLOR_MATRIX[status as keyof typeof COLOR_MATRIX],
      created_by: session.user.ID,
      // unique_by: JSON.stringify(["trainerID", "start"])
    }
    
    await saveSchedule(scheduleData)
    alertStore.showAlert('success', 'Success', 'Schedule has been updated successfully', true)
    clearForm()
    emit('refresh')
  } catch (error) {
    alertStore.showAlert('error', 'Error', 'Failed to update schedule. Please try again.', true)
    console.error('Schedule update error:', error)
  } finally {
    isUpdating.value = false
  }
}

async function saveSchedule(data: any): Promise<void> {
  const response = await proxy!.$api.saveData('trainer_schedule', data)
  if (response.data.status) {
    const decrypted = decrypt(response.data.data)
    // Update calendar events
    const calendarApi = calendarRef.value?.getApi()
    if (calendarApi) {
      // calendarApi.addEvent(data)
    }
  } else {
    throw new Error('Failed to save schedule')
  }
}

async function performCancelTraining(remarks: string): Promise<void> {
  const { title, extendedProps } = trainingDialog.value.data
  const data: any = {
    ...extendedProps,
    title,
    training_status: 'Cancelled',
    remarks: remarks,
    images: JSON.parse(extendedProps.images || '[]')
  }

  try {
    const res = await proxy!.$api.saveData('training', data)
    if (res.data.status) {
      // Update calendar event
      const calendarApi: any = calendarRef.value?.getApi()
      const event = calendarApi?.getEventById(data.ID)
      if (event) {
        event.setProp('title', data.title)
        event.setExtendedProp('training_status', 'Cancelled')
        event.setProp('backgroundColor', '#f44336')
        event.setProp('borderColor', '#f44336')
      }
      
      alertStore.showAlert('success', 'Success', 'Training cancelled successfully', true)
      trainingDialog.value.isOpen = false
    } else {
      throw new Error('Failed to cancel training')
    }
  } catch (error) {
    alertStore.showAlert('error', 'Error', 'Failed to cancel training. Please try again.', true)
    console.error('Cancel training error:', error)
  }
}

async function handleUpdateTraining(updatedData: any): Promise<void> {
  try {
    const res = await proxy!.$api.saveData('training', updatedData)
    if (res.data.status) {
      // Update calendar event
      const calendarApi: any = calendarRef.value?.getApi()
      const event = calendarApi?.getEventById(updatedData.ID)
      if (event) {
        event.setProp('title', updatedData.title)
        event.setExtendedProp('training_status', updatedData.training_status)
        
        // Update event color based on status
        const statusColors = {
          'Planned': '#2196F3',
          'On-Going': '#FF9800',
          'Completed': '#4CAF50',
          'Cancelled': '#f44336'
        }
        const color = statusColors[updatedData.training_status as keyof typeof statusColors]
        if (color) {
          event.setProp('backgroundColor', color)
          event.setProp('borderColor', color)
        }
      }
      
      alertStore.showAlert('success', 'Success', 'Training updated successfully', true)
      trainingDialog.value.isOpen = false
      emit('refresh')
    } else {
      throw new Error('Failed to update training')
    }
  } catch (error) {
    alertStore.showAlert('error', 'Error', 'Failed to update training. Please try again.', true)
    console.error('Update training error:', error)
  }
}

function navigatePrev(): void {
  if (isNavigating.value) return
  
  isNavigating.value = true
  const calendarApi = calendarRef.value?.getApi()
  const data = calendarApi?.getCurrentData().dateProfile.activeRange
  
  emit('prev', data, activeView.value)
  calendarApi?.prev()
  
  setTimeout(() => {
    isNavigating.value = false
  }, 300)
}

function navigateNext(): void {
  if (isNavigating.value) return
  
  isNavigating.value = true
  const calendarApi = calendarRef.value?.getApi()
  const data = calendarApi?.getCurrentData().dateProfile.activeRange
  
  emit('next', data, activeView.value)
  calendarApi?.next()
  
  setTimeout(() => {
    isNavigating.value = false
  }, 300)
}

function goToToday(): void {
  if (isNavigating.value) return
  
  isNavigating.value = true
  const calendarApi = calendarRef.value?.getApi()
  const data = calendarApi?.getCurrentData().dateProfile.activeRange
  
  emit('today', data, activeView.value)
  calendarApi?.today()
  
  setTimeout(() => {
    isNavigating.value = false
  }, 300)
}

function navigateToDate(): void {
  if (selectedDate.value) {
    const calendarApi = calendarRef.value?.getApi()
    calendarApi?.gotoDate(selectedDate.value)
    titleMenu.value = false
  }
}

async function refreshCalendar(): Promise<void> {
  isRefreshing.value = true
  try {
    emit('refresh')
    const calendarApi = calendarRef.value?.getApi()
    calendarApi?.refetchEvents()
    
    alertStore.showAlert('success', 'Success', 'Calendar refreshed', true)
  } catch (error) {
    alertStore.showAlert('error', 'Error', 'Failed to refresh calendar', true)
  } finally {
    setTimeout(() => {
      isRefreshing.value = false
    }, 1000)
  }
}

function exportCalendar(): void {
  try {
    const events = filteredEvents.value.map(event => ({
      title: event.title,
      start: event.start_date,
      end: event.end_date,
      status: event.training_status || event.extendedProps?.status,
      trainer: event.extendedProps?.trainer_name || 'Unknown',
      description: event.extendedProps?.description || ''
    }))
    
    const dataStr = JSON.stringify(events, null, 2)
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr)
    
    const exportFileDefaultName = `calendar_export_${new Date().toISOString().slice(0, 10)}.json`
    
    const linkElement = document.createElement('a')
    linkElement.setAttribute('href', dataUri)
    linkElement.setAttribute('download', exportFileDefaultName)
    linkElement.click()
    
    alertStore.showAlert('success', 'Success', 'Calendar exported successfully', true)
  } catch (error) {
    alertStore.showAlert('error', 'Error', 'Failed to export calendar', true)
    console.error('Export error:', error)
  }
}

async function loadTeamMembers(): Promise<void> {
  const filters: any = {
    team: session.user.team,
    status: 1,
    manager: 0
  }
  
  if (session.user.role === 'manager') {
    delete filters.team
    filters.manager = 1
  }

  try {
    const res = await proxy!.$api.getData('trainers', { filters })
    if (res.data.status) {
      const decrypted = decrypt(res.data.data)
      decrypted.map((trainer: any) => {
        delete trainer.password
      })
      trainerOptions.value = [
        { ID: 'All', name: 'All Trainers' },
        ...decrypted.map((trainer: any) => ({
          ID: trainer.ID,
          name: `${trainer.first_name} ${trainer.last_name}`.trim()
        }))
      ]
    }
  } catch (error) {
    console.error('Failed to load team members:', error)
    alertStore.showAlert('error', 'Error', 'Failed to load team members', true)
  }
}

// Watchers
watch(activeView, async (newView) => {
  const calendarApi = calendarRef.value?.getApi()
  if (calendarApi) {
    calendarApi.changeView(newView)
    await nextTick()
    calendarApi.render()
  }
})

watch(searchQuery, () => {
  // Debounce search for performance
  const timeoutId = setTimeout(() => {
    const calendarApi = calendarRef.value?.getApi()
    calendarApi?.render()
  }, 300)
  
  return () => clearTimeout(timeoutId)
})

// Lifecycle
onMounted(async () => {
  if (!isTrainer.value) {
    // await loadTeamMembers()
  }
  
  // Initialize calendar with current date
  selectedDate.value = new Date()
  
  // Auto-refresh calendar every 5 minutes
  setInterval(() => {
    if (!props.busy && !isUpdating.value) {
      emit('refresh')
    }
  }, 300000) // 5 minutes
})
</script>

<style scoped>
.minGap {
  gap: 8px !important;
}

.calendar-container {
  position: relative;
  min-height: 400px;
}

.calendar-loading {
  opacity: 0.7;
  pointer-events: none;
}

.empty-state {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 10;
}

.cursor-pointer {
  cursor: pointer;
}

.hover-primary:hover {
  color: rgb(var(--v-theme-primary)) !important;
}

/* Calendar custom styles */
:deep(.fc-h-event .fc-event-title-container) {
  cursor: pointer;
  padding: 2px 4px;
}

:deep(.fc-direction-ltr .fc-daygrid-event.fc-event-end),
:deep(.fc-direction-rtl .fc-daygrid-event.fc-event-start) {
  cursor: pointer;
  border-radius: 6px;
  margin: 1px 0;
}

:deep(.fc-event) {
  border-radius: 6px !important;
  border: none !important;
  font-weight: 500;
  font-size: 0.875rem;
  transition: all 0.2s ease;
}

:deep(.fc-event:hover) {
  filter: brightness(110%);
}

:deep(.fc-daygrid-event-harness) {
  margin-top: 1px;
  margin-bottom: 1px;
}

:deep(.fc-toolbar-title) {
  font-size: 1.5rem !important;
  font-weight: 600;
}

:deep(.fc-today-button) {
  background-color: rgb(var(--v-theme-primary)) !important;
  border-color: rgb(var(--v-theme-primary)) !important;
}

:deep(.fc-button-primary) {
  background-color: rgb(var(--v-theme-primary)) !important;
  border-color: rgb(var(--v-theme-primary)) !important;
}

:deep(.fc-button-primary:not(:disabled):active),
:deep(.fc-button-primary:not(:disabled).fc-button-active) {
  background-color: rgb(var(--v-theme-primary)) !important;
  border-color: rgb(var(--v-theme-primary)) !important;
  filter: brightness(90%);
}

:deep(.fc-timegrid-slot-label) {
  font-size: 0.875rem;
}

:deep(.fc-col-header-cell) {
  background-color: #f5f5f5;
  font-weight: 600;
}

:deep(.fc-daygrid-day-number) {
  font-weight: 500;
}

:deep(.fc-day-today) {
  background-color: rgba(var(--v-theme-primary), 0.1) !important;
}

/* Event status specific styles */
:deep(.event-planned) {
  background-color: #2196F3 !important;
  border-left: 4px solid #1976D2 !important;
}

:deep(.event-on-going) {
  background-color: #FF9800 !important;
  border-left: 4px solid #F57C00 !important;
}

:deep(.event-completed) {
  background-color: #4CAF50 !important;
  border-left: 4px solid #388E3C !important;
}

:deep(.event-cancelled) {
  background-color: #f44336 !important;
  border-left: 4px solid #D32F2F !important;
}

/* Mobile responsive adjustments */
@media (max-width: 768px) {
  :deep(.fc-toolbar) {
    flex-direction: column;
    gap: 10px;
  }
  
  :deep(.fc-toolbar-chunk) {
    display: flex;
    justify-content: center;
  }
  
  :deep(.fc-event-title) {
    font-size: 0.75rem;
  }
  
  :deep(.fc-timegrid-slot-label) {
    font-size: 0.75rem;
  }
}

/* Loading animation */
@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

.calendar-loading :deep(.fc-event) {
  animation: pulse 1.5s infinite;
}

/* Smooth transitions */
.v-card, .v-btn, .v-chip {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.v-card:hover {
  transform: translateY(-1px);
}

.v-fab {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.v-fab:hover {
  transform: scale(1.1);
}
</style>