<!-- AssignmentCard.vue -->
<template>
  <v-card 
    class="assignment-card card-hover-y pa-2 globalRadius mx-2" 
    elevation="3"
  >
    <v-row class="pa-0 ma-0" no-gutters>
      <!-- Main Content -->
      <v-col class="pa-0 ma-0 px-4 py-3" cols="12" lg="8" md="8" sm="12">
        <div class="d-flex align-start mb-2">
          <v-chip
            :color="statusConfig.color"
            size="small"
            variant="outlined">
            {{ assignment.training_status }}
          </v-chip>
        </div>

        <!-- Title and Date -->
        <div class="assignment-header mb-2">
            <span class="d-flex">
                <h3>{{ assignment.title }}</h3>
                <span class="mx-2">|</span>
                <div class="d-flex ">
                    <v-icon :icon=" assignment.location_type === 'Virtual' ? 'mdi-web' : 'mdi-map-marker' " size="small" class="me-1 align-self-center" />
                    <span class="assignment-subtitle align-self-center">{{ assignment.location_type }}</span>
                </div>
            </span>
            <v-row class="pa-0 ma-0">
                <v-col class="pa-0 ma-0" cols="12" lg="4" md="4" sm="12">
                    <p class="assignment-title pt-2">
                        <v-icon icon="mdi-calendar" size="small" class="mr-2" />
                        {{ formattedDate }}
                    </p>
                </v-col>
                <v-col class="pa-0 ma-0 d-flex align-center" cols="12" lg="4" md="4" sm="12">
                    <v-icon icon="mdi-clock-outline" size="small" class="mr-2" />
                    <span class="assignment-subtitle">{{ assignment.start_time }} - {{ assignment.end_time }}</span>
                    <span class="duration-badge ml-2">{{ calculatedDuration }}</span>
                </v-col>
                <v-col class="pa-0 ma-0 d-flex align-center" cols="12" lg="4" md="4" sm="12">
                    <v-icon icon="mdi-account-group" size="small" class="mr-2" />
                    <span class="assignment-subtitle">{{ assignment.participants }} participants</span>
                </v-col>
            </v-row>
        </div>
      </v-col>

      <!-- Action Buttons -->
      <v-col class="pa-0 ma-0 px-4 py-3 d-flex flex-column justify-center" cols="12" lg="4" md="4" sm="12">
        <div class="action-buttons">
          <v-btn
            class="primary-action-btn mb-2 --bg-main text-white"
            rounded="pill"
            block
            @click="onViewDetails"
          >
            <v-icon icon="mdi-eye" size="small" class="mr-2" />
            View Details
          </v-btn>
        </div>
      </v-col>
    </v-row>
  </v-card>
</template>

<script lang="ts" setup>
import { computed } from 'vue'

interface Assignment {
  id: string
  training_date: string
  title: string
  start_time: string
  end_time: string
  training_status: string
  priority?: 'high' | 'medium' | 'low'
  participants?: number
  location_type?: string
  attachments?: any
  links?: any
}

interface QuickAction {
  key: string
  text: string
  icon: string
}

interface Props {
  assignment: Assignment
}

const props = defineProps<Props>()

const emit = defineEmits<{
  viewDetails: [assignment: Assignment]
  quickAction: [assignment: Assignment, action: string]
}>()

// Computed Properties
const formattedDate = computed(() => {
  const date = new Date(props.assignment.training_date)
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
})

const calculatedDuration = computed(() => {
  const start = new Date(`1970-01-01T${props.assignment.start_time}`)
  const end = new Date(`1970-01-01T${props.assignment.end_time}`)
  const diffMs = end.getTime() - start.getTime()
  const hours = Math.floor(diffMs / (1000 * 60 * 60))
  const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60))
  
  if (hours > 0) {
    return minutes > 0 ? `${hours}h ${minutes}m` : `${hours}h`
  }
  return `${minutes}m`
})

