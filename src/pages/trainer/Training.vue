<template>
    <div class="pa-2">
        <NoProfile v-if="!session.details" @goto="gotoProfile" />
        <div v-else class="px-3">
        <TrainingTable 
            :tableTitle="'Training Activities'" 
            :tableHeaders="tableData.headers" 
            :tableItems="tableData.items" 
            :tableBusy="tableData.loading"
            :permission="['complete', 'view', 'edit']"
            v-model:search="tableData.search"
            v-model:limit="tableData.limit"
            v-model:page="tableData.page"
            :dataCount="tableData.count"
            @add="handleAdd"
            @view="handleView"
            @edit="handleEdit"
            @complete="handleComplete"
        />
 <!-- Main Form Dialog -->
      <TrainingFormDialog 
        v-model="dialogData.main.data"
        :status="dialogData.main.status"
        :team-options="mainData.team"
        :training-sources="mainData.training_source"
        :delivery-methods="mainData.delivery_method"
        :attachment-list="mainData.attachment_list"
        :read-only="readOnly"
        @save="handleSave"
        @cancel="handleCancel"
        @attach="handleAttach"
        @remove-attachment="handleRemoveAttachment"
        @add-link="handleAddLink"
        @remove-link="handleRemoveLink"
      />

      <!-- View Dialog -->
      <TrainingViewDialog 
        v-model="dialogData.view.status"
        :data="dialogData.view.data"
        :trainers="mainData.team"
      />

      <!-- Complete Dialog -->
      <TrainingCompleteDialog 
        v-model="dialogData.complete.status"
        :images="dialogData.complete.images"
        :prooflink="dialogData.complete.proof_link"
        @link-change="handleProofLink"
        @file-change="handleFileChange"
        @remove-image="handleRemoveImage"
        @upload="handleCompleteUpload"
      />

      <!-- Cancel Confirmation Dialog -->
      <ConfirmDialog
        v-model="dialogData.cancel.status"
        title="Cancel"
        type="warning"
        message="Are you sure you want to cancel? All unsaved changes will be lost."
        @confirm="handleConfirmCancel"
      />

        </div>
    </div>
</template>

<style>
.removeIcon{
    margin-top: -10px !important;
    margin-right: -15px !important;
}
.small-text{
    font-size: 12px;
}
.section-details{
    font-size: 16px;
}
.section-details div{
    padding: 3px 0px !important;
}
</style>

<script lang="ts" setup>
import { ref, computed, onBeforeMount, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useSessionStore } from '@/stores/session'
import { useAlertStore } from '@/stores/alert'
import { useMXStore } from '@/stores/mx'
import { debounce } from '@/utils/debounce';
import { useTrainingService } from '@/composables/useTrainingService'
import { useFileUpload } from '@/composables/useFileUpload'
import { useFormValidation } from '@/composables/useFormValidation'
import type { TrainingData, DialogState, TeamMember } from '@/types/training'
import { TRAINING_CONSTANTS } from '@/constants/data'
// Components
import NoProfile from '@/components/common/NoProfile.vue'
import TrainingTable from '@/components/TrainingTable.vue'
import TrainingFormDialog from '@/components/training/TrainingFormDialog.vue'
import TrainingViewDialog from '@/components/training/TrainingViewDialog.vue'
import TrainingCompleteDialog from '@/components/training/TrainingCompleteDialog.vue'
import ConfirmDialog from '@/components/common/ConfirmDialog.vue'

// Stores and composables
const session = useSessionStore()
const router = useRouter()
const alertStore = useAlertStore()
const mx = useMXStore()

// Composables
const trainingService = useTrainingService()
const fileUpload = useFileUpload()
const formValidation = useFormValidation()

// Computed properties
const readOnly = computed(() => session.user.role === 'trainer')

// Constants


// Variables
const mainData = ref({
  team: [] as TeamMember[],
  training_source: TRAINING_CONSTANTS.TRAINING_SOURCES,
  delivery_method: TRAINING_CONSTANTS.DELIVERY_METHODS,
  attachment_list: [] as File[]
})

const tableData = ref({
  status: false,
  headers: TRAINING_CONSTANTS.TABLE_HEADERS,
  items: [] as TrainingData[],
  search: '',
  limit: 10,
  page: 1,
  count: 0,
  loading: false
})

const dialogData = ref<DialogState>({
  main: {
    status: false,
    data: trainingService.createEmptyTraining()
  },
  view: {
    status: false,
    data: {}
  },
  complete: {
    status: false,
    data: {},
    images: [],
    uploaded: [],
    proof_link: ''
  },
  cancel: {
    status: false
  }
})



// Methods
async function initializeData() {
  try {
    await Promise.all([
      await loadTeamData(),
      await loadTrainingData()
    ])
  } catch (error) {
    console.error('Failed to initialize data:', error)
    alertStore.showAlert('error', '', 'Failed to load data')
  }
}

async function loadTeamData() {
  try {
    const team = await trainingService.getTeamMembers(session.user)
    mainData.value.team = team
  } catch (error) {
    console.error('Failed to load team data:', error)
    throw error
  }
}

