<template>
  <v-container fluid>
    <!-- Header Section -->

    <h3 class="section-title">Individual Development Plan (IDPs)</h3>

    <v-row class="mb-4">
      <v-col cols="12">
        <div class="d-flex justify-space-between align-center">
          <div>
            <h1 class="text-h4 font-weight-bold">Individual Development Plan</h1>
            <p class="text-subtitle-1 text-grey-darken-1">{{ selectedTrainer?.name || 'Select a trainer' }}</p>
          </div>
          <v-select
            v-model="selectedTrainerId"
            :items="trainers"
            item-title="name"
            item-value="id"
            label="Select Trainer"
            variant="outlined"
            density="compact"
            style="max-width: 300px;"
            @update:model-value="loadTrainerData"
          />
        </div>
      </v-col>
    </v-row>

    <!-- Performance Overview Section -->
    <v-row class="mb-6">
      <v-col cols="12">
        <v-card>
          <v-card-title class="bg-primary text-white">
            <v-icon class="mr-2">mdi-chart-line</v-icon>
            Performance Overview
          </v-card-title>
          <v-card-text>
            <v-row>
              <v-col cols="12" md="3">
                <v-card variant="outlined" class="text-center pa-4">
                  <v-icon size="40" color="primary" class="mb-2">mdi-clock-outline</v-icon>
                  <div class="text-h4 font-weight-bold">{{ performanceMetrics.targetHours }}h</div>
                  <div class="text-caption">Target No. of Hours</div>
                </v-card>
              </v-col>
              <v-col cols="12" md="3">
                <v-card variant="outlined" class="text-center pa-4">
                  <v-icon size="40" color="success" class="mb-2">mdi-star</v-icon>
                  <div class="text-h4 font-weight-bold">{{ performanceMetrics.avgFeedbackScore }}</div>
                  <div class="text-caption">Avg. Participant Feedback Score</div>
                </v-card>
              </v-col>
              <v-col cols="12" md="3">
                <v-card variant="outlined" class="text-center pa-4">
                  <v-icon size="40" color="info" class="mb-2">mdi-check-circle</v-icon>
                  <div class="text-h4 font-weight-bold">{{ performanceMetrics.completionRate }}%</div>
                  <div class="text-caption">Completion Rate</div>
                </v-card>
              </v-col>
              <v-col cols="12" md="3">
                <v-card variant="outlined" class="text-center pa-4">
                  <v-icon size="40" color="warning" class="mb-2">mdi-calendar-check</v-icon>
                  <div class="text-h4 font-weight-bold">{{ performanceMetrics.scheduleAdherence }}%</div>
                  <div class="text-caption">Adherence to Schedule</div>
                </v-card>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Individual Development Plan Section -->
    <v-row class="mb-6">
      <v-col cols="12">
        <v-card>
          <v-card-title class="bg-secondary text-white">
            <v-icon class="mr-2">mdi-account-arrow-up</v-icon>
            Individual Development Plan
          </v-card-title>
          <v-card-text>
            <v-row>
              <v-col cols="12" md="6">
                <h3 class="mb-3">Current Goals</h3>
                <div v-if="currentGoals.length === 0" class="text-center py-8">
                  <v-icon size="64" color="grey-lighten-2">mdi-target</v-icon>
                  <p class="text-grey-darken-1 mt-2">No active goals found</p>
                </div>
                <v-list v-else>
                  <v-list-item
                    v-for="goal in currentGoals"
                    :key="goal.id"
                    class="mb-2"
                    border
                    rounded
                  >
                    <template v-slot:prepend>
                      <v-avatar :color="getGoalStatusColor(goal.status)" size="small">
                        <v-icon size="16">{{ getGoalStatusIcon(goal.status) }}</v-icon>
                      </v-avatar>
                    </template>
                    <v-list-item-title class="font-weight-medium">{{ goal.title }}</v-list-item-title>
                    <v-list-item-subtitle>{{ goal.description }}</v-list-item-subtitle>
                    <template v-slot:append>
                      <div class="text-end">
                        <v-chip
                          :color="getGoalStatusColor(goal.status)"
                          size="small"
                          variant="tonal"
                        >
                          {{ goal.status }}
                        </v-chip>
                        <div class="text-caption text-grey-darken-1 mt-1">
                          Due: {{ formatDate(goal.targetDate) }}
                        </div>
                      </div>
                    </template>
                  </v-list-item>
                </v-list>
              </v-col>
              <v-col cols="12" md="6">
                <h3 class="mb-3">Progress Overview</h3>
                <v-card variant="outlined" class="pa-4">
                  <div class="d-flex justify-space-between align-center mb-3">
                    <span class="font-weight-medium">Overall Progress</span>
                    <span class="text-h6 font-weight-bold">{{ overallProgress }}%</span>
                  </div>
                  <v-progress-linear
                    :model-value="overallProgress"
                    color="primary"
                    height="8"
                    rounded
                  />
                  
                  <v-divider class="my-4" />
                  
                  <div class="d-flex justify-space-between text-body-2">
                    <div class="text-center">
                      <div class="text-h5 font-weight-bold text-success">{{ completedGoalsCount }}</div>
                      <div class="text-caption">Completed</div>
                    </div>
                    <div class="text-center">
                      <div class="text-h5 font-weight-bold text-warning">{{ inProgressGoalsCount }}</div>
                      <div class="text-caption">In Progress</div>
                    </div>
                    <div class="text-center">
                      <div class="text-h5 font-weight-bold text-error">{{ overdueGoalsCount }}</div>
                      <div class="text-caption">Overdue</div>
                    </div>
                  </div>
                </v-card>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Goal Setting & Monitoring Section -->
    <v-row>
      <v-col cols="12">
        <v-card>
          <v-card-title class="bg-accent text-white d-flex justify-space-between align-center">
            <div>
              <v-icon class="mr-2">mdi-target</v-icon>
              Goal Setting & Monitoring
            </div>
            <div>
              <v-btn
                color="white"
                variant="outlined"
                class="mr-2"
                @click="openSetGoalDialog"
              >
                <v-icon left>mdi-plus</v-icon>
                Set Goal
              </v-btn>
              <v-btn
                color="white"
                variant="text"
                @click="viewAllGoals"
              >
                <v-icon left>mdi-view-list</v-icon>
                View All Goals
              </v-btn>
            </div>
          </v-card-title>
          <v-card-text>
            <v-data-table
              :headers="goalHeaders"
              :items="allGoals"
              :loading="loading"
              item-value="id"
              class="elevation-0"
              :items-per-page="10"
            >
              <template v-slot:item.status="{ item }">
                <v-chip
                  :color="getGoalStatusColor(item.status)"
                  size="small"
                  variant="tonal"
                >
                  {{ item.status }}
                </v-chip>
              </template>
              
              <template v-slot:item.progress="{ item }">
                <div class="d-flex align-center">
                  <v-progress-linear
                    :model-value="item.progress"
                    :color="getProgressColor(item.progress)"
                    height="6"
                    rounded
                    class="mr-2"
                    style="min-width: 100px;"
                  />
                  <span class="text-caption">{{ item.progress }}%</span>
                </div>
              </template>
              
              <template v-slot:item.targetDate="{ item }">
                <span :class="{ 'text-error': isOverdue(item.targetDate) }">
                  {{ formatDate(item.targetDate) }}
                </span>
              </template>
              
              <template v-slot:item.actions="{ item }">
                <v-btn
                  color="primary"
                  size="small"
                  variant="outlined"
                  @click="updateProgress(item)"
                >
                  Update Progress
                </v-btn>
              </template>
            </v-data-table>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Set Goal Dialog -->
    <v-dialog v-model="setGoalDialog" max-width="600px" persistent>
      <v-card>
        <v-card-title class="text-h5">Set New Goal</v-card-title>
        <v-card-text>
          <v-form ref="goalForm" v-model="goalFormValid" @submit.prevent="submitGoal">
            <v-row>
              <v-col cols="12">
                <v-text-field
                  v-model="newGoal.title"
                  label="Goal Title"
                  :rules="[v => !!v || 'Goal title is required']"
                  required
                  variant="outlined"
                />
              </v-col>
              <v-col cols="12">
                <v-textarea
                  v-model="newGoal.description"
                  label="Description"
                  :rules="[v => !!v || 'Description is required']"
                  required
                  variant="outlined"
                  rows="3"
                />
              </v-col>
              <v-col cols="12" md="6">
                <v-select
                  v-model="newGoal.category"
                  :items="goalCategories"
                  label="Category"
                  :rules="[v => !!v || 'Category is required']"
                  required
                  variant="outlined"
                />
              </v-col>
              <v-col cols="12" md="6">
                <v-select
                  v-model="newGoal.priority"
                  :items="priorityLevels"
                  label="Priority"
                  :rules="[v => !!v || 'Priority is required']"
                  required
                  variant="outlined"
                />
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="newGoal.targetDate"
                  label="Target Date"
                  type="date"
                  :rules="[v => !!v || 'Target date is required']"
                  required
                  variant="outlined"
                />
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model.number="newGoal.targetValue"
                  label="Target Value (optional)"
                  type="number"
                  variant="outlined"
                />
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn color="grey" variant="text" @click="closeSetGoalDialog">
            Cancel
          </v-btn>
          <v-btn
            color="primary"
            :loading="submittingGoal"
            @click="submitGoal"
          >
            Create Goal
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Update Progress Dialog -->
    <v-dialog v-model="updateProgressDialog" max-width="500px" persistent>
      <v-card>
        <v-card-title class="text-h5">Update Progress</v-card-title>
        <v-card-text>
          <v-form ref="progressForm" v-model="progressFormValid">
            <div class="mb-4">
              <h3>{{ selectedGoalForUpdate?.title }}</h3>
              <p class="text-grey-darken-1">{{ selectedGoalForUpdate?.description }}</p>
            </div>
            
            <v-slider
              v-model="progressUpdate.progress"
              :min="0"
              :max="100"
              step="5"
              thumb-label="always"
              label="Progress (%)"
              class="mb-4"
            />
            
            <v-textarea
              v-model="progressUpdate.notes"
              label="Progress Notes"
              variant="outlined"
              rows="3"
              placeholder="Add notes about the progress made..."
            />
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn color="grey" variant="text" @click="closeUpdateProgressDialog">
            Cancel
          </v-btn>
          <v-btn
            color="primary"
            :loading="updatingProgress"
            @click="submitProgressUpdate"
          >
            Update Progress
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

