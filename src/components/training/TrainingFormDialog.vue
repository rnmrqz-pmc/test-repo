<template>
  <v-dialog v-model="props.status" max-width="800" :persistent="true">
    <v-card class="pa-0 bg-white globalRadius" variant="flat">
      <v-card-title class="pa-2 ma-0 text-white text-center gradient-bg">
        <h2 class="p-title">Training Activity Form</h2>
      </v-card-title>
      <v-divider></v-divider>
      
      <v-card-text class="px-6 pt-3 ma-0" style="max-height: 76vh !important; overflow-y: scroll; position: relative;" >
        <v-row class="pa-0 ma-0">
          <!-- Training Title -->
          <v-col class="pa-0 ma-0" cols="12">
            <b class="mx-1">Training Title <span class="text-red">*</span></b>
            <v-text-field 
              v-model="props.modelValue.title"
              variant="outlined" 
              color="black" 
              density="compact"
              class="mx-1"
              :rules="[required_rule]"
              :hide-details="false"
              placeholder="eg. Basecamp Training"
            />
          </v-col>
          
          <!-- Date Range -->
          <v-col class="pa-0 ma-0 px-1" cols="12" lg="6" md="12" sm="12">
            <b class="mx-1">Start Date <span class="text-red">*</span></b>
            <GlobalDatePicker 
              :disabled="readOnly" 
              v-model="props.modelValue.start_date"
              :class="'mb-4 mx-1'" 
              :density="'compact'" 
              :tooltip="'Date selection is limited to the past 6 months'"
              :min="new Date(Date.now() - 6 * 30 * 24.5 * 60 * 60 * 1000).toISOString().slice(0, 10)"
              :format="formatEnCA"
            />
          </v-col>
          
          <v-col class="pa-0 ma-0 px-1" cols="12" lg="6" md="12" sm="12">
            <b class="mx-1">End Date <span class="text-red">*</span></b>
            <GlobalDatePicker 
              :disabled="readOnly" 
              v-model="props.modelValue.end_date"
              :class="'mb-4 mx-1'" 
              :density="'compact'"
              :min="String(props.modelValue.start_date)"
              :format="formatEnCA"
            />
          </v-col>

          <!-- Time Range -->
          <v-col class="pa-0 ma-0" cols="12" lg="6" md="12" sm="12">
            <b class="mx-1">Start Time <span class="text-red">*</span></b>
            <GlobalTimePicker 
              :disabled="readOnly" 
              v-model="props.modelValue.start_time"
              :class="'mx-1 mb-4'" 
              :density="'compact'"
            />
          </v-col>
          
          <v-col class="pa-0 ma-0" cols="12" lg="6" md="12" sm="12">
            <b class="mx-1">End Time <span class="text-red">*</span></b>
            <GlobalTimePicker 
              :disabled="readOnly" 
              v-model="props.modelValue.end_time"
              :class="'mx-1 mb-4'" 
              :density="'compact'"
              :min="props.modelValue.start_time"
            />
          </v-col>

          <!-- Location -->
          <v-col class="pa-0 ma-0 px-1" cols="12" lg="6" md="12" sm="12">
            <b class="mx-1">Location Type <span class="text-red">*</span></b>
            <v-radio-group 
              :disabled="readOnly" 
              v-model="props.modelValue.location_type" 
              style="margin-top: 0px !important;"
              hide-details
              class="ma-0 pa-0 pt-2"
              inline
            >
              <v-radio @click="props.modelValue.method = ''" label="Physical" value="Physical" class="mx-2" color="primary"/>
              <v-radio @click="props.modelValue.method = 'Virtual'" label="Virtual" value="Virtual" class="mx-2" color="primary"/>
            </v-radio-group>
          </v-col>

          <v-col class="pa-0 ma-0 px-1" cols="12" lg="6" md="12" sm="12">
            <b>Location Details <span class="text-red">*</span></b>
            <v-text-field 
              :disabled="readOnly" 
              v-model="props.modelValue.location_details" 
              variant="outlined" 
              color="black" 
              density="compact"
              class="mx-1"
              :rules="[required_rule, props.modelValue.location_type == 'Virtual' ? link_rule : true]"
              :hide-details="false"
              placeholder="e.g. Glorietta 5"
            />
          </v-col>

          <!-- Target Audience & Participants -->
          <v-col class="pa-0 ma-0 px-1" cols="12" lg="6" md="12" sm="12">
            <b class="mx-1">Target Audience <span class="text-red">*</span></b>
            <v-text-field 
              :disabled="readOnly" 
              v-model="props.modelValue.audience" 
              variant="outlined" 
              color="black" 
              density="compact"
              class="mx-1"
              :rules="[required_rule]"
              :hide-details="false"
              placeholder="e.g. New Hires"
            />
          </v-col>
          
          <v-col class="pa-0 ma-0 px-1" cols="12" lg="6" md="12" sm="12">
            <b class="mx-1">Number of Participants <span class="text-red">*</span></b>
            <v-text-field 
              v-model="props.modelValue.participants" 
              variant="outlined" 
              color="black" 
              density="compact"
              class="mx-1" 
              type="number"
              :rules="[required_rule, number_rule]"
              :maxlength="4"
              :hide-details="false"
            />
          </v-col>

          <!-- Learning Objectives -->
          <v-col class="pa-0 ma-0 px-1" cols="12">
            <b class="mx-1">Learning Objectives <span class="text-red">*</span></b>
            <v-text-field 
              :disabled="readOnly" 
              v-model="props.modelValue.objectives" 
              variant="outlined" 
              color="black" 
              density="compact"
              class="mx-1" 
              placeholder="e.g. Apple Ecosystem"
              :rules="[required_rule]"
              :hide-details="false"
            />
          </v-col>

          <!-- Training Hours & Trainers -->
          <v-col class="pa-0 ma-0 px-1" cols="12" lg="6" md="12" sm="12">
            <b class="mx-1">Training Hours <span class="text-red">*</span></b>
            <v-text-field 
              :disabled="readOnly" 
              v-model="computedTrainingHours" 
              variant="outlined" 
              color="black" 
              density="compact"
              class="mx-1" 
              type="number" 
              :readonly="true"
              :rules="[required_rule, number_rule]"
              :hide-details="false"
            />
          </v-col>
          
          <v-col class="pa-0 ma-0 px-1" cols="12" lg="6" md="12" sm="12">
            <b class="mx-1">Trainers <span class="text-red">*</span></b>
            <v-autocomplete 
              :disabled="readOnly" 
              v-model="props.modelValue.trainers"
              :items="computedTeamOptions"
              item-title="name"
              item-value="ID"
              variant="outlined"
              class="mx-1"
              density="compact"
              closable-chips 
              clearable 
              chips 
              multiple
              :hide-details="false" 
              :rules="[required_rule]"
            >
              <template v-slot:item="{ props, item }">
                <v-list-item v-bind="props">
                  <template v-slot:prepend="{ isActive }">
                    <v-list-item-action start>
                      <v-checkbox-btn :model-value="isActive"></v-checkbox-btn>
                    </v-list-item-action>
                  </template>
                  <template v-slot:title>
                    <v-list-item-title v-text="item.title"></v-list-item-title>
                    <p class="p-caption">{{ item.raw.position }}</p>
                  </template>
                  <template v-slot:append>
                    <v-menu location="top">
                      <v-card class="pa-4 bg-white globalRadius" variant="flat" style="max-height: 90vh !important; overflow-y: scroll;">
                        <template v-if="trainerSched.status">
                          <div v-for="sched in trainerSched.data" 
                          class="card-item py-3 px-4"> 
                            <p class="p-caption">EVENT</p>
                            <p class="p-text">{{ sched.title }}</p>
                            <p class="p-caption">SCHEDULE</p>
                            <p class="p-text">{{ mx.formatDate(sched.training_date) }} | {{ sched.start_time }} - {{ sched.end_time }}</p>
                          </div>
                          <div v-if="trainerSched.data.length === 0" class="card-item py-3 px-4">
                            <p class="p-text">No Training Schedule</p>
                          </div>
                        </template>
                        <div v-else>
                          <v-progress-circular indeterminate color="primary"></v-progress-circular> 
                        </div>
                      </v-card>
                    </v-menu>
                  </template>
                </v-list-item>
              </template>
            </v-autocomplete>
          </v-col>

          <!-- Training Status -->
          <v-col class="pa-0 ma-0 px-1" cols="12">
            <b class="mx-1">Training Status</b>
            <v-autocomplete 
              v-model="props.modelValue.training_status"
              :items="trainingStatusOptions"
              item-title="name"
              item-value="name"
              class="mb-4 mx-1"
              variant="outlined" 
              :hide-details="true"
              density="compact"
            />
          </v-col>

          <!-- Feedback Link -->
          <v-col class="pa-0 ma-0 px-1" cols="12">
            <b class="mx-1">Feedback / Evaluation Link</b>
            <v-text-field 
              :disabled="readOnly" 
              v-model="props.modelValue.feedback_link" 
              variant="outlined" 
              color="black" 
              density="compact"
              class="mb-4 mx-1" 
              :rules="[link_rule]"
              :hide-details="false"
              placeholder="e.g. Feedback Link"
            />
          </v-col>
        <!-- Training Category Section -->
        <v-col cols="12" class="pa-4 border globalRadius">
          <h3 class="mb-2">Training Category</h3>
          <v-row class="pa-0 ma-0">
            <!-- Training Type -->
            <v-col class="pa-0 ma-0" cols="12">
              <b>Training Type <span class="text-red">*</span></b>
              <div class="d-flex">
                <v-radio-group 
                  :disabled="readOnly" 
                  v-model="props.modelValue.training_type" 
                  style="margin-top: -8px !important;"
                  hide-details 
                  inline
                  class="ma-0 pa-0 pt-2"
                >
                  <v-radio label="Complimentary/Free" value="Free" class="mx-2" color="primary"/>
                  <v-radio label="Paid" value="Paid" class="mx-2" color="primary"/>
                  <v-radio label="Others" value="Others" class="mx-2" color="primary"/>
                  <v-text-field 
                    v-model="props.modelValue.others" 
                    variant="outlined" 
                    density="compact" 
                    :rules="[required_rule]"
                    class="mt-4" 
                    :disabled="props.modelValue.training_type !== 'Others'"
                  />
                </v-radio-group>
              </div>
            </v-col>

            <!-- Source -->
            <v-col class="pa-0 ma-0" cols="12">
              <b>Source <span class="text-red">*</span></b>
              <div class="d-flex" style="gap: 10px;">
                <v-autocomplete 
                  :disabled="readOnly" 
                  v-model="props.modelValue.training_source" 
                  :items="trainingSources"
                  item-title="name"
                  item-value="name"
                  variant="outlined"
                  class=""
                  density="compact"
                  :hide-details="false"
                  :rules="[required_rule]"
                />
                <v-text-field 
                  v-if="props.modelValue.training_source === 'Others'"
                  :disabled="readOnly" 
                  v-model="props.modelValue.training_source_others" 
                  variant="outlined" 
                  color="black" 
                  density="compact"
                  :rules="[required_rule]"
                  style="height: 40px;"
                />
              </div>
            </v-col>

            <!-- Delivery Method -->
            <v-col class="pa-0 ma-0" cols="12">
              <b>Delivery Method <span class="text-red">*</span></b>
              <v-autocomplete 
                :disabled="readOnly" 
                v-model="props.modelValue.method"
                :items="deliveryMethods"
                item-title="name"
                item-value="name"
                variant="outlined"
                class=""
                placeholder="Select delivery method"
                density="compact"
                :hide-details="false"
                :rules="[required_rule]"
                :readonly="props.modelValue.location_type === 'Virtual'"
              />
            </v-col>

            <!-- Attachments -->
            <v-col class="pa-0 ma-0" cols="12">
              <p><b>Attachments</b> (PDF, DOCS, PPTX, XLSX | File Size: 10MB)</p>
              <div class="d-flex mb-1">
                <v-file-input :disabled="readOnly"
                  @change="handleAttach"
                  placeholder="Attachment: PDF, DOCS, PPTX, XLSX | File Size: 10MB" 
                  variant="outlined" 
                  color="black"
                  class="" 
                  density="compact" 
                  :hide-details="true"
                  accept="
                    application/pdf,
                    application/msword,
                    application/vnd.openxmlformats-officedocument.wordprocessingml.document,
                    application/vnd.ms-excel,
                    application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,
                    application/vnd.ms-powerpoint,
                    application/vnd.openxmlformats-officedocument.presentationml.presentation
                  "
                  prepend-inner-icon="mdi-paperclip"
                  prepend-icon=""
                />
              </div>
              
              <div class="mb-4">
                <div v-for="(attach, index) in typeof props.modelValue.attachments === 'string' ? JSON.parse(props.modelValue.attachments) : props.modelValue.attachments" :key="index" class="d-flex">
                  <v-icon :disabled="readOnly" @click="$emit('remove-attachment', index, 1)" color="red" size="22">
                    mdi-delete
                  </v-icon>
                  <p class="mx-2 text-link">{{ attach.name }}</p>
                </div>
                <div v-for="(attach, index) in attachmentList" :key="index" class="d-flex">
                  <v-icon :disabled="readOnly" @click="$emit('remove-attachment', index, 2)" color="red" size="22">
                    mdi-delete
                  </v-icon>
                  <p class="mx-2 text-link">{{ attach.name }}</p>
                </div>
              </div>
            </v-col>

            <!-- Links -->
            <v-col class="pa-0 ma-0" cols="12">
              <b>Links</b>
              <div class="d-flex">
                <v-text-field 
                  v-model="props.modelValue.link" 
                  :disabled="readOnly" 
                  variant="outlined" 
                  color="black" 
                  density="compact"
                  class="mt-1 me-1"
                  :hide-details="false"
                  :rules="[link_rule]"
                  placeholder="e.g. https://drive.google.com/drive/folders"
                />
                <v-btn v-if="!readOnly"
                  @click="handleAddLink" 
                  style="margin-top: -20px;"
                  class="align-self-center" 
                  color="black" 
                  variant="elevated" 
                  rounded="pill"
                >
                  <v-icon>mdi-plus</v-icon>
                </v-btn>
              </div>
              
              <div>
                <div v-for="(link, index) in props.modelValue.links" :key="index" class="d-flex">
                  <v-icon :disabled="readOnly" @click="$emit('remove-link', index)" color="red">
                    mdi-delete
                  </v-icon>
                  <p class="mx-2 text-link">{{ link }}</p>
                </div>
              </div>
            </v-col>
          </v-row>
        </v-col>
        </v-row>
      </v-card-text>
        <v-overlay v-model="props.busy" class="align-center d-flex justify-center" contained>
          <v-progress-circular indeterminate size="74" width="6" class="text-primary" />
        </v-overlay>
      <v-card-actions class="d-flex justify-center pa-0 my-0">
        <v-btn @click="$emit('cancel')" :disabled="props.busy"
        variant="outlined" color="black" class="mx-1" width="120" rounded="pill">
          Cancel
        </v-btn>
        <v-btn @click="$emit('save')" :disabled="props.busy"
        class="--bg-main text-white" width="120" rounded="pill">
          {{ props.busy ? 'Saving...' : 'Save' }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref, computed, watch, getCurrentInstance, readonly } from 'vue'
