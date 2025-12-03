<template>
  <v-dialog 
    :model-value="modelValue"  width="50%"
    @update:model-value="$emit('update:modelValue', $event)"  
    :persistent="true"
  >
    <v-card class="globalRadius" >
      <!-- Header with gradient background -->
      <div class="gradient-bg py-3 px-4">
        <div class="d-flex justify-space-between align-center">
          <div>
            <div class="text-h5 font-weight-bold text-white">
              Training Details
            </div>
            
            <!-- <div class="text-subtitle-1 text-white opacity-90">
              TR-{{ trainingData.extendedProps?.ID }}
            </div> -->
          </div>
          <div class="d-flex">
            <!-- Status Badge -->
            <div class="">
              <v-chip 
                :color="getStatusChipColor(trainingData.extendedProps.training_status)"
                variant="flat"
                size="large"
                rounded="pill"
                class="px-4 mx-2"
              >
                <v-icon start size="small">{{ getStatusIcon(trainingData.extendedProps.training_status) }}</v-icon>
                {{ trainingData.extendedProps.training_status }}
              </v-chip>
            </div>
            <v-btn 
              icon
              variant="text"
              color="white" size="small"
              @click="$emit('update:modelValue', false)"
              class="close-btn"
            >
              <v-icon size="x-large">mdi-close</v-icon>
            </v-btn>
          </div>
 
        </div>
      </div>
      
      <v-card-text class="pa-0 mb-2 mx-0" style="max-height: 78vh; overflow-y: auto;">

      <!-- Content with modern spacing -->
      <div class="px-3 pt-3" style="max-height: 78vh; overflow-y: auto;" >
        <!-- Course Info Card -->
        <v-card 
          class="card-item mb-4 globalRadius mx-2" 
          variant="flat" 
          color="grey-lighten-5"
          rounded="12"
        >
          <v-card-text class="pa-4">
            <div class="mb-3">
              <div class="p-caption">TRAINING</div>
              <div class="p-text">{{ trainingData.title }}</div>
            </div>
            <div class="mb-3">
              <div class="p-caption">OBJECTIVE</div>
              <div class="p-text">{{ trainingData.extendedProps.objectives }}</div>
            </div>
            <div class="mb-3">
              <div class="p-caption">SCHEDULE</div>
              <div class="p-text">{{ formatSchedule(trainingData.extendedProps) }}</div>
            </div>
            <div class="mb-3">
              <div class="p-caption">AUDIENCE</div>
              <div class="p-text">{{ trainingData.extendedProps.audience }} <b>({{ trainingData.extendedProps.participants }})</b></div>
            </div>
          </v-card-text>
        </v-card>        
        <!-- Schedule Section -->
        <v-row class="pa-0 ma-0">
          <v-col class="pa-0 ma-0" cols="6" lg="6" md="6" sm="12" style="width: 100%;">
            <div class="card-item card-hover-y pa-3 mx-2 mb-3">
              <table><tbody>
              <tr>
                <td class="p-caption uppercase pe-1">Type:</td>
                <td>{{ trainingData.extendedProps.location_type }}</td>
              </tr>
              <tr>
                <td class="p-caption uppercase pe-1 text-limit">Details:</td>
                <td>
                  <a v-if="trainingData.extendedProps.location_type == 'Virtual'" 
                  class="p-text text-limit" style="max-width: 16vw;"
                  :href="trainingData.extendedProps.location_details" target="_blank" rel="noopener noreferrer">
                    {{ trainingData.extendedProps.location_details }}
                  </a>
                  <p v-else>
                    {{ trainingData.extendedProps.location_details }}
                  </p>
                </td>
              </tr>
              <tr>
                <td class="p-caption uppercase pe-1">Method:</td>
                <td>{{ trainingData.extendedProps.method }}</td>
              </tr>
              </tbody></table>
            </div>
          </v-col>
          <v-col class="pa-0 ma-0" cols="6" lg="6" md="6" sm="12" style="width: 100%; height: 100%;">
            <div class="card-item card-hover-y pa-3 mx-2" style="height: 100%;">
              <table><tbody>
              <tr>
                <td class="p-caption uppercase pe-1">Training Type:</td>
                <td>{{ trainingData.extendedProps.training_type }}</td>
              </tr>
              <tr>
                <td class="p-caption uppercase pe-1 text-limit">Source:</td>
                <td>
                  {{ trainingData.extendedProps.training_source }}
                </td> 
              </tr>
              <tr>
                <td class="p-caption uppercase pe-1 text-limit">Feedback Link:</td>
                <td>
                  <a class="p-text text-limit" style="max-width: 16vw;"
                  :href="trainingData.extendedProps.feedback_link" target="_blank" rel="noopener noreferrer">
                    {{ trainingData.extendedProps.feedback_link }}
                  </a>
                </td> 
              </tr>
              </tbody></table>
            </div>
          </v-col>
        </v-row>

        <!-- Trainers Section -->
        <div class="mx-2">
          <h3 class="p-section mt-6">Trainers</h3>
          <v-divider class="mt-2 mb-4"></v-divider>
        </div>
        <v-row class="pa-0 ma-0">
          <v-col v-for="(item, id) in trainingData.extendedProps.trainers.split(',')" :key="id" 
          class="pa-0 mx-0 mb-3" cols="12" lg="6" md="6" sm="12">
            <div class="card-item card-hover-y pa-3 mx-2">
              <div class="d-flex align-center">
                <v-avatar color="secondary" size="32" class="mr-3">
                  <v-icon color="white" size="18">mdi-account</v-icon>
                </v-avatar>
                <div>
                  <p class="p-text">{{ trainer_list.find((trainer : any) => trainer.ID == item)?.name }}</p>
                  <p class="p-caption">{{ trainer_list.find((trainer : any) => trainer.ID == item)?.position }}</p>
                </div>
              </div>
            </div>
          </v-col>
        </v-row>


        <!-- Trainers Section -->
        <div class="mx-2">
          <h3 class="p-section mt-6">Materials & Links</h3>
          <v-divider class="mt-2 mb-4"></v-divider>
        </div>
        <v-row class="pa-0 ma-0">
          <v-col v-for="(item, id) in JSON.parse(trainingData.extendedProps.attachments)" :key="id" 
          class="pa-0 mb-2 mx-0" cols="12" lg="6" md="6" sm="12">
            <div class="card-item card-hover-y pa-3 mx-2">
              <div class="d-flex align-center">
                <v-icon class="mr-4" color="primary">mdi-file</v-icon>
                <div class="flex-grow-1">
                  <p class="p-text">{{ item.name }}</p>
                </div>
                <a :href="mx.getFile(item)" target="_blank" rel="noopener noreferrer">
                    <v-btn
                    icon="mdi-open-in-new"
                    size="small"
                    variant="text"
                    />
                </a>
              </div>
            </div>
          </v-col>
          <v-col v-for="(item, id) in JSON.parse(trainingData.extendedProps.links)" :key="id" 
          class="pa-0 mb-2 mx-0" cols="12" lg="6" md="6" sm="12">
            <div class="card-item card-hover-y pa-3 mx-2">
              <div class="d-flex align-center">
                <v-icon class="mr-4" color="primary">mdi-link</v-icon>
                <div class="d-flex justify-space-between text-limit" >
                  <a :href="item" target="_blank" rel="noopener noreferrer">
                    <p class="align-self-center">{{ item }}</p>
                  </a>
                </div>
              </div>
            </div>
          </v-col>
        </v-row>
      </div>
      </v-card-text>

      <v-card-actions v-if="canCancelTraining" class="d-flex justify-center pa-3">
            <v-btn 
            @click="confirmDialog = true"
            color="error" 
            variant="flat"
            rounded="pill" 
            min-width="140"
            :loading="isLoading"
            class="cancel-btn px-3"
          >
            Cancel Training
          </v-btn>
      </v-card-actions>
    </v-card>

    <!-- Modern Confirmation Dialog -->
    <ConfirmDialog 
        v-model="confirmDialog"
        title="Cancel"
        type="error"
        cancelText="No"
        confirmText="Yes"
        confirmColor="error"
        message="Are you sure you want to cancel this training? This action cannot be undone."
        @confirm="$emit('cancel', remarks); confirmDialog = false;"
        :disabled="remarks == ''"
      >
      <template #custom-field>
        <p class="p-caption uppercase p-bold text-left mt-3">Remarks</p>
        <v-textarea v-model="remarks"
          variant="outlined"
          color="black"
          class="white-input"
          placeholder="Input your remarks"
        />
      </template>
    </ConfirmDialog>
  </v-dialog>
