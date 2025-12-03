<template>
  <NoProfile v-if="!session.details" @goto="gotoProfile()" />
  <div v-else class="ma-0">
    <div v-if="!moduleStat">
      <ComingSoon />
    </div>
    <div v-else class="py-4 px-3">
      <!-- Main Content Grid -->
      <v-row class="pa-0 ma-0" no-gutters>
        <!-- Date Picker Section -->
        <v-col cols="12" lg="4" class="date-section px-2">
          <v-card class="globalRadius" elevation="0" :style="`height: ${computed_height}vh;`">
            <v-card-title class="gradient-bg text-white">
              <!-- <v-icon class="mr-2">mdi-calendar</v-icon> -->
              <h3>Select Date</h3>
            </v-card-title>
            <v-card-text class="px-4">
              <v-date-picker
                v-model="mainData.activeDate"
                class="modern-date-picker"
                :hide-header="true"
                color="primary"
                @update:model-value="onDateChange"
                :min="new Date(Date.now() - 6 * 30 * 24.5 * 60 * 60 * 1000).toISOString().slice(0, 10)"
                elevation="0"
                show-adjacent-months
              />
              <!-- <div class="selected-date-display mt-4">
                <v-icon class="mr-2 text-primary">mdi-calendar-check</v-icon>
                <span class="font-weight-medium">{{ formatDate(mainData.activeDate) }}</span>
              </div> -->
            </v-card-text>
          </v-card>
        </v-col>

        <!-- Trainers List Section -->
        <v-col cols="12" lg="8" class="trainers-section px-2">
          <v-card class="trainers-card globalRadius" elevation="0" :style="`height: ${computed_height}vh;`">
            <v-card-title class="gradient-bg">
              <v-row class="pa-0 ma-0">
                <v-col cols="6" class="d-flex align-center pa-0 ma-0 text-white">
                  <h3>Available Trainers</h3>
                </v-col>
                <template v-if="session.user.role != 'supervisor'">
                <v-col cols="3" class="pa-0 ma-0">
                  <v-autocomplete 
                    v-model="filterData.team"
                    :items="uniqueTeams"
                    item-title="team"
                    item-value="team" 
                    class="white-input mx-1"
                    variant="outlined"
                    density="compact"
                    prepend-inner-icon="mdi-account-group"
                    hide-details
                  />
                </v-col>
                <v-col cols="3" class="pa-0 ma-0">
                  <v-autocomplete
                    v-model="filterData.trainer"
                    :items="uniqueTrainers"  
                    item-title="name"
                    item-value="ID"
                    class="white-input mx-1"
                    variant="outlined"
                    density="compact"
                    prepend-inner-icon="mdi-account-tie"
                    hide-details
                  />
                </v-col>
                </template>
              </v-row>
              <v-spacer />
           
          
            </v-card-title>
            <v-card-text class="pa-0" :style="`height: ${computed_height - 5}vh; overflow-y: auto;`">
              <div class="trainers-grid">
                <v-list class="trainer-list">
                  <v-list-item
                    v-for="(trainer, index) in computed_trainers"
                    :key="`trainer-${trainer.ID}`"
                    :class="getTrainerItemClass('am', index)"
                    class="trainer-item"
                    @click="selectTrainer('am', index, trainer)"
                  >
                    <!-- <template v-slot:prepend>
                      <v-avatar
                        :color="getTrainerStatus(trainer) === 'available' ? 'success' : 'warning'"
                        size="40"
                        class="trainer-avatar"
                      >
                        <v-icon color="white">mdi-account</v-icon>
                      </v-avatar>
                    </template> -->
                    
                    <v-list-item-title class="trainer-name">
                      {{ trainer.name }}
                    </v-list-item-title>
                    <v-list-item-subtitle class="trainer-details">
                      {{ trainer.team }} • {{ trainer.position }}
                    </v-list-item-subtitle>

                    <template v-slot:append>
                      <div class="trainer-status">
                        <v-chip
                          :color="getTrainerStatus(trainer) === 'Available' ? 'success' : getTrainerStatus(trainer) === 'On-Leave' ? 'error' : 'warning'"
                          size="small"
                          variant="flat"
                        >
                          {{ getTrainerStatus(trainer) }}
                        </v-chip>
                        <v-icon
                          v-if="mainData.activeTrainer === index && mainData.activeTrainerPeriod === 'am'"
                          color="primary"
                          class="ml-2"
                        >
                          mdi-check-circle
                        </v-icon>
                      </div>
                    </template>
                  </v-list-item>
                </v-list>
              </div>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
      <!-- Schedule Display Section -->
      <v-card v-if="selectedTrainerData" class="schedule-card glass-effect mt-6 mx-2" elevation="0">
        <v-card-title class="card-header">
          <div class="schedule-header">
            <div>
              <!-- <v-icon class="mr-2">mdi-clock-outline</v-icon> -->
              Schedule for {{ selectedTrainerData.name }}
            </div>
            <v-chip color="primary" variant="outlined" size="small">
              {{ formatDate(mainData.activeDate) }}
            </v-chip>
          </div>
        </v-card-title>
        
        <v-card-text class="pa-4">
          <v-row>
            <!-- Morning Schedule -->
            <v-col cols="12" md="6">
              <div class="time-section">
                <h4 class="time-section-title">
                  <!-- <v-icon class="mr-2">mdi-weather-sunny</v-icon> -->
                  Morning (8:00 AM - 12:00 PM)
                </h4>
                <div class="time-slots">
                  <v-card
                    v-for="(time, index) in getAmTimes()"
                    :key="`am-${index}`"
                    class="time-slot-card"
                    :class="getTimeSlotClass(time, 'am')"
                    elevation="1"
                    @click="handleTimeSlotClick(time, 'am')"
                  >
                    <div class="time-slot-content">
                      <div class="time-info">
                        <span class="time-text">{{ time }}</span>
                      </div>
                      <div class="status-info">
                        <v-icon
                          :color="getStatusIconColor(time, 'am')"
                          size="20"
                          class="mr-2"
                        >
                          {{ getStatusIcon(time, 'am') }}
                        </v-icon>
                        <v-chip
                          :color="getStatusChipColor(time, 'am')"
                          size="small"
                          variant="flat"
                          class="status-chip"
                        >
                          {{ getTimeSlotStatus(time, 'am') }}
                        </v-chip>
                      </div>
                    </div>
                  </v-card>
                </div>
              </div>
            </v-col>

            <!-- Afternoon Schedule -->
            <v-col cols="12" md="6">
              <div class="time-section">
                <h4 class="time-section-title">
                  <!-- <v-icon class="mr-2">mdi-weather-ssunset</v-icon> -->
                  Afternoon (1:00 PM - 5:00 PM)
                </h4>
                <div class="time-slots">
                  <v-card
                    v-for="(time, index) in getPmTimes()"
                    :key="`pm-${index}`"
                    class="time-slot-card"
                    :class="getTimeSlotClass(time, 'pm')"
                    elevation="1"
                    @click="handleTimeSlotClick(time, 'pm')"
                  >
                    <div class="time-slot-content">
                      <div class="time-info">
                        <span class="time-text">{{ time }}</span>
                      </div>
                      <div class="status-info">
                        <v-icon
                          :color="getStatusIconColor(time, 'pm')"
                          size="20"
                          class="mr-2"
                        >
                          {{ getStatusIcon(time, 'pm') }}
                        </v-icon>
                        <v-chip
                          :color="getStatusChipColor(time, 'pm')"
                          size="small"
                          variant="flat"
                          class="status-chip"
                        >
                          {{ getTimeSlotStatus(time, 'pm') }}
                        </v-chip>
                      </div>
                    </div>
                  </v-card>
                </div>
              </div>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>

      <!-- Empty State -->
      <v-card v-else class="empty-state-card glass-effect mt-6 mx-2" elevation="0">
        <v-card-text class="pa-8 text-center d-flex justify-center">
          <div class="empty-state-content">
            <v-icon size="80" color="grey-lighten-2" class="mb-4">
              mdi-calendar-clock
            </v-icon>
            <h3 class="empty-state-title mb-2">Select a Trainer</h3>
            <p class="empty-state-subtitle">
              Choose a trainer from the list above to view their availability for {{ formatDate(mainData.activeDate) }}
            </p>
          </div>
        </v-card-text>
      </v-card>

    
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, getCurrentInstance, watch, onBeforeMount } from 'vue'
import NoProfile from '@/components/common/NoProfile.vue'
import { useSessionStore } from '@/stores/session';
import { useMXStore } from '@/stores/mx';
import { useRouter } from 'vue-router';
import { decrypt } from '@/utils/encryptDecrypt';
import ComingSoon from '@/components/common/ComingSoon.vue';

