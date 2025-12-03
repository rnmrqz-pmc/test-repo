<!-- TrainingDetailsDialog.vue -->
<template>
  <v-dialog
    v-model="isOpen"
    max-width="900"
    persistent
    scrollable
    transition="dialog-bottom-transition"
    class="training-details-dialog"
  >
    <v-card class="training-details-card globalRadius">
      <!-- Header -->
      <v-card-title class="dialog-header pa-0">
        <v-toolbar
          density="comfortable"
          class="px-4 toolbar-bg"
        >
          <div class="d-flex align-center">
              <h2 class="p-title text-white mb-0">Training Details</h2>
          </div>
          
          <v-spacer />
          
          <!-- Status Badge -->
          <v-chip
            v-if="training?.training_status"
            :color="getStatusColor(training.training_status)"
            variant="elevated"
            class="mr-2"
          >
            <v-icon :icon="getStatusIcon(training.training_status)" size="small" class="mr-1" />
            {{ training.training_status }}
          </v-chip>
          
          <!-- Close Button -->
           <v-btn class="close-btn" @click="closeDialog" icon size="small">
            <v-icon class="" color="white" size="x-large"
               >mdi-close</v-icon>
           </v-btn>
     

        </v-toolbar>
      </v-card-title>

      <!-- Loading State -->
      <div v-if="loading" class="pa-6">
        <v-skeleton-loader type="article, actions" />
      </div>

      <!-- Content -->
      <v-card-text v-else class="pa-0">
        <v-container fluid class="py-0">
          <!-- Basic Information -->
            <section class="pb-4 pt-3">
                <v-row class="px-3">
                    <v-col cols="12" md="8">
                        <div class="info-field mb-4">
                        <label class="p-caption">TITLE</label>
                        <p class="p-text">{{ training?.title || 'N/A' }}</p>
                        </div>
                        
                        <div class="info-field mb-4">
                        <label class="p-caption">OBJECTTIVE</label>
                        <p class="p-text">{{ training?.objectives || 'No objective available' }}</p>
                        </div>
                        
                        <div class="info-field mb-4">
                        <label class="p-caption d-block mb-1">TYPE</label>
                        <v-chip class=""
                            :color="getTypeColor(training?.training_type)"
                            variant="tonal"
                            size="small"
                        >
                            {{ training?.training_type || 'Online' }}
                        </v-chip>
                        </div>
                    </v-col>
                    
                    <v-col cols="12" md="4">
                        <v-card class="pa-4 tonal-card">
                          <p class="p-bold uppercase">Quick Stats </p>
                        
                        <div class="my-1 d-flex">
                            <v-icon class="mr-2 align-self-center" 
                            icon="mdi-account-group" size="22" />
                            <span class="p-text">{{ training?.participants || 0 }} Participants</span>
                        </div>
                        <div class="my-1 d-flex">
                            <v-icon icon="mdi-calendar" size="small" class="mr-2 align-self-center" />
                            <span class="p-text">{{ formatDate(training?.training_date) }}</span>
                        </div>
                        <div class="my-1 d-flex">
                            <v-icon icon="mdi-clock" size="22" class="mr-2 align-self-center" />
                            <span class="p-text">{{ calculateDuration(training?.start_time, training?.end_time) }}</span>
                        </div>
                        
                        <div class="my-1 d-flex">
                            <v-icon :icon="training?.location_type == 'Virtual' ? 'mdi-web' : 'mdi-map-marker'" class="mr-2 align-self-center" />
                            <a v-if="training?.location_type == 'Virtual'" class="p-text text-limit" :href="training?.location_details" 
                            target="_blank" rel="noopener noreferrer">{{ training?.location_details || 'N/A' }}</a>
                            <span v-else class="p-text">{{ (training?.location_details) }}</span>
                        </div>
                        <div v-if="training?.rating" class="my-1 d-flex">
                            <v-icon icon="mdi-star" size="small" class="mr-2" />
                            <span class="p-subtitle">{{ training.rating }}/5.0 Rating</span>
                        </div>
                        </v-card>
                    </v-col>
                </v-row>
            </section>


          <!-- Schedule Information -->
          <section class="pb-4">
            <div class="section-header">
                <!-- <v-icon icon="mdi-calendar-clock" class="mr-2" /> -->
                <h3 class="p-section">Schedule</h3>
            </div>
            
            <v-row class="px-3">
                <v-col cols="12" md="4">
                    <div class="simple-card card-hover-y text-center pa-3">
                    <v-icon icon="mdi-calendar" color="primary" class="mb-2" />
                    <label class="p-caption d-block">DATE</label>
                    <p class="p-text">{{ formatFullDate(training?.training_date) }}</p>
                    </div>
                </v-col>
                
                <v-col cols="12" md="4">
                    <div class="simple-card card-hover-y text-center pa-3" style="height: 100%">
                    <v-icon icon="mdi-clock-start" color="success" class="mb-2" />
                    <label class="p-caption d-block">START TIME</label>
                    <p class="p-text">{{ formatTime(training?.start_time) }}</p>
                    </div>
                </v-col>
                
                <v-col cols="12" md="4">
                    <div class="simple-card card-hover-y text-center pa-3" style="height: 100%">
                    <v-icon icon="mdi-clock-end" color="error" class="mb-2" />
                    <label class="p-caption d-block">END TIME</label>
                    <p class="p-text">{{ formatTime(training?.end_time) }}</p>
                    </div>
                </v-col>
            </v-row>
        
          </section>


          <!-- Trainers & Participants -->
          <section class="mb-4">
            <div class="section-header">
              <!-- <v-icon icon="mdi-account-group" class="mr-2" /> -->
              <h3 class="p-section">Trainers ({{ training.trainers.split(',').length }})</h3>
            </div>
            <v-row class="mx-1 mb-1">
              <!-- Trainers -->
              <v-col v-for="(trainer,trID) in training.trainers.split(',')" :key="trID" cols="6" md="6" lg="6"
              class="pa-0 ma-0 my-2">
                    <v-card                      
                      variant="outlined"
                      class=" mx-2 pa-3 card-item card-hover-x"
                    >
                      <div class="d-flex align-center">
                        <div class="flex-grow-1">
                          <p class="p-text">{{ trainerData(trainer).name }}</p>
                          <p class="p-caption">
                            {{ trainerData(trainer).position || 'Trainer' }}
                          </p>
                        </div>
                      </div>
                    </v-card>
              </v-col>
            </v-row>
          </section>


          <!-- Materials & Resources -->
          <section class="pb-4">
            <div class="section-header">
              <v-icon icon="mdi-file-document-multiple" class="mr-2" />
              <h3>Materials & Links</h3>
            </div>
            
            <div class="px-3">
              <div class="materials-grid">
                <v-card 
                  v-for="material in JSON.parse(training.attachments)"
                  :key="material.id"
                  variant="outlined"
                  class="card-item card-hover-x pa-2"
                >
                  <div class="d-flex align-center">
                    <div class="flex-grow-1">
                      <p class="font-weight-medium mb-1">{{ material.name }}</p>
                    </div>
                    <a :href="mx.getFile(material)" target="_blank" rel="noopener noreferrer">
                        <v-btn
                        icon="mdi-open-in-new"
                        size="small"
                        variant="text"
                        />
                    </a>
                  </div>
                </v-card>
                <v-card v-for="(link,id) in JSON.parse(training.links)" :key="id" variant="outlined" class="card-item card-hover-x pa-3">
                  <div class="d-flex align-center">
                    <div class="flex-grow-1">
                      <p class="font-weight-medium mb-1">{{ link }}</p>
                    </div>
                    <a :href="link" target="_blank" rel="noopener noreferrer">
                        <v-btn
                        icon="mdi-open-in-new"
                        size="small"
                        variant="text"
                        />
                    </a>
                  </div>
                </v-card>
              </div>
              <v-alert v-if="JSON.parse(training.attachments).length == 0 && JSON.parse(training.links).length == 0" type="info" variant="tonal">
                No materials or links uploaded for this training
              </v-alert>
            </div>
          </section>


        </v-container>
      </v-card-text>

      <!-- Actions -->
      <v-card-actions class="px-6 py-4">
        <div class="d-flex justify-center w-100">
          <div class="d-flex ga-2">
            <v-btn class="px-5"
              variant="outlined"
              rounded="pill"
              @click="closeDialog"
            >
              Close
            </v-btn>
          </div>
        </div>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts" setup>