interface Trainer {
  id: string
  name: string
  department: string
}

interface Goal {
  id: string
  title: string
  description: string
  category: string
  priority: 'High' | 'Medium' | 'Low'
  status: 'Not Started' | 'In Progress' | 'Completed' | 'Overdue'
  progress: number
  targetDate: string
  targetValue?: number
  createdDate: string
  notes?: string
}

interface PerformanceMetrics {
  targetHours: number
  avgFeedbackScore: number
  completionRate: number
  scheduleAdherence: number
}

interface NewGoal {
  title: string
  description: string
  category: string
  priority: string
  targetDate: string
  targetValue?: number
}

interface ProgressUpdate {
  progress: number
  notes: string
}

// Reactive data
const selectedTrainerId = ref<string>('')
const loading = ref(false)
const setGoalDialog = ref(false)
const updateProgressDialog = ref(false)
const goalFormValid = ref(false)
const progressFormValid = ref(false)
const submittingGoal = ref(false)
const updatingProgress = ref(false)
const selectedGoalForUpdate = ref<Goal | null>(null)

// Sample data
const trainers = ref<Trainer[]>([
  { id: '1', name: 'John Smith', department: 'Technical Training' },
  { id: '2', name: 'Sarah Johnson', department: 'Soft Skills Training' },
  { id: '3', name: 'Mike Davis', department: 'Leadership Training' },
  { id: '4', name: 'Emily Chen', department: 'Sales Training' }
])