import { required_rule, number_rule, link_rule } from '../../utils/rules'
import { decrypt } from '@/utils/encryptDecrypt'
import { useAlertStore } from '@/stores/alert'
import { useMXStore } from '@/stores/mx'
import { useSessionStore } from '@/stores/session'
import GlobalDatePicker from '../common/GlobalDatePicker.vue'
import GlobalTimePicker from '../common/GlobalTimePicker.vue'

interface Props {
  modelValue: any
  status: boolean
  teamOptions: any[]
  trainingSources: any[]
  deliveryMethods: any[]
  attachmentList: any
  readOnly: boolean
  busy: boolean
}

interface Emits {
  (e: 'update:data', value: boolean): void
  (e: 'update:modelValue', value: object): void
  (e: 'save'): void
  (e: 'cancel'): void
  (e: 'attach', file: File): void
  (e: 'remove-attachment', index: number, type: number): void
  (e: 'add-link', link: string): void
  (e: 'remove-link', index: number): void
}

const mx = useMXStore()
const alertStore = useAlertStore()
const { proxy } = getCurrentInstance()!
const props = defineProps<Props>()
const emit = defineEmits<Emits>()
const trainerSched = ref<any>({
  status: false,
  data: []
})
const session = useSessionStore()


// Local model for v-model
// const localModel = computed({
//   get: () => props.status,
//   set: (value) => emit('update:modelValue', value)
// })