import { ref, computed, watch, getCurrentInstance, onMounted } from 'vue'
import { useMXStore } from '@/stores/mx'

const mx = useMXStore()
// Types
interface Training {
  id?: string
  title?: string
  objectives?: string
  training_date?: string
  start_time?: string
  end_time?: string
  training_status?: string
  training_type?: string
  participants_count?: number
  notes?: string
  rating?: number
  location_details?: string
  location_type?: string
  trainers?: string
}

interface Trainer {
  id: string
  name: string
  email?: string
  role?: string
}

interface Participant {
  id: string
  name: string
  email?: string
  department?: string
  attendance_status?: string
}

interface Material {
  id: string
  name: string
  type: string
  size?: string
  url?: string
}

interface Comment {
  id: string
  author: string
  content: string
  created_at: string
}

interface Props {
  modelValue: boolean
  trainingId?: string
  training?: any
  canEdit?: boolean
  team?: any
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: false,
  trainingId: '',
  training: undefined,
  canEdit: false,
  team: []
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  'edit': [training: Training]
  'start': [training: Training]
  'join': [training: Training]
}>()

// Composables
const { proxy } = getCurrentInstance()!

// Reactive State
const loading = ref(false)
const trainers = ref<any>([])
const participants = ref<Participant[]>([])
const materials = ref<Material[]>([])
const comments = ref<Comment[]>([])