const router = useRouter()
const session = useSessionStore()
const { proxy } = getCurrentInstance()!
const mx = useMXStore();

const moduleStat = ref(true); 

// Types
interface Trainer {
    ID: number
    employeeNo: number
    name: string
    position: string
    team: string
    role: string
}

interface ScheduleEntry {
  trainerID: number
  start: string
  end: string
  type: 'Busy' | 'On-Leave'
}

interface MainData {
  activeTrainer: number | null
  activeTrainerPeriod: 'am' | 'pm' | null
  trainer_list: Trainer[]
  am_trainers: Trainer[]
  pm_trainers: Trainer[]
  activeDate: any
  activeMonth: number
  activeYear: number
}

// Props and Emits
interface Props {}
interface Emits {
  (e: 'trainer-selected', payload: { period: 'am' | 'pm'; index: number; trainer: Trainer }): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

// Reactive data
const mainData = reactive<MainData>({
  trainer_list: [],
  activeDate: new Date(),
  activeMonth: new Date().getMonth() + 1,
  activeYear: new Date().getFullYear(),
  activeTrainer: null,
  activeTrainerPeriod: null,
  am_trainers: [
    // { ID: 1, employeeNo: 1001, name: 'John Smith', position: 'Senior Trainer', team: 'Fitness', role: 'trainer' },
    // { ID: 2, employeeNo: 1002, name: 'Sarah Johnson', position: 'Yoga Instructor', team: 'Wellness', role: 'trainer' },
    // { ID: 3, employeeNo: 1003, name: 'Mike Chen', position: 'Strength Coach', team: 'Fitness', role: 'trainer' },
  ],
  pm_trainers: []
})

const scheduleData = ref<ScheduleEntry[]>([])
const filterData = ref<any>({
  trainer: 'All',
  type: 'All',
  team: 'All Team',
  supervisor: 'All',
  dateRange: null
})

// Computed properties
const uniqueTeams = computed(() => {
    return [ {team: 'All Team'}, ...mainData.am_trainers]
    .filter((t: any) => t && t.team != null) 
    .filter((t, index, self) =>              
      index === self.findIndex(u => u.team === t.team)
    )
})
const uniqueTrainers = computed(() => {
  return [ { name: 'All', ID: 'All' }, ...mainData.am_trainers]
})

const computed_trainers = computed(() => {
  let data = mainData.am_trainers
  if(filterData.value.team != 'All Team'){
    data = mainData.am_trainers.filter(t => t.team == filterData.value.team)
  }
  if(filterData.value.trainer != 'All'){
    data = mainData.am_trainers.filter(t => t.ID == filterData.value.trainer)
  }
  return data
})

const computed_height = computed(() => {
    if(mx.isTablet) return 50
    if(mx.isDesktop) return 54
    if(mx.iswide) return 45
    return 45
})

const selectedTrainerData = computed(() => {
  if (mainData.activeTrainer === null || !mainData.activeTrainerPeriod) return null
  
  const trainers = mainData.activeTrainerPeriod === 'am' ? mainData.am_trainers : mainData.pm_trainers
  return trainers[mainData.activeTrainer]
})

// Time generation functions
const getAmTimes = () => {
    const times = []
    for (let i = 8; i < 12; i++) {
        const time = new Date(0, 0, 0, i, 0).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
        const time_to = new Date(0, 0, 0, i + 1, 0).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
        times.push(`${time} - ${time_to}`)        
    }
    return times
}

const getPmTimes = () => {
    const times = []
    for (let i = 13; i < 17; i++) {
        const time = new Date(0, 0, 0, i, 0).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
        const time_to = new Date(0, 0, 0, i + 1, 0).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
        times.push(`${time} - ${time_to}`)
    }
    return times
}

// Utility functions
const formatDate = (date: Date): string => {
    return date.toLocaleDateString('en-US', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    })
}