const performanceMetrics = ref<PerformanceMetrics>({
  targetHours: 120,
  avgFeedbackScore: 4.2,
  completionRate: 85,
  scheduleAdherence: 92
})

const allGoals = ref<Goal[]>([
  {
    id: '1',
    title: 'Complete Advanced Presentation Skills Course',
    description: 'Enhance presentation delivery and audience engagement techniques',
    category: 'Skill Development',
    priority: 'High',
    status: 'In Progress',
    progress: 65,
    targetDate: '2025-12-15',
    createdDate: '2025-09-01'
  },
  {
    id: '2',
    title: 'Increase Participant Feedback Score',
    description: 'Achieve average feedback score of 4.5 or higher',
    category: 'Performance',
    priority: 'High',
    status: 'In Progress',
    progress: 40,
    targetDate: '2025-11-30',
    targetValue: 4.5,
    createdDate: '2025-08-15'
  },
  {
    id: '3',
    title: 'Obtain Project Management Certification',
    description: 'Complete PMP certification to expand training capabilities',
    category: 'Certification',
    priority: 'Medium',
    status: 'Not Started',
    progress: 0,
    targetDate: '2026-03-31',
    createdDate: '2025-09-10'
  },
  {
    id: '4',
    title: 'Develop E-learning Content',
    description: 'Create 5 interactive e-learning modules',
    category: 'Content Development',
    priority: 'Medium',
    status: 'Completed',
    progress: 100,
    targetDate: '2025-09-30',
    targetValue: 5,
    createdDate: '2025-06-01'
  }
])

