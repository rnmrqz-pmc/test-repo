<template>
  <div :style="!session.details ? 'height: 100%; overflow-y: hidden;' : ''">
    <!-- Loading State -->
    <v-skeleton-loader
      v-if="loading && session.details"
      type="card-avatar, card-avatar, card-avatar, list-item@3"
      class="mb-4"
    />
    
    <!-- No Profile State -->
    <NoProfile v-else-if="!session.details" @goto="gotoProfile" />

    <!-- Main Dashboard Content -->
    <div v-else class="px-3 pt-1">
      <!-- Key Metrics Section -->
      <section class="metrics-section" aria-labelledby="metrics-title">
        <h2 id="metrics-title" class="px-2 p-title py-2">
          <v-icon icon="mdi-chart-line" class="mr-2" />
          Key Metrics
        </h2>
        
        <v-row class="pa-0 ma-0"> 
          <v-col
            v-for="(metric, index) in metricsConfig"
            :key="metric.key"
            class="pa-0 ma-0 my-1"
            cols="12" lg="3" md="6" sm="6" xs="12" 
          >
            <MetricCard style="height: 100%;"
              :title="metric.title"
              :value="mainData.metrics[metric.key]"
              :unit="metric.unit"
              :subtitle="metric.subtitle"
              :color-class="metric.colorClass"
              :icon="metric.icon"
              :show-rating="metric.showRating"
              :loading="loading"
            />
          </v-col>
        </v-row>
      </section>

      <!-- Upcoming Assignments Section -->
      <section class="assignments-section mt-6" aria-labelledby="assignments-title">
        <div class="d-flex justify-space-between align-center mb-1">
          <h2 id="assignments-title" class="px-2 section-title">
            <v-icon icon="mdi-calendar-clock" class="mr-2" />
            Upcoming Assignments
          </h2>
          
          <!-- Filter and Sort Controls -->
          <div class="d-flex ga-2 pb-1 px-3">
            <v-select
              v-model="assignmentFilter"
              :items="filterOptions"
              item-title="text"
              item-value="value"
              variant="outlined"
              density="compact"
              hide-details
              style="min-width: 150px;"
              class="white-input"
            >
              <template #prepend-inner>
                <v-icon icon="mdi-filter" size="small" />
              </template>
            </v-select>
            
            <v-btn
              icon="mdi-refresh"
              variant="elevated"
              size="small"
              color="white"
              :loading="refreshing"
              @click="refreshAssignments"
              aria-label="Refresh assignments"
            />
          </div>
        </div>

        <!-- Assignments List -->
        <div class="assignments-container py-2">
            <AssignmentCard
              v-for="(item, id) in filteredAssignments"
              :key="`${item.id}-${id}`"
              :assignment="item"
              class="mb-3"
              @view-details="openTrainingDetails(item)"
            />
          
          <!-- Empty State -->
          <EmptyState
            v-if="filteredAssignments.length === 0 && !loading"
            icon="mdi-calendar-blank"
            title="No Upcoming Assignments"
            :subtitle="getEmptyStateSubtitle()"
            :show-action="assignmentFilter === 'all'"
          />
        </div>
      </section>
    </div>
    
      <TrainingDetailsDialog
      v-model="showTrainingDialog"
      :training="selectedTraining"
      :team="mainData.team"
      @edit="onEditTraining"
      @start="onStartTraining"
    />
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, onBeforeMount, onUnmounted, getCurrentInstance, watch } from 'vue'
import { useSessionStore } from '@/stores/session'
import { useRouter } from 'vue-router'
import { decrypt } from '@/utils/encryptDecrypt'
import NoProfile from '@/components/common/NoProfile.vue'
import MetricCard from '@/components/trainer/MetricCard.vue'
import AssignmentCard from '@/components/trainer/AssignmentCard.vue'
import EmptyState from '@/components/common/EmptyState.vue'
import TrainingDetailsDialog from '@/components/training/TrainingDetailsDialog.vue'

// Types
interface Metrics {
  training_hours: number
  sessions: number
  rating: number
  participants: number
}

interface Assignment {
  id: string
  training_date: string
  title: string
  start_time: string
  end_time: string
  training_status: string
  priority?: 'high' | 'medium' | 'low'
  trainers?: string
  participants?: number
  attachments?: any
  links?: any
}

interface MainData {
  metrics: Metrics
  upcoming: Assignment[]
}

// Composables
const session = useSessionStore()
const router = useRouter()
const { proxy } = getCurrentInstance()!


// Reactive State
const loading = ref(true)
const refreshing = ref(false)
const assignmentFilter = ref('all')
const refreshInterval = ref<number | null>(null)