// Computed Properties
const isOpen = computed({
  get: () => props.modelValue,
  set: (value: boolean) => emit('update:modelValue', value)
})

const sessionProgress = computed(() => {
  if (!props.training || props.training.training_status !== 'On-Going') return 0
  
  try {
    const now = new Date()
    const today = now.toISOString().split('T')[0]
    const sessionDate = props.training.training_date
    
    if (sessionDate !== today) return 0
    
    const startTime = new Date(`${sessionDate}T${props.training.start_time}`)
    const endTime = new Date(`${sessionDate}T${props.training.end_time}`)
    
    if (isNaN(startTime.getTime()) || isNaN(endTime.getTime())) return 0
    if (now < startTime) return 0
    if (now > endTime) return 100
    
    const totalDuration = endTime.getTime() - startTime.getTime()
    const elapsed = now.getTime() - startTime.getTime()
    
    return totalDuration > 0 ? Math.round((elapsed / totalDuration) * 100) : 0
  } catch {
    return 0
  }
})

// Utility Functions
const formatDate = (date?: string) => {
  if (!date) return 'N/A'
  return new Date(date).toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric'
  })
}

const formatFullDate = (date?: string) => {
  if (!date) return 'N/A'
  return new Date(date).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const formatTime = (time?: string) => {
  if (!time) return 'N/A'
  try {
    const [hours, minutes] = time.split(':')
    const date = new Date()
    date.setHours(parseInt(hours), parseInt(minutes))
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    })
  } catch {
    return time
  }
}

const formatDateTime = (datetime?: string) => {
  if (!datetime) return 'N/A'
  return new Date(datetime).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit'
  })
}

const calculateDuration = (startTime?: string, endTime?: string) => {
  if (!startTime || !endTime) return 'N/A'
  
  try {
    const start = new Date(`1970-01-01T${startTime}`)
    const end = new Date(`1970-01-01T${endTime}`)
    const diffMs = end.getTime() - start.getTime()
    const hours = Math.floor(diffMs / (1000 * 60 * 60))
    const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60))
    
    if (hours > 0) {
      return minutes > 0 ? `${hours}h ${minutes}m` : `${hours}h`
    }
    return `${minutes}m`
  } catch {
    return 'N/A'
  }
}

const getInitials = (name?: string) => {
  if (!name) return '?'
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
}

const getStatusColor = (status?: string) => {
  switch (status) {
    case 'Planned': return 'info'
    case 'On-Going': return 'warning'
    case 'Completed': return 'primary'
    case 'Cancelled': return 'error'
    default: return 'grey'
  }
}

const getStatusIcon = (status?: string) => {
  switch (status) {
    case 'Planned': return 'mdi-calendar-clock'
    case 'On-Going': return 'mdi-play-circle'
    case 'Completed': return 'mdi-check-circle'
    case 'Cancelled': return 'mdi-cancel'
    default: return 'mdi-help-circle'
  }
}