</template>

<script setup lang="ts">
import ConfirmDialog from './common/ConfirmDialog.vue'
import { computed, defineProps, defineEmits, ref } from 'vue'
import { useMXStore } from '@/stores/mx'

const mx = useMXStore()

interface Props {
  modelValue: boolean
  trainingData: any
  isLoading?: boolean
  trainer_list?: any
}

const props = withDefaults(defineProps<Props>(), {
  isLoading: false
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  'cancel': any
}>()

const confirmDialog = ref(false)

const canCancelTraining = computed(() => {
  const status = props.trainingData.extendedProps?.training_status
  return status === 'Planned' || status === 'On-Going'
})
const remarks = ref('')

function getStatusChipColor(status?: string): string {
  const colorMap: Record<string, string> = {
    'Planned': 'info',
    'On-Going': 'warning',
    'Completed': 'success',
    'Cancelled': 'error',
    'Active': 'primary'
  }
  return colorMap[status || ''] || 'grey'
}

function getStatusIcon(status?: string): string {
  const iconMap: Record<string, string> = {
    'Planned': 'mdi-calendar-clock',
    'On-Going': 'mdi-play-circle',
    'Completed': 'mdi-check-circle',
    'Cancelled': 'mdi-cancel',
    'Active': 'mdi-circle-slice-8'
  }
  return iconMap[status || ''] || 'mdi-help-circle'
}

const formatSchedule = (data : any) => {
  const start = new Date(data.start_date);
  const end = new Date(data.end_date);

  const sameDay =
    start.getDate() === end.getDate() &&
    start.getMonth() === end.getMonth() &&
    start.getFullYear() === end.getFullYear();

  const sameMonth = start.getMonth() === end.getMonth() && start.getFullYear() === end.getFullYear();
  const sameYear = start.getFullYear() === end.getFullYear();

  let datePart = '';

  if (sameDay) {
    datePart = start.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  } else if (sameMonth && sameYear) {
    const month = start.toLocaleString('en-US', { month: 'long' });
    const year = start.getFullYear();
    datePart = `${month} ${start.getDate()} - ${end.getDate()}, ${year}`;
  } else if (sameYear) {
    datePart = `${start.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })} - ${end.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}, ${start.getFullYear()}`;
  } else {
    datePart = `${start.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })} - ${end.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}`;
  }

  const time_start = start.toLocaleTimeString('en-US', { hour12: false });
  const time_end = end.toLocaleTimeString('en-US', { hour12: false });
  return `${datePart} | ${data.start_time} - ${data.end_time}`;
}
</script>

<style scoped>

.cancel-btn {
  box-shadow: 0 4px 16px rgba(244, 67, 54, 0.3);
  transition: all 0.2s ease;
}

.cancel-btn:hover {
  box-shadow: 0 6px 20px rgba(244, 67, 54, 0.4);
  transform: translateY(-1px);
}

/* Smooth animations */
.v-dialog > .v-overlay__content {
  animation: dialogSlideIn 0.3s ease-out;
}

@keyframes dialogSlideIn {
  from {
    opacity: 0;
    transform: translateY(-20px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}
</style>