async function loadTrainingData() {
  tableData.value.loading = true
  try {
    let data = {
      filters: { status: 1 },
      find_in_set_any: {
        trainers: session.user.ID
      },
      limit: tableData.value.limit,
      page: tableData.value.page,
      search: tableData.value.search
    }
    const trainings = await trainingService.getTrainings(data)
    tableData.value.items = trainings.data
    tableData.value.count = trainings.meta.total_count
  } catch (error) {
    console.error('Failed to load training data:', error)
    throw error
  }
  tableData.value.loading = false
}


// Event handlers
function handleProofLink(link: string) {
  dialogData.value.complete.proof_link = link
}
function handleAdd() {
  dialogData.value.main.data = trainingService.createEmptyTraining()
  dialogData.value.main.status = true
}

function handleView(item: TrainingData) {
  dialogData.value.view.data = trainingService.prepareViewData(item, mainData.value.team)
  dialogData.value.view.status = true
}

function handleEdit(item: TrainingData) {
  dialogData.value.main.data = trainingService.prepareEditData(item)
  mainData.value.attachment_list = []
  dialogData.value.main.status = true
}

function handleComplete(item: TrainingData) {
  dialogData.value.complete.data = item
  dialogData.value.complete.images = []
  dialogData.value.complete.uploaded = []
  dialogData.value.complete.status = true
}

function handleCancel() {
  dialogData.value.cancel.status = true
}

function handleConfirmCancel() {
  closeDialogs()
  dialogData.value.cancel.status = false
}

async function handleSave() {
  if (!formValidation.validateTrainingData(dialogData.value.main.data)) {
    return
  }

  try {
    await trainingService.saveTraining(
      dialogData.value.main.data,
      mainData.value.attachment_list
    )
    
    closeDialogs()
    alertStore.showAlert('success', '', 'Training saved successfully', true)
    await loadTrainingData()
  } catch (error) {
    console.error('Failed to save training:', error)
    alertStore.showAlert('error', '', 'Failed to save training')
  }
}

function handleAttach(file: File) {
  if (!fileUpload.validateFileSize(file, 10)) {
    alertStore.showAlert('warning', '', 'File size must not be larger than 10MB', true)
    return
  }
  mainData.value.attachment_list.push(file)
}

function handleRemoveAttachment(index: number, type: number) {
  if (type === 2) {
    mainData.value.attachment_list.splice(index, 1)
  } else {
    dialogData.value.main.data.attachments.splice(index, 1)
  }
}

function handleAddLink(link: string) {
  // if (!link || !formValidation.validateLink(link)) {
  //   return
  // }
  
  dialogData.value.main.data.links = ([link])
  // dialogData.value.main.data.link = ''
}

function handleRemoveLink(index: number) {
  dialogData.value.main.data.links.splice(index, 1)
}

function handleFileChange(file: File) {
  if (!fileUpload.validateFileSize(file, 5)) {
    alertStore.showAlert('warning', '', 'File size must not be larger than 5MB', true)
    return
  }
  dialogData.value.complete.images.push(file)
}

function handleRemoveImage(index: number) {
  dialogData.value.complete.images.splice(index, 1)
}

async function handleCompleteUpload() {
  const { images, proof_link } = dialogData.value.complete

  if(!formValidation.validateLink(proof_link) && images.length === 0){
    alertStore.showAlert('warning', '', 'Completion link is not valid', true)
    return
  }
  if (images.length === 0 && proof_link == '') {
    if(images.length === 0){
      alertStore.showAlert('warning', '', 'No photo attached', true)
    }else{
      alertStore.showAlert('warning', '', 'Proof link is required', true)
    }
    return
  }

  try {
    if(proof_link){
      dialogData.value.complete.data.proof_link = proof_link
    }
    if(images.length > 0){
      const uploadedImages = await fileUpload.uploadMultipleImages(images)
      dialogData.value.complete.data.images = uploadedImages
    }
    
    dialogData.value.complete.data.training_status = 'Completed'
    dialogData.value.main.data = dialogData.value.complete.data
    
    await handleSave()
  } catch (error) {
    console.error('Failed to upload images:', error)
    alertStore.showAlert('error', '', 'Failed to upload images')
  }
}

function closeDialogs() {
  dialogData.value.main.status = false
  dialogData.value.complete.status = false
}

function gotoProfile() {
  router.push(`/${session.user.role}/profile`)
}

let timeoutId: number;


const performSearch = async () => {
  clearTimeout(timeoutId);
  timeoutId = setTimeout(async () => {
    await loadTrainingData();
  }, 250);
};

const debouncedSearch = debounce(performSearch, 500);


watch(() => tableData.value.search, (newValue) => {
    debouncedSearch();
})
watch(() => tableData.value.page, async () => {
  await loadTrainingData()
})
watch(() => tableData.value.limit, async () => {
  await loadTrainingData()
})


// Lifecycle
onBeforeMount(initializeData)
</script>

<style scoped>
.section-details {
  /* Add any specific styles here */
}

.text-link {
  color: var(--primary-color);
  cursor: pointer;
}

.removeIcon {
  top: -8px;
  right: -8px;
}
</style>