const parseTimeString = (timeSlot: string): { start: number, end: number } => {
    const [startTime, endTime] = timeSlot.split(' - ')
    const start = new Date(`1970-01-01 ${startTime}`).getHours()
    const end = new Date(`1970-01-01 ${endTime}`).getHours()
    return { start, end }
}

const isTimeInSchedule = (timeSlot: string, scheduleEntry: ScheduleEntry): boolean => {
    const { start: slotStart, end: slotEnd } = parseTimeString(timeSlot)
    const scheduleStart = new Date(scheduleEntry.start)
    const scheduleEnd = new Date(scheduleEntry.end)
    
    const slotStartHour = slotStart
    const slotEndHour = slotEnd
    const scheduleStartHour = scheduleStart.getHours()
    const scheduleEndHour = scheduleEnd.getHours()
    
    return (slotStartHour >= scheduleStartHour && slotStartHour < scheduleEndHour) ||
           (slotEndHour > scheduleStartHour && slotEndHour <= scheduleEndHour) ||
           (slotStartHour <= scheduleStartHour && slotEndHour >= scheduleEndHour)
}

const getTrainerScheduleForDate = (trainerId: number, date: Date): ScheduleEntry[] => {


    let dateModel = new Date(date)
    if(dateModel != new Date()){
      dateModel.setDate(dateModel.getDate() + 1)
    }
    const dateString = dateModel.toISOString().split('T')[0]


    return scheduleData.value.filter(entry => {
        const entryDate = entry.start.split('T')[0]
        return entry.trainerID === trainerId && entryDate === dateString
    })
}