const newGoal = ref<NewGoal>({
  title: '',
  description: '',
  category: '',
  priority: '',
  targetDate: '',
  targetValue: undefined
})

const progressUpdate = ref<ProgressUpdate>({
  progress: 0,
  notes: ''
})

const goalCategories = [
  'Skill Development',
  'Performance',
  'Certification',
  'Content Development',
  'Leadership',
  'Communication'
]

const priorityLevels = ['High', 'Medium', 'Low']

const goalHeaders = [
  { title: 'Goal Title', key: 'title', sortable: true },
  { title: 'Category', key: 'category', sortable: true },
  { title: 'Priority', key: 'priority', sortable: true },
  { title: 'Status', key: 'status', sortable: true },
  { title: 'Progress', key: 'progress', sortable: true },
  { title: 'Target Date', key: 'targetDate', sortable: true },
  { title: 'Actions', key: 'actions', sortable: false, width: '150px' }
]

// Computed properties
const selectedTrainer = computed(() => {
  return trainers.value.find(t => t.id === selectedTrainerId.value)
})

const currentGoals = computed(() => {
  return allGoals.value.filter(goal => 
    goal.status === 'In Progress' || goal.status === 'Not Started'
  ).slice(0, 4) // Show only first 4 current goals
})

const overallProgress = computed(() => {
  if (allGoals.value.length === 0) return 0
  const totalProgress = allGoals.value.reduce((sum, goal) => sum + goal.progress, 0)
  return Math.round(totalProgress / allGoals.value.length)
})

const completedGoalsCount = computed(() => {
  return allGoals.value.filter(goal => goal.status === 'Completed').length
})

const inProgressGoalsCount = computed(() => {
  return allGoals.value.filter(goal => goal.status === 'In Progress').length
})

const overdueGoalsCount = computed(() => {
  return allGoals.value.filter(goal => goal.status === 'Overdue').length
})

// Methods
const loadTrainerData = () => {
  loading.value = true
  // Simulate API call
  setTimeout(() => {
    // Load trainer-specific data here
    loading.value = false
  }, 1000)
}