const priorityConfig = computed(() => {
  switch (props.assignment.priority) {
    case 'high':
      return { color: 'error', icon: 'mdi-alert', text: 'High Priority' }
    case 'medium':
      return { color: 'warning', icon: 'mdi-alert-outline', text: 'Medium' }
    default:
      return { color: 'success', icon: 'mdi-check', text: 'Normal' }
  }
})

const statusConfig = computed(() => {
  switch (props.assignment.training_status) {
    case 'Planned':
      return { color: 'info' }
    case 'On-Going':
      return { color: 'orange-darken-1' }
    case 'Completed':
      return { color: 'primary' }
    case 'Cancelled':
      return { color: 'error' }
    default:
      return { color: 'grey' }
  }
})

// const cardClasses = computed(() => ({
//   'assignment-card--urgent': props.assignment.priority === 'high',
//   'assignment-card--ongoing': props.assignment.training_status === 'On-Going'
// }))

const quickActions = computed((): QuickAction[] => {
  const actions: QuickAction[] = []
  
  switch (props.assignment.training_status) {
    case 'Planned':
      actions.push(
        { key: 'edit', text: 'Edit Assignment', icon: 'mdi-pencil' },
        { key: 'reschedule', text: 'Reschedule', icon: 'mdi-calendar-edit' },
        { key: 'cancel', text: 'Cancel', icon: 'mdi-cancel' }
      )
      break
    case 'On-Going':
      actions.push(
        { key: 'join', text: 'Join Session', icon: 'mdi-video' },
        { key: 'materials', text: 'View Materials', icon: 'mdi-file-document' }
      )
      break
  }
  
  actions.push(
    { key: 'participants', text: 'View Participants', icon: 'mdi-account-group' },
    { key: 'history', text: 'View History', icon: 'mdi-history' }
  )
  
  return actions
})

// Event Handlers
const onViewDetails = () => {
  emit('viewDetails', props.assignment)
}

const onQuickAction = (action: string) => {
  emit('quickAction', props.assignment, action)
}
</script>

<style scoped>
.assignment-card {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  border-left: 4px solid transparent;
}

/* .assignment-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12) !important;
} */

.assignment-card--urgent {
  border-left-color: #f44336;
  background: linear-gradient(135deg, rgba(244, 67, 54, 0.02) 0%, transparent 100%);
}

.assignment-card--ongoing {
  border-left-color: #c49026;
  background: linear-gradient(135deg, rgba(76, 175, 80, 0.02) 0%, transparent 100%);
}

.assignment-header {
  /* border-bottom: 1px solid rgba(0, 0, 0, 0.08); */
  /* padding-bottom: 12px; */
}

.assignment-title {
  font-size: 18px !important;
  font-weight: 600;
  color: rgba(0, 0, 0, 0.87);
  margin-bottom: 4px;
  display: flex;
  align-items: center;
}

.assignment-subtitle {
  font-size: 16px !important;
  color: rgba(0, 0, 0, 0.7);
  /* margin-bottom: 4px; */
  font-weight: 500;
}

.assignment-details {
  padding-top: 12px;
}

.time-text {
  font-size: 14px !important;
  font-weight: 500;
  color: rgba(0, 0, 0, 0.8);
}

.duration-badge {
  background: rgba(33, 150, 243, 0.1);
  color: #1976d2;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
}

.action-buttons {
  width: 100%;
}

.primary-action-btn {
  font-weight: 600;
  text-transform: none;
}

/* Responsive Design */
@media (max-width: 960px) {
  .action-buttons {
    margin-top: 16px;
  }
}

@media (max-width: 600px) {
  .assignment-title {
    font-size: 16px !important;
  }
  
  .assignment-subtitle {
    font-size: 14px !important;
  }
  
  .action-buttons .v-btn {
    margin-bottom: 8px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .assignment-card {
    transition: none !important;
  }
}

/* Focus styles for accessibility */
.assignment-card:focus-within {
  outline: 2px solid #2196F3;
  outline-offset: 2px;
}
</style>