// Local data copy
// const localData = ref({ ...props.modelValue })
watch(
  () => props.modelValue,
  (newData) => {
    emit('update:modelValue', (newData))
  }, { deep: true }
)

const dataSched = ref<any>([])
watch(
  () => [props.modelValue.start_date, props.modelValue.end_date, props.modelValue.start_time, props.modelValue.end_time],
  async (data) => {
    const [date_start, date_end, start_time, end_time] = data
    if(date_start && date_end){
      let filters = {
        'training_date >=': date_start,
        'training_date <=': date_end,
      }
      let find_in_set_any = {
        training_status: 'Planned,On-Going'
      }
      let group_by = ['trainers','training_date', 'start_time', 'end_time']
      const res = await proxy!.$api.getData('training_view', {filters, group_by, find_in_set_any})
      if(res.data.status){
        let decrypted = decrypt(res.data.data)

        const isConflict = decrypted.filter((training: any) => {
          const startTrainerDate = new Date(training.training_date + 'T' + training.start_time)
          const endTrainerDate = new Date(training.training_date + 'T' + training.end_time)
          const startDate = new Date(date_start + 'T' + start_time)
          const endDate = new Date(date_end + 'T' + end_time)
          return startTrainerDate < endDate && endTrainerDate > startDate
        })
        dataSched.value = isConflict
      }
    }
  },{ deep: true }
)