const getGoalStatusColor = (status: string): string => {
  const colorMap: { [key: string]: string } = {
    'Completed': 'success',
    'In Progress': 'primary',
    'Not Started': 'warning',
    'Overdue': 'error'
  }
  return colorMap[status] || 'grey'
}

const getGoalStatusIcon = (status: string): string => {
  const iconMap: { [key: string]: string } = {
    'Completed': 'mdi-check',
    'In Progress': 'mdi-progress-clock',
    'Not Started': 'mdi-clock-outline',
    'Overdue': 'mdi-alert'
  }
  return iconMap[status] || 'mdi-help'
}

const getProgressColor = (progress: number): string => {
  if (progress >= 80) return 'success'
  if (progress >= 50) return 'primary'
  if (progress >= 25) return 'warning'
  return 'error'
}

const formatDate = (dateStr: string): string => {
  const date = new Date(dateStr)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

const isOverdue = (dateStr: string): boolean => {
  return new Date(dateStr) < new Date()
}

const openSetGoalDialog = () => {
  newGoal.value = {
    title: '',
    description: '',
    category: '',
    priority: '',
    targetDate: '',
    targetValue: undefined
  }
  setGoalDialog.value = true
}

const closeSetGoalDialog = () => {
  setGoalDialog.value = false
}

const submitGoal = async () => {
  if (!goalFormValid.value) return
  
  submittingGoal.value = true
  
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    const goal: Goal = {
      id: Date.now().toString(),
      title: newGoal.value.title,
      description: newGoal.value.description,
      category: newGoal.value.category,
      priority: newGoal.value.priority as 'High' | 'Medium' | 'Low',
      status: 'Not Started',
      progress: 0,
      targetDate: newGoal.value.targetDate,
      targetValue: newGoal.value.targetValue,
      createdDate: new Date().toISOString().split('T')[0]
    }
    
    allGoals.value.push(goal)
    closeSetGoalDialog()
  } catch (error) {
    console.error('Error creating goal:', error)
  } finally {
    submittingGoal.value = false
  }
}

const updateProgress = (goal: Goal) => {
  selectedGoalForUpdate.value = goal
  progressUpdate.value = {
    progress: goal.progress,
    notes: goal.notes || ''
  }
  updateProgressDialog.value = true
}

const closeUpdateProgressDialog = () => {
  updateProgressDialog.value = false
  selectedGoalForUpdate.value = null
}

const submitProgressUpdate = async () => {
  if (!selectedGoalForUpdate.value) return
  
  updatingProgress.value = true
  
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    const goalIndex = allGoals.value.findIndex(g => g.id === selectedGoalForUpdate.value!.id)
    if (goalIndex !== -1) {
      allGoals.value[goalIndex].progress = progressUpdate.value.progress
      allGoals.value[goalIndex].notes = progressUpdate.value.notes
      
      // Update status based on progress
      if (progressUpdate.value.progress === 100) {
        allGoals.value[goalIndex].status = 'Completed'
      } else if (progressUpdate.value.progress > 0) {
        allGoals.value[goalIndex].status = 'In Progress'
      }
    }
    
    closeUpdateProgressDialog()
  } catch (error) {
    console.error('Error updating progress:', error)
  } finally {
    updatingProgress.value = false
  }
}

const viewAllGoals = () => {
  // This could navigate to a detailed goals view or expand the current table
  console.log('View all goals clicked')
}

onMounted(() => {
  // Set default trainer
  if (trainers.value.length > 0) {
    selectedTrainerId.value = trainers.value[0].id
    loadTrainerData()
  }
})
</script>

<style scoped>
.v-card-title {
  font-size: 1.2rem;
  font-weight: 600;
}

.text-h4 {
  color: #1976d2;
}

.v-list-item {
  margin-bottom: 8px;
}

.v-progress-linear {
  margin: 8px 0;
}
</style>