const getTimeSlotStatus = (timeSlot: string, period: 'am' | 'pm'): string => {
    if (!selectedTrainerData.value) return 'Available'
    const trainerSchedule = getTrainerScheduleForDate(selectedTrainerData.value.ID, mainData.activeDate)
    for (const entry of trainerSchedule) {
        if (isTimeInSchedule(timeSlot, entry)) {
            return entry.type === 'Busy' ? 'Busy' : 'On-Leave'
        }
    }
    
    return 'Available'
}

const getStatusIcon = (timeSlot: string, period: 'am' | 'pm'): string => {
    const status = getTimeSlotStatus(timeSlot, period)
    switch (status) {
        case 'Available':
            return 'mdi-check-circle'
        case 'Busy':
            return 'mdi-clock-alert'
        case 'On-Leave':
            return 'mdi-cancel'
        default:
            return 'mdi-check-circle'
    }
}

const getStatusIconColor = (timeSlot: string, period: 'am' | 'pm'): string => {
    const status = getTimeSlotStatus(timeSlot, period)
    switch (status) {
        case 'Available':
            return 'success'
        case 'Busy':
            return 'warning'
        case 'On-Leave':
            return 'error'
        default:
            return 'success'
    }
}

const getStatusChipColor = (timeSlot: string, period: 'am' | 'pm'): string => {
    const status = getTimeSlotStatus(timeSlot, period)
    switch (status) {
        case 'Available':
            return 'success'
        case 'Busy':
            return 'warning'
        case 'On-Leave':
            return 'error'
        default:
            return 'grey'
    }
}