const getTypeColor = (type?: string) => {
  switch (type?.toLowerCase()) {
    case 'free': return 'green'
    case 'paid': return 'orange'
    default: return 'blue'
  }
}


// API Methods
const loadTrainingDetails = async () => {
  if (!props.trainingId && !props.training?.ID) return
  loading.value = true
  try {
    // Load additional details like, participants etc
    await Promise.allSettled([
      await loadTrainers(),
      // await loadParticipants(),
    ])
  } catch (error) {
    console.error('Failed to load training details:', error)
  } finally {
    loading.value = false
  }
}

const loadTrainers = async () => {
  const trainersData = [
    { id: '1', name: 'John Doe', email: 'john.doe@company.com', role: 'Senior Trainer' },
    { id: '2', name: 'Jane Smith', email: 'jane.smith@company.com', role: 'Assistant Trainer' }
  ]
  trainers.value = trainersData
}

const loadParticipants = async () => {
  // Mock data - replace with actual API call
  participants.value = Array.from({ length: 25 }, (_, i) => ({
    id: `participant-${i + 1}`,
    name: `Participant ${i + 1}`,
    email: `participant${i + 1}@company.com`,
    department: ['IT', 'HR', 'Sales', 'Marketing', 'Finance'][i % 5],
    attendance_status: ['Present', 'Absent', 'Late'][Math.floor(Math.random() * 3)]
  }))
}

// Event Handlers
const closeDialog = () => {
  isOpen.value = false
}

const trainerData = (ID: string) => {
  return props.team.find((trainer:any) => trainer.ID == ID)
}

// Watchers
watch(isOpen, (newValue) => {
  if (newValue) {
    // loadTrainingDetails()
  }
})
// onMounted(loadTrainingDetails)

</script>

<style scoped>
.toolbar-bg{
  background: linear-gradient(135deg, #627efa 0%, #352ff5 100%);
}
.training-details-dialog .v-dialog {
  align-items: flex-start;
  justify-content: center;
  margin-top: 5vh;
}

.training-details-card {
  max-height: 90vh;
  overflow: hidden;
}


.section-header {
  display: flex;
  align-items: center;
  padding: 0 1rem;
  margin-bottom: 1rem;
  border-bottom: 2px solid rgba(0, 0, 0, 0.08);
  padding-bottom: 0.5rem;
}

.section-header h3 {
  font-size: 1.25rem;
  font-weight: 600;
  color: rgba(0, 0, 0, 0.87);
  margin: 0;
}

.info-field {
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
  padding-bottom: 0.75rem;
}

.materials-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1rem;
}


/* Responsive Design */
@media (max-width: 960px) {
  .training-details-dialog .v-dialog {
    margin: 1rem;
    max-width: calc(100vw - 2rem);
  }
  
  .materials-grid {
    grid-template-columns: 1fr;
  }

}

@media (max-width: 600px) {
  .training-details-card {
    max-height: 95vh;
  }
  
  .dialog-header .text-h5 {
    font-size: 1.25rem !important;
  }
  
  .section-header h3 {
    font-size: 1.1rem;
  }
  
  .v-card-actions {
    flex-direction: column;
    gap: 1rem;
  }
  
  .v-card-actions > div {
    width: 100%;
    justify-content: center !important;
  }
}

/* Custom Scrollbar */
.v-card-text::-webkit-scrollbar {
  width: 4px;
}

.v-card-text::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.05);
}

.v-card-text::-webkit-scrollbar-thumb {
  background: var(--color-primary);
  border-radius: 3px;
}

.v-card-text::-webkit-scrollbar-thumb:hover {
  background: rgba(0, 0, 0, 0.3);
}

/* Animation */
.training-details-card {
  animation: slideInUp 0.3s ease-out;
}

@keyframes slideInUp {
  from {
    opacity: 0;
    transform: translateY(50px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (prefers-reduced-motion: reduce) {
  .training-details-card {
    animation: none !important;
    transition: none !important;
  }
}

/* Focus styles for accessibility */
.v-btn:focus-visible {
  outline: 2px solid #2196F3;
  outline-offset: 2px;
}
</style>