const mainData = ref<any>({
  metrics: {
    training_hours: 0,
    sessions: 0,
    rating: 0,
    participants: 0
  },
  upcoming: []
})

const showTrainingDialog = ref(false)
const selectedTraining = ref<any>(null)
const showEditDialog = ref(false)
const showStartConfirmDialog = ref(false)

const openTrainingDetails = (assignment: any) => {
  selectedTraining.value = {
    ...assignment
  }
  showTrainingDialog.value = true
}


const onEditTraining = (training: any) => {
  showTrainingDialog.value = false
  selectedTraining.value = training
  showEditDialog.value = true
}

const onStartTraining = (training: any) => {
  showTrainingDialog.value = false
  selectedTraining.value = training
  showStartConfirmDialog.value = true
}


// Configuration
const metricsConfig = [
  {
    key: 'training_hours',
    title: 'My Training Hours',
    unit: 'hrs',
    subtitle: 'This Month',
    colorClass: 'color1',
    icon: 'mdi-clock-outline'
  },
  {
    key: 'sessions',
    title: 'Sessions Completed',
    unit: 'Sessions',
    subtitle: 'This Quarter',
    colorClass: 'color2',
    icon: 'mdi-presentation-play'
  },
  {
    key: 'rating',
    title: 'Average Rating',
    unit: '/ 5.0',
    subtitle: '',
    colorClass: 'color3',
    icon: 'mdi-star',
    showRating: true
  },
  {
    key: 'participants',
    title: 'Participants Trained',
    unit: '',
    subtitle: 'Year-to-Date',
    colorClass: 'color4',
    icon: 'mdi-account-group'
  }
]

const filterOptions = [
  { text: 'All Assignments', value: 'all' },
  { text: 'This Week', value: 'week' },
  { text: 'Next 7 Days', value: 'next7' },
  { text: 'Planned', value: 'planned' },
  { text: 'On-Going', value: 'ongoing' }
]

// Computed Properties
const filteredAssignments = computed(() => {
  const now = new Date()
  const assignments = mainData.value.upcoming

  switch (assignmentFilter.value) {
    case 'week':
      const endOfWeek = new Date(now)
      endOfWeek.setDate(now.getDate() + (7 - now.getDay()))
      return assignments.filter((item:any) => {
        const assignmentDate = new Date(item.training_date)
        return assignmentDate <= endOfWeek
      })
    
    case 'next7':
      const next7Days = new Date(now)
      next7Days.setDate(now.getDate() + 7)
      return assignments.filter((item:any) => {
        const assignmentDate = new Date(item.training_date)
        return assignmentDate <= next7Days
      })
    
    case 'priority':
      return assignments.filter((item:any) => item.priority === 'high')
    
    case 'planned':
      return assignments.filter((item:any) => item.training_status === 'Planned')
    
    case 'ongoing':
      return assignments.filter((item:any) => item.training_status === 'On-Going')
    
    default:
      return assignments
  }
})


// API Methods with better error handling
const init = async () => {
  try {
    loading.value = true
    const data = {
      filters: {
        ID: session.user.ID,
        TR_YEAR: new Date().getFullYear(),
      },
    }

    const response: any = await new Promise((resolve, reject) => {
      proxy!.$api.getData('trainer_monthly_view', data)
        .then(resolve)
        .catch(reject)
    })

    if (response.data.status) {
      const decrypted = decrypt(response.data.data)
      const currentMonth = decrypted.find((item: any) => 
        item.TR_MONTH === new Date().getMonth() + 1
      )

      if (currentMonth) {
        // Calculate quarter data more efficiently
        const quarterData :any = calculateQuarterData(decrypted)
        const totalParticipants = decrypted.reduce(
          (sum: number, item: any) => sum + parseInt(item.TRAINED_PARTICIPANTS || 0), 
          0
        )
        const currentQuarter = Math.ceil((new Date().getMonth() + 1) / 3)

        mainData.value.metrics = {
          training_hours: currentMonth.DELIVERED_HOURS || 0,
          sessions: quarterData[`q${currentQuarter}`] || 0,
          rating: parseFloat(currentMonth.AVG_SCORE || 0),
          participants: totalParticipants
        }
      }
    }
  } catch (error) {
    console.error('Error in init:', error)
  } finally {
    loading.value = false
  }
}
const getTeamMembers = async () => {
  try {
    const res = await proxy!.$api.getData('trainers', { filters: { status: 1, admin: 0 } })
    if (res.data.status) {
      let decrypted = decrypt(res.data.data)
      decrypted.map((item: any) => {
        delete item.password
        item.name = `${item.last_name}, ${item.first_name} ${item.middle_name?.substring(0, 1) || ''}`
      })
      mainData.value.team = decrypted
    }
  } catch (error) {
    console.error('Failed to load team data:', error)
    throw error
  }
}


