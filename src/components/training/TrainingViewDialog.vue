<template>
  <v-dialog v-model="localModel" :max-width="dialogWidth" :persistent="true">
    <v-card class="  globalRadius">
      <v-card-title class="gradient-bg text-white d-flex justify-space-between ma-0 pa-2">
        <h3 class="p-title">Training Details</h3>
        <v-btn class="close-btn" size="small" 
        @click="localModel = false" icon>
        <v-icon class="" color="white" size="x-large"
           >mdi-close</v-icon>
      </v-btn>
      </v-card-title>
      <v-card-text style="max-height: 76vh; overflow-y: scroll">
        <v-card class="pa-4 mb-4 simple-card" >
          <v-row class="pa-0 ma-0">
            <!-- Training Title -->
            <v-col class="py-1 px-0 ma-0" cols="12">
              <p class="p-text">NAME: <b>{{ data.title }}</b></p>
            </v-col>
            
            <!-- Training Duration -->
            <v-col class="px-0 py-1 ma-0" cols="12" lg="12" md="12" sm="12">
              <p>DATE: 
                <b>{{ formatDate(data.start_date) }} - {{ formatDate(data.end_date) }}</b>
              </p>
            </v-col>
            
            <!-- Schedule -->
            <v-col class="px-0 py-1 ma-0" cols="12" lg="12" md="12" sm="12">
              <p class="">DURATION: 
                <b>{{ data.start_time }} - {{ data.end_time }}</b>
              </p>
            </v-col>
            
            <!-- Location Type -->
            <v-col class="px-0 py-1 ma-0" cols="12" lg="6" md="12" sm="12">
              <p>TYPE: <b>{{ data.location_type }}</b></p>
            </v-col>
            
            <!-- Location Details -->
            <v-col class="px-0 py-1 ma-0" cols="12" lg="6" md="12" sm="12">
              <p>LOCATION: <b>{{ data.location_details }}</b></p>
            </v-col>

            <!-- Target Audience -->
            <v-col class="px-0 py-1 ma-0" cols="12" lg="6" md="12" sm="12">
              <p>AUDIENCE: <b>{{ data.audience }}</b></p>
            </v-col>
            
            <!-- Number of Participants -->
            <v-col class="px-0 py-1 ma-0" cols="12" lg="6" md="12" sm="12">
              <p>PARTICIPANTS: <b>{{ data.participants }}</b></p>
            </v-col>

            <!-- Training Hours -->
            <v-col class="px-0 py-1 ma-0" cols="12" lg="6" md="12" sm="12">
              <p>TOTAL HOURS: <b>{{ data.training_hours }}</b></p>
            </v-col>
            
            <!-- Training Status -->
            <v-col class="px-0 py-1 ma-0" cols="12" lg="6" md="12" sm="12">
              <p>STATUS: 
                <v-chip 
                  :color="getStatusColor(data.training_status)" 
                  size="small" 
                  variant="flat"
                >
                  {{ data.training_status }}
                </v-chip>
              </p>
            </v-col>
          </v-row>
        </v-card>
        <!-- Learning Objectives -->
        <v-card class="tonal-card pa-4 mb-4">
            <b>Learning Objectives:</b>
            <p>{{ data.objectives }}</p>
        </v-card>

        <v-card class="tonal-card pa-4">
            <v-row class="pa-0 ma-0">
              <v-col class="pa-0 ma-0" cols="12" lg="12" md="6" sm="12">
                <p class="p-text">Training Type: <b>{{ data.training_type }}</b></p>
              </v-col>
              <v-col class="pa-0 ma-0" cols="12" lg="12" md="6" sm="12">
                <p class="p-text">Source: <b>{{ data.training_source }}</b></p>
              </v-col>
              <v-col class="pa-0 ma-0" cols="12" lg="12" md="12" sm="12">
                <p class="p-text">Method: <b>{{ data.method }}</b></p>
              </v-col>
            </v-row>
        </v-card>

          <!-- Trainers -->
        <h4 class="p-section mt-8">Trainers ({{ mappedTrainers.length }})</h4>
        <v-divider class="mt-2 mb-4"></v-divider>
        <v-row class="pa-0 ma-0">
          <v-col v-for="trainer in mappedTrainers" :key="trainer.ID" class="px-1 py-0 ma-0 mb-2" cols="12" lg="6" md="6" sm="12">
            <v-card class="card-item card-hover-y py-2 px-3">
              <div class="d-flex align-center">
                <v-avatar class="mr-4" color="primary" size="40">
                  <span class="text-h5 font-weight-medium">
                    {{ trainer.name.charAt(0).toUpperCase() }}
                  </span>
                </v-avatar>
                <div class="flex-grow-1">
                  <p class="p-text">{{ trainer.name }}</p>
                  <p class="p-caption">{{ (trainer as any).position }}</p>
                </div>
              </div>
            </v-card>
          </v-col>
        </v-row>

        <h4 class="p-section mt-8">Materials & Links </h4>
        <v-divider class="mt-2 mb-4"></v-divider>
        <v-row class="pa-0 ma-0">
          <v-col v-for="material in JSON.parse(data.attachments)" :key="material.ID" 
            class="px-1 py-0 ma-0 mb-2" cols="12" lg="6" md="6" sm="12">
            <v-card class="card-item card-hover-y py-2 px-3" style="height: 100%;">
              <div class="d-flex align-center">
                <div class="flex-grow-1">
                  <p class="p-text">{{ material.name }}</p>
                  <p class="p-caption">{{ material.type }}</p>
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
          </v-col>
          <v-col v-for="link in JSON.parse(data.links)" :key="link.ID" 
            class="px-1 py-0 ma-0 mb-2" cols="12" lg="6" md="6" sm="12">
            <v-card class="card-item card-hover-y py-2 px-3" style="height: 100%;">
              <div class="d-flex align-center">
                <div class="flex-grow-1">
                  <p class="p-text">{{ link }}</p>
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
          </v-col>
        </v-row>
        <p v-if="JSON.parse(data.attachments).length == 0 && JSON.parse(data.links).length == 0">No Materials or Links uploaded</p>

          <!-- Images -->
        <h4 class="p-section mt-8">Images </h4>
        <v-divider class="mt-2 mb-4"></v-divider>
        <p v-if="!hasImages">No images uploaded</p>
        <v-row v-else class="pa-0 ma-0">
          <v-col v-if="hasImages" class="pa-0 ma-0" cols="12">
            <div class="d-flex mt-2" style="max-width: 100%; overflow-x: auto; gap: 8px;">
              <div 
                v-for="(image, index) in parsedImages" 
                :key="index" 
                class="border rounded"
                style="flex-shrink: 0;"
              >
              <a :href="mx.getFile(image)" target="_blank" rel="noopener noreferrer">
                <v-img
                  :src="mx.getFile(image)"
                  height="200"
                  width="200"
                  class="rounded"
                  cover
                  @error="handleImageError"
                >
                  <template v-slot:error>
                    <v-row class="fill-height ma-0" align="center" justify="center">
                      <v-icon size="48" color="grey">mdi-image-broken-variant</v-icon>
                    </v-row>
                  </template>
                </v-img>
              </a>
              </div>
            </div>
          </v-col>
        </v-row>
        <h4 class="p-section mt-8">Completion Link </h4>
        <v-divider class="mt-2 mb-4"></v-divider>
        <p v-if="data.proof_link == ''"> No link uploaded </p>
        <v-card v-else class="card-item card-hover-y py-2 px-3" style="height: 100%;">
          <div class="d-flex align-center">
            <div class="flex-grow-1">
              <p class="p-text">{{ data.proof_link }}</p>
            </div>
            <a :href="data.proof_link" target="_blank" rel="noopener noreferrer">
                <v-btn
                icon="mdi-open-in-new"
                size="small"
                variant="text"
                />
            </a>
          </div>
        </v-card>
        <h4 class="p-section mt-8">Remarks </h4>
        <v-divider class="mt-2 mb-4"></v-divider>
        <p class="p-text">{{ data.remarks || 'No remarks' }}</p>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useMXStore } from '@/stores/mx'