const getTimeSlotClass = (timeSlot: string, period: 'am' | 'pm'): string => {
    const status = getTimeSlotStatus(timeSlot, period)
    return `time-slot-${status.toLowerCase().replace('-', '')}`
}

const getTrainerStatus = (trainer: Trainer): string => {
    const trainerSchedule = getTrainerScheduleForDate(trainer.ID, mainData.activeDate)
    const isonleave = trainerSchedule.some(entry => entry.type === 'On-Leave')
    if (isonleave) return 'On-Leave'
    return trainerSchedule.length > 0 ? 'Busy' : 'Available'
}

const buildTeamFilters = (role: any, team: string) => {
  const baseFilters : any = {
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
    return { ...baseFilters  }
  }
  
  if (role === 'manager') {
    delete baseFilters.manager,
    delete baseFilters.team
    return { ...baseFilters }
  }
  
  return baseFilters
}

// Methods
const gotoProfile = () => {
    router.push(`/${session.user.role}/profile`)
}

const getTeams = async () => {
    try{
        const filters = buildTeamFilters(session.user.role, session.user.team)
        const order_by = {
          team: 'asc',
          name: 'asc',
        }
        const response = await proxy!.$api.getData('trainers',{ filters, order_by, limit: 100 })   
        if (response.data.status) {
          const decrypted = decrypt(response.data.data)
          decrypted.map((item: any) => {
            delete item.password
            item.name = `${item.last_name}, ${item.first_name} ${item.middle_name?.substring(0, 1) || ''}`
          })
          mainData.am_trainers = decrypted
        }
    } catch (error) {
        console.error('Error fetching team:', error)
    }
}

const getSched = async () => {
    let data = {
        procName: 'get_availability',
        dataParams: [
            mainData.activeYear,
            mainData.activeMonth,
            String(mainData.am_trainers.map(dt => dt.ID).join(','))
        ]
    }
    const res = await proxy!.$api.callProcedure(data)
    if(res.data.status){
        let decrypted = decrypt(res.data.data)
        decrypted.map((item : any) => {
            item.trainerID = parseInt(item.trainerID)
        })
        scheduleData.value = decrypted
    }
}

const selectTrainer = (period: 'am' | 'pm', index: number, trainer: Trainer): void => {
  mainData.activeTrainer = index
  mainData.activeTrainerPeriod = period
  
  emit('trainer-selected', { period, index, trainer })
}

const getTrainerItemClass = (period: 'am' | 'pm', index: number): string => {
  const isActive = mainData.activeTrainer === index && 
                  mainData.activeTrainerPeriod === period
  return isActive ? 'trainer-item-active' : ''
}

const handleTimeSlotClick = (timeSlot: string, period: 'am' | 'pm') => {
    const status = getTimeSlotStatus(timeSlot, period)
    if (status === 'Available') {
        // Handle booking logic here
    }
}

const onDateChange = (newDate: Date) => {
    mainData.activeDate = newDate
    if(mainData.activeYear != newDate.getFullYear()){
        mainData.activeYear = newDate.getFullYear()
    }
    if(mainData.activeMonth != newDate.getMonth() + 1){
        mainData.activeMonth = newDate.getMonth() + 1
    }
}

onBeforeMount(async () => {
    await getTeams()
    await getSched()
    let dateNow = new Date();
    dateNow.setHours(0, 0, 0, 0);
    mainData.activeDate = dateNow
    // onDateChange(dateNow)
})

watch(() => mainData.activeMonth, async () => {
    await getSched()
}, { deep: true })

watch(() => mainData.activeDate, () => {
    // Force reactivity update when date changes
}, { deep: true })