const trainingStatusOptions = computed(() => {  
  const today = new Date().toISOString().slice(0, 10)
  const dateIsGreaterThanToday = new Date(props.modelValue.start_date) > new Date(today)
  if(session.user.role == 'trainer'){
      return dateIsGreaterThanToday ? [
        { ID: 1, name: 'Planned' },
      ] : [
        { ID: 1, name: 'Planned' },
        { ID: 2, name: 'On-Going' },
      ]
  }else{
    if(session.user.role == 'supervisor'){
      return [
        { ID: 1, name: 'Planned' },
        { ID: 2, name: 'On-Going' },
        { ID: 3, name: 'Completed' },
      ]
    }else{
      return [
        { ID: 1, name: 'Planned' },
        { ID: 2, name: 'On-Going' },
        { ID: 3, name: 'Completed' },
        { ID: 4, name: 'Cancelled' },
      ]
    }
  }

})
const computedTeamOptions = computed(() => {
  const removeIds = dataSched.value
    .flatMap((item: any) => item.trainers.split(','))
    .map((id :any) => Number(id.trim()))
    .filter((id:any) => !isNaN(id))
  let id_list = removeIds
  if(props.modelValue.ID != ''){
     const currentIds = props.modelValue.trainers
       .map((id :any) => Number(id))
       .filter((id:any) => !isNaN(id))
     id_list = removeIds.filter((id:any) => !currentIds.includes(id))
  }
  if (id_list.length === 0) {
    return props.teamOptions
  }
  
  return props.teamOptions.filter((item: any) => 
    !removeIds.includes(Number(item.ID))
  )
})