const calculateQuarterData = (data: any[]) => {
  return {
    q1: data.filter(item => item.TR_MONTH <= 3)
            .reduce((sum, item) => sum + parseInt(item.SESSION_CONDUCTED || 0), 0),
    q2: data.filter(item => item.TR_MONTH > 3 && item.TR_MONTH <= 6)
            .reduce((sum, item) => sum + parseInt(item.SESSION_CONDUCTED || 0), 0),
    q3: data.filter(item => item.TR_MONTH > 6 && item.TR_MONTH <= 9)
            .reduce((sum, item) => sum + parseInt(item.SESSION_CONDUCTED || 0), 0),
    q4: data.filter(item => item.TR_MONTH > 9)
            .reduce((sum, item) => sum + parseInt(item.SESSION_CONDUCTED || 0), 0),
  }
}

const getUpcoming = async () => {
  try {
    const data = {
      find_in_set_any: {
        trainers: session.user.ID,
        training_status: 'Planned,On-Going'
      },
      filters: {
        'training_date >': new Date().toLocaleDateString('en-CA'),
      },
    }

    const response: any = await new Promise((resolve, reject) => {
      proxy!.$api.getData('training_view', data)
        .then(resolve)
        .catch(reject)
    })
    if (response.data.status) {
      const decrypted = decrypt(response.data.data)
      mainData.value.upcoming = decrypted
        .sort((a, b) => new Date(a.training_date).getTime() - new Date(b.training_date).getTime())
      mainData.value.upcoming = decrypted
    }
  } catch (error) {
    console.error('Error in getUpcoming:', error)
  }
}

// Event Handlers
const refreshAssignments = async () => {
  refreshing.value = true
  await getUpcoming()
  refreshing.value = false
}

const getEmptyStateSubtitle = () => {
  switch (assignmentFilter.value) {
    case 'week':
      return 'No assignments scheduled for this week'
    case 'next7':
      return 'No assignments in the next 7 days'
    case 'priority':
      return 'No high priority assignments found'
    case 'planned':
      return 'No planned assignments available'
    case 'ongoing':
      return 'No ongoing assignments at the moment'
    default:
      return 'You have no upcoming assignments scheduled'
  }
}

const gotoProfile = () => {
  router.push('/trainer/profile')
}

// Auto-refresh functionality
const setupAutoRefresh = () => {
  refreshInterval.value = setInterval(() => {
    if (!loading.value) {
      getUpcoming()
    }
  }, 300000) // Refresh every 5 minutes
}

// Lifecycle Hooks
onBeforeMount(async () => {
  await Promise.all([init(), getUpcoming(), getTeamMembers()])
  setupAutoRefresh()
})

onUnmounted(() => {
  if (refreshInterval.value) {
    clearInterval(refreshInterval.value)
  }
})

// Watch for session changes
watch(() => session.user?.ID, (newId) => {
  if (newId) {
    init()
    getUpcoming()
  }
})
</script>

<style scoped>
.metrics-section, .assignments-section {
  margin-bottom: 2rem;
}

.assignments-container {
  height: 64vh;
  overflow-y: auto;
  padding-right: 4px;
}

.assignments-container::-webkit-scrollbar {
  width: 6px;
}

.assignments-container::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.1);
  border-radius: 3px;
}

.assignments-container::-webkit-scrollbar-thumb {
  background: var(--color-primary);
  border-radius: 3px;
}

.assignments-container::-webkit-scrollbar-thumb:hover {
  background: rgba(0, 0, 0, 0.4);
}

.section-title {
  font-size: 26px !important;
  font-weight: 700;
  display: flex;
  align-items: center;
}

.color1 { color: rgb(0, 0, 159); }
.color2 { color: rgb(0, 110, 29); }
.color3 { color: rgb(0, 0, 108); }
.color4 { color: rgb(243, 174, 0); }

/* Responsive Design */
@media (max-width: 600px) {
  .section-title {
    font-size: 22px !important;
  }
  
  .assignments-container {
    height: 50vh;
  }
}

/* Accessibility */
@media (prefers-reduced-motion: reduce) {
  .v-fade-transition-enter-active,
  .v-fade-transition-leave-active {
    transition: none !important;
  }
}

/* Focus styles for keyboard navigation */
.v-btn:focus-visible {
  outline: 2px solid #2196F3;
  outline-offset: 2px;
}
</style>