const mx = useMXStore()

const dialogWidth = computed(() => {
    if(mx.isMobile) return '100%'
    else if(mx.isTablet) return '100%'
    else if(mx.isDesktop) return '50%'
    else return '50%'
})

interface Trainer {
  ID: number
  name: string
}

interface Props {
  modelValue: boolean
  data: any
  trainers: Trainer[]
}

interface Emits {
  (e: 'update:modelValue', value: boolean): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

// Local model for v-model
const localModel = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

// Computed properties
const mappedTrainers = computed(() => {
  if (!props.data.trainers || !props.trainers) return []
  
  const trainerIds = Array.isArray(props.data.trainers) 
    ? props.data.trainers 
    : props.data.trainers.split(',').map((id: string) => parseInt(id))
  
  return props.trainers.filter((trainer: Trainer) => trainerIds.includes(trainer.ID))
})

const hasImages = computed(() => {
  return props.data.images && 
    ((typeof props.data.images === 'string' && props.data.images !== '[]' && props.data.images !== '') ||
     (Array.isArray(props.data.images) && props.data.images.length > 0))
})

const parsedImages = computed(() => {
  if (!props.data.images) return []
  
  try {
    return typeof props.data.images === 'string' 
      ? JSON.parse(props.data.images) 
      : props.data.images
  } catch (error) {
    console.error('Error parsing images:', error)
    return []
  }
})

// Methods
function formatDate(dateString: string): string {
  if (!dateString) return ''
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

function getStatusColor(status: string): string {
  switch (status?.toLowerCase()) {
    case 'completed':
      return 'success'
    case 'on-going':
      return 'warning'
    case 'planned':
      return 'info'
    case 'cancelled':
      return 'error'
    default:
      return 'grey'
  }
}

function getImageUrl(image: any): string {
  // If using a store like mx for image URLs
  if (typeof image === 'string') {
    return image.startsWith('http') ? image : `/api/images/${image}`
  }
  
  // If image object has a path or url property
  if (image?.path) return `/api/images/${image.path}`
  if (image?.url) return image.url
  
  // Default fallback
  return `/api/images/${image}`
}

function handleImageError(error: any): void {
  console.warn('Failed to load image:', error)
}
</script>

<style scoped>

</style>