// Computed training hours
const computedTrainingHours = computed(() => {
  const { start_date, end_date, start_time, end_time } = props.modelValue

  if (!start_date || !end_date || !start_time || !end_time) {
    return '0.00'
  }

  // Inclusive days count
  const startDate = new Date(start_date)
  const endDate = new Date(end_date)
  const days = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1

  // Hours per day calculation
  const startDateTime = new Date(`${start_date}T${start_time}`)
  const endDateTime = new Date(`${start_date}T${end_time}`)
  const hoursPerDay = (endDateTime.getTime() - startDateTime.getTime()) / (1000 * 60 * 60)
  
  const totalHours = (hoursPerDay * days).toFixed(2)
  props.modelValue.training_hours = parseFloat(totalHours)
  
  return totalHours
})


const checkTrainer = async (item: any, type: string) => {
  trainerSched.value.data = []
  trainerSched.value.status = false
  if(props.modelValue.start_date == '' || props.modelValue.end_date == ''){
    alertStore.showAlert('error', 'Error', 'Please select start and end date.', true)
    return
  }
  let filters = {
    // ID: item.props.value,
    'training_date >=': props.modelValue.start_date,
    'training_date <=': props.modelValue.end_date
  }
  let find_in_set_any = {
    trainers: item.props.value
  }
  const res = await proxy!.$api.getData('training_view', { filters, find_in_set_any })
  if(res.data.status){
    let decrypted = decrypt(res.data.data)
    if(type == 'get'){
      const isConflict = decrypted.filter((training:any) => 
        new Date(training.start_date + 'T' + training.start_time) < new Date(props.modelValue.end_date + 'T' + props.modelValue.end_time) ||
        new Date(training.start_date + 'T' + training.end_time) > new Date(props.modelValue.start_date + 'T' + props.modelValue.start_time)
      ).length > 0
      if (isConflict) {
        const index = props.modelValue.trainers.indexOf(item.value)
        if (index !== -1) {
          props.modelValue.trainers.splice(index, 1)
        }
        alertStore.showAlert('error', 'Error', `Selected trainer (${item.title}) has a conflict with another training schedule.`, true)
        return
      }
    }else{
      trainerSched.value.data = decrypted
      trainerSched.value.status = true
      // return decrypted
    }
  }
}

// Event handlers
function handleAttach(event: Event) {
  const target = event.target as HTMLInputElement
  if (target.files && target.files[0]) {
    emit('attach', target.files[0])
    target.value = ''
  }
}

function handleAddLink() {
  emit('add-link', props.modelValue.link)
}

function formatEnCA(date: string | null): string {
  if (!date) return ""
  return new Date(date).toLocaleDateString("en-CA", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  })
}
</script>

<style scoped>
.text-red {
  color: red;
}

.text-link {
  color: var(--primary-color);
  cursor: pointer;
}

.--bg-main {
  background-color: var(--main-color, #1976d2);
}

.globalRadius {
  border-radius: 8px;
}
</style>