</script>

<style scoped>
.availability-container {
  padding: 10px;
  min-height: 100vh;
  /* background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); */
}


.glass-effect {
  background: rgba(255, 255, 255, 0.95) !important;
  backdrop-filter: blur(20px);
  /* border: 1px solid rgba(255, 255, 255, 0.3); */
  border-radius: 16px !important;
}

.card-header {
  background: linear-gradient(135deg, #667eea, #2551ef);
  color: white !important;
  border-radius: 16px 16px 0 0 !important;
  padding: 10px 24px;
  font-weight: 600;
}

.content-grid {
  gap: 24px;
}

.date-section,
.trainers-section {
  padding: 0 12px;
}

.modern-date-picker {
  width: 100%;
  border-radius: 12px;
}

.selected-date-display {
  background: rgba(103, 126, 234, 0.1);
  border-radius: 12px;
  padding: 16px;
  text-align: center;
}

.trainer-list {
  padding: 8px;
}

.trainer-item {
  margin: 8px 0;
  border-radius: 12px;
  transition: all 0.3s ease;
  border: 2px solid transparent;
  background: rgba(255, 255, 255, 0.5);
}

.trainer-item:hover {
  background: rgba(103, 126, 234, 0.1);
  transform: translateY(-2px);
  box-shadow: 0 8px 32px rgba(103, 126, 234, 0.3);
}

.trainer-item-active {
  background: linear-gradient(135deg, rgba(103, 126, 234, 0.2), rgba(118, 75, 162, 0.2));
  border-color: #667eea;
  transform: translateY(-2px);
  box-shadow: 0 8px 32px rgba(103, 126, 234, 0.4);
}

.trainer-avatar {
  margin-right: 16px;
}

.trainer-name {
  font-weight: 600;
  font-size: 1.1rem;
}

.trainer-details {
  opacity: 0.7;
  font-size: 0.9rem;
}

.trainer-status {
  display: flex;
  align-items: center;
}

.schedule-card {
  animation: slideInUp 0.5s ease-out;
}

.schedule-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.time-section {
  height: 100%;
}

.time-section-title {
  /* color: #667eea; */
  margin-bottom: 16px;
  font-weight: 600;
  display: flex;
  align-items: center;
}

.time-slots {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.time-slot-card {
  border-radius: 12px !important;
  transition: all 0.3s ease;
  cursor: pointer;
  border: 2px solid transparent;
}

.time-slot-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
}

.time-slot-available {
  background: linear-gradient(135deg, #e8f5e8, #f0fff0);
  border-color: #4caf50;
}

.time-slot-busy {
  background: linear-gradient(135deg, #fff3e0, #fff8e1);
  border-color: #ff9800;
}

.time-slot-onleave {
  background: linear-gradient(135deg, #ffebee, #fce4ec);
  border-color: #f44336;
}

.time-slot-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
}

.time-text {
  font-weight: 600;
  font-size: 1rem;
}

.status-info {
  display: flex;
  align-items: center;
}

.status-chip {
  font-weight: 500;
  min-width: 80px;
  text-align: center;
}

.empty-state-card {
  min-height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.empty-state-content {
  max-width: 400px;
}

.empty-state-title {
  color: #667eea;
  margin-bottom: 8px;
}

.empty-state-subtitle {
  color: rgba(0, 0, 0, 0.6);
  line-height: 1.5;
}

.fab-main {
  position: fixed !important;
  bottom: 24px;
  right: 24px;
  z-index: 1000;
}

@keyframes slideInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Responsive Design */
@media (max-width: 960px) {
  .availability-container {
    padding: 16px;
  }
  .content-grid {
    gap: 16px;
  }
  
  .date-section,
  .trainers-section {
    padding: 0 8px;
  }
}

@media (max-width: 600px) {
  .main-title {
    font-size: 1.5rem;
  }
  
  .subtitle {
    font-size: 1rem;
  }
  
  .trainer-item {
    margin: 6px 0;
  }
  
  .time-slot-content {
    padding: 12px;
  }
  
  .time-text {
    font-size: 0.9rem;
  }
  
  .fab-main {
    bottom: 16px;
    right: 16px;
  }
}

/* Dark theme support */
.v-theme--dark .glass-effect {
  background: rgba(30, 30, 30, 0.95) !important;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.v-theme--dark .trainer-item {
  background: rgba(255, 255, 255, 0.05);
}

.v-theme--dark .trainer-item:hover {
  background: rgba(103, 126, 234, 0.2);
}

.v-theme--dark .selected-date-display {
  background: rgba(103, 126, 234, 0.2);
  color: white;
}

.v-theme--dark .empty-state-title {
  color: #8fa2ff;
}

.v-theme--dark .empty-state-subtitle {
  color: rgba(255, 255, 255, 0.7);
}

/* Loading and transition animations */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-fade-enter-active {
  transition: all 0.3s ease-out;
}

.slide-fade-leave-active {
  transition: all 0.8s cubic-bezier(1.0, 0.5, 0.8, 1.0);
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateX(20px);
  opacity: 0;
}

/* Custom scrollbar */
/* .trainer-list::-webkit-scrollbar {
  width: 6px;
}

.trainer-list::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.1);
  border-radius: 3px;
}

.trainer-list::-webkit-scrollbar-thumb {
  background: rgba(103, 126, 234, 0.5);
  border-radius: 3px;
}

.trainer-list::-webkit-scrollbar-thumb:hover {
  background: rgba(103, 126, 234, 0.7);
} */

/* Pulse animation for active states */
.trainer-item-active {
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% {
    box-shadow: 0 0 0 0 rgba(103, 126, 234, 0.7);
  }
  70% {
    box-shadow: 0 0 0 10px rgba(103, 126, 234, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(103, 126, 234, 0);
  }
}

/* Enhanced focus states for accessibility */
.trainer-item:focus-visible,
.time-slot-card:focus-visible {
  outline: 3px solid #667eea;
  outline-offset: 2px;
}

/* Micro-interactions */
.v-chip {
  transition: all 0.2s ease;
}

.v-chip:hover {
  transform: scale(1.05);
}

.v-icon {
  transition: transform 0.2s ease;
}

.trainer-item:hover .v-icon {
  transform: scale(1.1);
}

/* Status indicator animations */
.status-chip {
  animation: fadeInScale 0.3s ease-out;
}

@keyframes fadeInScale {
  from {
    opacity: 0;
    transform: scale(0.8);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

/* Improved mobile responsiveness */
@media (max-width: 480px) {
  .availability-container {
    padding: 12px;
  }
  
  .card-header {
    padding: 16px 20px;
  }
  
  .time-slot-content {
    flex-direction: column;
    gap: 8px;
    align-items: flex-start;
  }
  
  .status-info {
    align-self: flex-end;
  }
  
  .trainer-name {
    font-size: 1rem;
  }
  
  .trainer-details {
    font-size: 0.8rem;
  }
}

/* Print styles */
@media print {
  .availability-container {
    background: white !important;
    color: black !important;
  }
  
  .glass-effect {
    background: white !important;
    border: 1px solid #ccc !important;
  }
  
  .card-header {
    background: #f5f5f5 !important;
    color: black !important;
  }
  
  .fab-main {
    display: none !important;
  }
}

/* High contrast mode support */
@media (prefers-contrast: high) {
  .glass-effect {
    background: white !important;
    border: 2px solid black !important;
  }
  
  .trainer-item {
    border: 2px solid black !important;
  }
  
  .time-slot-card {
    border: 2px solid black !important;
  }
}

/* Reduced motion support */
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
  
  .trainer-item:hover,
  .time-slot-card:hover {
    transform: none !important;
  }
}

</style>