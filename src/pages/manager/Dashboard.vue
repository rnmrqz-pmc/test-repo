<template>
  <div class="pa-2">
    <NoProfile v-if="!session.details" @goto="gotoProfile()" />
    <div v-else class="px-1">
      <v-expansion-panels variant="accordion" class="mt-2 mb-4 globalRadius">
        <v-expansion-panel class="globalRadius">
          <v-expansion-panel-title class="gradient-bg">
            <h4 class="p-title text-white">My Trainings</h4>
          </v-expansion-panel-title>
          <v-expansion-panel-text class="bg-grey-lighten-4">
            <Dashboard/>
          </v-expansion-panel-text>
          </v-expansion-panel>
      </v-expansion-panels>

      <!-- Header Section with improved responsive design -->
      <v-row class="px-0 ma-0 align-center mb-2 pt-2">
        <v-col cols="12" md="6" class="d-flex pa-0 ma-0">
          <h1 class="px-2 section-title d-flex align-center align-self-center">
            <v-icon class="mr-3" color="black">mdi-chart-line</v-icon>
            Key Performance Indicators
          </h1>
        </v-col>
        <v-col cols="12" md="6" class="pa-0 ma-0 d-flex justify-end">
          <!-- <v-menu 
            v-model="menu2"
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
              <v-icon>mdi-account</v-icon>
              </v-btn>
            </template>
            <v-card class="globalRadius pa-3" elevation="8" min-width="340">
              <v-card-title class="px-0 pb-2">
                <h3>Select Filter</h3>
              </v-card-title>
              <v-card-text class="pa-0">
                <v-btn-toggle 
                  v-model="quickFilterSelection"
                  mandatory
                  density="compact"
                  class="w-100 mb-4"
                >
                  <v-btn size="small">Role</v-btn>
                  <v-btn size="small">Team</v-btn>
                  <v-btn size="small">Type</v-btn>
                </v-btn-toggle>
                <v-autocomplete 
                  v-if="quickFilterSelection === 0"
                  :items="mainData.role_list"
                  item-title="name"
                  item-value="name"
                  multiple chips
                  label="Select Role"
                  variant="outlined"
                  density="compact"
                  hide-details
                />
                <v-autocomplete 
                  v-if="quickFilterSelection === 1"
                  :items="mainData.team_list"
                  item-title="name"
                  item-value="ID"
                  label="Select Team"
                  variant="outlined"
                  density="compact"
                  hide-details
                />

                <v-autocomplete 
                  v-if="quickFilterSelection === 2"
                  :items="mainData.type_list"
                  item-title="name"
                  item-value="ID"
                  label="Select Type"
                  variant="outlined"
                  density="compact"
                  hide-details
                />
              </v-card-text>  
              <v-card-actions class="pa-0">
                <v-spacer />
                <v-btn
                  @click="menu2 = false"
                  variant="outlined"
                  color="black"
                  class="mx-1" rounded="pill"
                >
                  Cancel
                </v-btn>
                <v-btn
                  color="green"
                  class="mx-1" rounded="pill" variant="flat"
                  elevation="2" min-width="80"
                >
                  Apply
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-menu> -->
          <div class="d-flex align-center px-2">
            <!-- Date range display -->
             <v-menu v-if="session.user.role != 'supervisor'"
              v-model="card_filter"
              :close-on-content-click="false" 
              location="bottom end"
              min-width="320"
            >
              <template v-slot:activator="{ props }">
  
                  <v-icon v-bind="props">mdi-dots-vertical</v-icon>
              </template>
              
              <v-card class="globalRadius pa-3" elevation="8" min-width="340">
                <v-card-title class="px-0 pb-2">
                  <h3>Card Filters</h3>
                </v-card-title>

                  <v-row class="mb-3">
                  <v-col cols="12">
                    <v-btn-toggle 
                      v-model="quickTypeSelection"
                      mandatory
                      density="compact"
                      class="w-100"
                    >
                      <v-btn size="small">By Team</v-btn>
                      <v-btn size="small">By Trainer</v-btn>
                    </v-btn-toggle>
                  </v-col>
                </v-row>

                <div>                  
                  <v-autocomplete v-model="filterModel.card_team" 
                    v-if="quickTypeSelection === 0"
                    :items="unique_teams"
                    item-title="name"
                    item-value="name"
                    label="Select Team"
                    variant="outlined"
                    density="compact"
                    hide-details
                  />

                  <v-autocomplete v-model="filterModel.card_trainer" 
                    v-if="quickTypeSelection === 1"
                    :items="mainData.trainer_list"  
                    item-title="name"
                    item-value="ID"
                    label="Select Trainer"
                    variant="outlined"
                    density="compact"
                    hide-details
                  />
                </div>
                
                <v-card-actions class="px-0 pt-3">
                  <v-spacer></v-spacer>
                  <v-btn @click="card_filter = false" 
                    variant="outlined" 
                    rounded="pill"
                    class="px-4">
                    Close
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-menu>
            <v-chip 
              v-if="mainData.dateRange.start && mainData.dateRange.end"
              class="mr-3 align-self-center"
              color="black"
              variant="outlined"
            >
              <v-icon start>mdi-calendar</v-icon>
              {{ formatDateRange() }}
            </v-chip>
            
            <!-- date filter menu -->
            <v-menu 
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
                  <h3>Select Date Range</h3>
                </v-card-title>
                
                <!-- Quick date presets -->
                <v-row class="mb-3">
                  <v-col cols="12">
                    <v-btn-toggle 
                      v-model="quickDateSelection"
                      @update:model-value="applyQuickDate"
                      mandatory
                      density="compact"
                      class="w-100"
                    >
                      <v-btn size="small">This Month</v-btn>
                      <v-btn size="small">Last Month</v-btn>
                      <v-btn size="small">Last 3 Months</v-btn>
                      <v-btn size="small">Custom</v-btn>
                    </v-btn-toggle>
                  </v-col>
                </v-row>
                
                <!-- Date pickers -->
                <v-row>
                  <v-col cols="6">
                    <GlobalDatePicker 
                      v-model="mainData.dateRange.start"
                      label="Start Date"
                      :format="formatEnCA"
                      density="compact"
                      :disabled="quickDateSelection !== 3"
                    />
                  </v-col>
                  <v-col cols="6">
                    <GlobalDatePicker 
                      v-model="mainData.dateRange.end"
                      label="End Date"
                      :format="formatEnCA"
                      density="compact"
                      :min="new Date(mainData.dateRange.start).toISOString().split('T')[0]"
                      :disabled="quickDateSelection !== 3"
                    />
                  </v-col>
                </v-row>
                
                <v-card-actions class="px-0 pt-3">
                  <v-spacer></v-spacer>
                  <v-btn @click="resetFilters" 
                    variant="outlined" rounded="pill"
                    class="px-3">
                    Reset
                  </v-btn>
                  <v-btn @click="saveFilter" 
                    color="green-darken-1" 
                    variant="elevated" 
                    rounded="pill"
                    class="px-4">
                    Apply
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-menu>
          </div>
        </v-col>
      </v-row>

      <!-- KPI Cards with animations and loading states -->
      <v-row class="pa-0 ma-0 mb-6">
        <v-col 
          v-for="(card, index) in kpiCards" 
          :key="index"
          cols="12" sm="6" md="6" lg="3" 
          class="pa-2"
        >
          <v-card style="height: 100%;"
            class="px-4 pt-4 pb-0 globalRadius card-hover-y" 
            variant="elevated" 
            elevation="4"
            :class="`side-card-${index + 1}`"
            hover
          >
            <div class="d-flex align-center mb-2">
              <v-avatar :color="card.color" size="48" class="mr-3">
                <v-icon :icon="card.icon" color="white" size="24"></v-icon>
              </v-avatar>
              <div class="w-100">
                <h3 class="text-h6 font-weight-bold">{{ card.title }}</h3>
                <p class="text-caption text-medium-emphasis mb-0">{{ card.subtitle }}</p>
              </div>
            </div>
            <div class="text-center">
              <div class="d-flex justify-center align-center">
                <p class="font-weight-bold mb-1" :class="`text-${card.color} ${index == 3 ? 'text-h5' : 'text-h4'}`">
                  {{ card.value }}
                </p>
                <p class="mx-1 text-h6">{{ card.caption }}</p>
              </div>
              
              <p v-if="card.description != ''" class="text-body-2 text-medium-emphasis">{{ card.description }}</p>
              
              <!-- Special rating component for satisfaction score -->
              <v-rating 
                v-if="card.showRating"
                :model-value="parseFloat(card.rawValue || 0)"
                class="d-flex justify-center"
                density="compact" 
                color="amber"
                half-increments 
                readonly
                size="default"
              />
            </div>
          </v-card>
        </v-col>
      </v-row>

      <!-- Trainer Performance Table -->
      <v-card variant="elevated" class="mx-2 mb-6 globalRadius" elevation="3">
        <v-card-title class="px-2 gradient-bg text-white">
          <v-row class="pa-0 ma-0">
            <v-col cols="12" sm="6" md="7" lg="6"
            class="pa-0 ma-0 d-flex align-center">
              <h3 class="px-2">Trainer Performance</h3>
            </v-col>
            <v-col cols="12" sm="6" md="5" lg="3"
              class="pa-0 ma-0 d-flex align-center justify-end">
              <div class="d-flex align-center mx-2" style="min-width: 100%;">
                <v-autocomplete
                  v-model="filterModel.completed_team"
                  :items="unique_teams"
                  item-title="name"
                  item-value="ID"
                  density="compact"
                  variant="outlined"
                  color="black"
                  class="white-input text-black"
                  hide-details
                  placeholder="Filter by Trainer"
                  prepend-inner-icon="mdi-account-group"
                  clearable
                />
              </div>
            </v-col>
            <v-col cols="12" sm="6" md="5" lg="3"
            class="pa-0 ma-0 d-flex align-center justify-end">
              <div class="d-flex align-center" style="min-width: 100%;">
                <v-autocomplete
                  v-model="filterModel.completed"
                  :items="mainData.trainer_list"
                  item-title="name"
                  item-value="ID"
                  density="compact"
                  variant="outlined"
                  color="black"
                  class="white-input text-black"
                  hide-details
                  placeholder="Filter by Trainer"
                  prepend-inner-icon="mdi-magnify"
                  clearable
                />
              </div>
            </v-col>
          </v-row>        
        </v-card-title>
        
        <v-divider />
        
        <v-data-table
          :headers="completedHeaders"
          :items="computedCompleted"
          :loading="loading.trainings"
          class="elevation-0 pb-0 mb-0"
          hover
          item-value="ID"
        >
          <template v-slot:item.name="{ item  }">
            <div class="d-flex align-center">
              <v-avatar color="primary" size="32" class="mr-3">
                <span class="text-white text-body-2">
                  {{ getInitials((item as any).name) }}
                </span>
              </v-avatar>
              <div>
                <div class="font-weight-medium nowrap">{{ (item as any).name }}</div>
                <div class="text-caption text-medium-emphasis">{{ (item as any).team || 'N/A' }}</div>
              </div>
            </div>
          </template>
          
          <template v-slot:item.COMPLETION_RATE="{ item }">
            <div class="d-flex align-center justify-center">
              <b class="text-green">{{ Math.round((item as any).COMPLETION_RATE) }}%</b>

              <!-- <v-progress-circular
                :model-value="parseFloat((item as any).COMPLETION_RATE)"
                :color="getCompletionColor(parseFloat((item as any).COMPLETION_RATE))"
                size="32"
                width="4"
                class="mr-2"
              >
                <span class="text-caption">{{ Math.round((item as any).COMPLETION_RATE) }}%</span>
              </v-progress-circular> -->
              
            </div>
          </template>
          
          <!-- <template v-slot:item.SESSION_CONDUCTED="{ item }">
            <v-chip 
              color="black"
              variant="tonal"
            >
              {{ (item as any).SESSION_CONDUCTED }}
            </v-chip>
          </template> -->
          
          <template v-slot:loading>
            <v-skeleton-loader type="table-row@5" />
          </template>
          
          <template v-slot:no-data>
            <v-empty-state
              icon="mdi-database-search"
              title="No trainers found"
              text="Try adjusting your filters or date range"
            />
          </template>
        </v-data-table>
        
        <v-card-actions class="pt-0 mt-0">
          <v-spacer />
          <v-btn
            @click="exportCSV"
            prepend-icon="mdi-download"
            variant="outlined"
            color="primary"
          >
            Export CSV
          </v-btn>
        </v-card-actions>
      </v-card>

      <!-- Trainer Workload Analysis -->
      <!-- <v-card variant="elevated" class="mx-2 mb-6 globalRadius" elevation="3">
        <v-card-title class="d-flex px-2 gradient-bg text-white align-center justify-space-between">
          <v-row class="pa-0 ma-0">
            <v-col cols="12" sm="6" md="7" lg="6"
            class="pa-0 ma-0 d-flex align-center">
              <h3 class="px-2">Workload Balance</h3>
            </v-col>
            <v-col cols="12" sm="6" md="5" lg="3"
            class="pa-0 ma-0 d-flex align-center justify-end">
               <div style="min-width: 100%;" class="mx-2">
                <v-autocomplete
                  v-model="filterModel.imbalance_team"
                  :items="unique_teams"
                  item-title="name"
                  item-value="ID"
                  density="compact"
                  variant="outlined"
                  class="white-input text-black"
                  hide-details
                  placeholder="Select Trainer"
                  prepend-inner-icon="mdi-account-group"
                  clearable
                />
              </div>
            </v-col>
            <v-col cols="12" sm="6" md="5" lg="3"
            class="pa-0 ma-0 d-flex align-center justify-end">
               <div style="min-width: 100%;">
                <v-autocomplete
                  v-model="filterModel.imbalance"
                  :items="mainData.trainer_list"
                  item-title="name"
                  item-value="ID"
                  density="compact"
                  variant="outlined"
                  class="white-input text-black"
                  hide-details
                  placeholder="Select Trainer"
                  clearable
                />
              </div>
            </v-col>
          </v-row>
         
        </v-card-title>
        
        <v-divider />
        
        <v-data-table
          :headers="workloadHeaders"
          :items="computedImbalance"
          :loading="loading.imbalance"
          class="elevation-0"
          hover
        >
          <template v-slot:item.name="{ item }">
            <div class="d-flex align-center nowrap">
              {{ (item as any).name }}
            </div>
          </template>
          <template v-slot:item.WORK_LOAD="{ item }">
            <v-chip 
              :color="getWorkloadColor((item as any).WORK_LOAD)"
              variant="tonal"
            >
              <v-icon 
                :icon="getWorkloadIcon((item as any).WORK_LOAD)" 
                size="16" 
                class="mr-1"
              />
              {{ (item as any).WORK_LOAD }}
            </v-chip>
          </template>
          <template v-slot:item.PAID_PERCENT="{ item }">
            <v-chip color="success"  variant="tonal">
              {{ (item as any).PAID_PERCENT }}%
            </v-chip>
          </template>
          <template v-slot:item.FREE_PERCENT="{ item }">
            <v-chip color="info" variant="tonal">
              {{ (item as any).FREE_PERCENT }}%
            </v-chip>
          </template>
          <template v-slot:item.workload_distribution="{ item }">
            <div class="d-flex align-center">
              <div class="mr-3" style="min-width: 120px;">
                <v-progress-linear
                  :model-value="(item as any).PAID_PERCENT"
                  color="success"
                  height="8"
                  rounded
                  class="mb-1"
                >
                  <template v-slot:default>
                    <span class="text-caption">Paid: {{ (item as any).PAID_PERCENT }}%</span>
                  </template>
                </v-progress-linear>
                <v-progress-linear
                  :model-value="(item as any).FREE_PERCENT"
                  color="info"
                  height="8"
                  rounded
                >
                  <template v-slot:default>
                    <span class="text-caption">Free: {{ (item as any).FREE_PERCENT }}%</span>
                  </template>
                </v-progress-linear>
              </div>
            </div>
          </template>
          
          <template v-slot:item.actions="{ item }">
            <v-btn
              @click="viewImbalanceDetails(item)"
              color="primary"
              size="small"
              variant="tonal"
              icon="mdi-eye"
            />
          </template>
        </v-data-table>
      </v-card> -->

      <!-- Charts Section -->
      <v-row class="pa-0 ma-0 mb-4">
        <!-- Top Performers List -->
        <v-col cols="12" lg="4" class="pa-2">
          <v-card class="globalRadius" elevation="3">
            <v-card-title class="gradient-bg text-white">
              <div class="d-flex align-center">
                <!-- <v-icon class="mr-2">mdi-trophy</v-icon> -->
                <h4>Top Performing Trainers</h4>
              </div>
            </v-card-title>
            <v-divider />
            <v-list class="pa-0 scrollable-list">
              <v-list-item
                v-for="(item, index) in mainData.chartData"
                :key="index"
                :class="{ 'bg-primary-lighten-5': mainData.activeTrainer === index }"
                @click="selectTrainer(index)"
                :ripple="true"
              >
                <template v-slot:prepend>
                  <v-avatar :color=" index < 3 ? (index == 0 ? 'amber-darken-1' : 'yellow-darken-1') : 'grey'" size="40">
                    <v-icon v-if="index === 0" color="white">mdi-trophy</v-icon>
                    <v-icon v-else-if="index < 3" color="white">mdi-crown</v-icon>
                    <span v-else class="text-white">{{ index + 1 }}</span>
                  </v-avatar>
                </template>
                
                <v-list-item-title class="font-weight-bold">
                  {{ item.trainerName }}
                </v-list-item-title>
                
                <v-list-item-subtitle>
                  {{ calculateTotalHours(item) }} total sessions
                </v-list-item-subtitle>
                
                <template v-slot:append>
                  <v-icon v-if="mainData.activeTrainer === index" color="primary">
                    mdi-chevron-right
                  </v-icon>
                </template>
              </v-list-item>
            </v-list>
          </v-card>
        </v-col>

        <!-- Bar Chart - Sessions Conducted -->
        <v-col cols="12" lg="8" class="pa-2">
          <v-card class="globalRadius h-100" elevation="3">
            <v-card-title class="gradient-bg text-white">
              <div class="d-flex align-center justify-space-between w-100">
                <div class="d-flex align-center">
                  <!-- <v-icon class="mr-2" color="success">mdi-chart-bar</v-icon> -->
                  <h4>Monthly Sessions</h4>
                </div>
                <!-- <v-chip v-if="selectedTrainerName" color="black" variant="outlined">
                  {{ selectedTrainerName }}
                </v-chip> -->
              </div>
            </v-card-title>
            <div class="pa-2 chart-container">
              <BarChart 
                :labels="ChartData.bar.labels" 
                :datasets="ChartData.bar.datasets"
                :key="`bar-${mainData.activeTrainer}`"
              />
            </div>
          </v-card>
        </v-col>

        <!-- Pie Chart - Feedback Distribution -->
        <v-col cols="12" lg="4" class="pa-2">
          <v-card class="globalRadius h-100" elevation="3">
            <v-card-title class="gradient-bg text-white">
              <div class="d-flex align-center">
                <!-- <v-icon class="mr-2">mdi-chart-pie</v-icon> -->
                <h4>Satisfaction Distribution</h4>
              </div>
            </v-card-title>
            <v-divider />
            <div class="d-flex justify-center align-center chart-container pt-2">
              <PieChart 
                :labels="ChartData.pie.labels" 
                :values="ChartData.pie.values"
                :key="`pie-${mainData.activeTrainer}`"
              />
            </div>
          </v-card>
        </v-col>

        <!-- Line Chart - Participants Trained -->
        <v-col cols="12" lg="8" class="pa-2">
          <v-card class="globalRadius h-100" elevation="3">
            <v-card-title class="gradient-bg text-white">
              <div class="d-flex align-center">
                <!-- <v-icon class="mr-2" color="primary">mdi-chart-line</v-icon> -->
                <h4>Participants Trained</h4>
              </div>
            </v-card-title>
            <div class="pa-2 chart-container">
              <LineChart
                :labels="ChartData.line.labels"
                :values="ChartData.line.values"
                label="Participants"
                borderColor="#1976d2"
                backgroundColor="rgba(25,118,210,0.1)"
                :key="`line-${mainData.activeTrainer}`"
              />
            </div>
          </v-card>
        </v-col>
      </v-row>

      <!-- Details Dialog -->
      <v-dialog 
        v-model="dialog.imbalance.status"
        max-width="600"
        persistent
      >
        <v-card class="globalRadius" elevation="8">
          <v-card-title class="gradient-bg text-white d-flex align-center justify-space-between">
            <div class="d-flex align-center">
              <!-- <v-icon class="mr-2">mdi-account-details</v-icon> -->
              <h3>Trainer Details</h3>
            </div>
            <v-btn
              @click="dialog.imbalance.status = false"
              icon="mdi-close"
              variant="text"
              color="white" 
              size="small"
              class="close-btn"
            />
          </v-card-title>
          
          <v-card-text class="pa-6">
            <div class="mb-4">
              <h4 class="text-h6 font-weight-bold mb-2">
                {{ dialog.imbalance.data.name }}
              </h4>
              <v-chip :color="getWorkloadColor(dialog.imbalance.data.WORK_LOAD)" size="small">
                {{ dialog.imbalance.data.WORK_LOAD }} Workload
              </v-chip>
            </div>
            
            <v-row>
              <v-col cols="6">
                <div class="detail-item">
                  <!-- <v-icon class="mr-2" color="grey">mdi-briefcase</v-icon> -->
                  <div>
                    <div class="text-caption text-medium-emphasis">Position</div>
                    <div class="font-weight-medium">{{ dialog.imbalance.data.position || 'N/A' }}</div>
                  </div>
                </div>
              </v-col>
              <v-col cols="6">
                <div class="detail-item">
                  <!-- <v-icon class="mr-2" color="grey">mdi-account-group</v-icon> -->
                  <div>
                    <div class="text-caption text-medium-emphasis">Team</div>
                    <div class="font-weight-medium">{{ dialog.imbalance.data.team || 'N/A' }}</div>
                  </div>
                </div>
              </v-col>
            </v-row>
            
            <v-divider class="my-4" />
            
            <!-- Workload Metrics -->
            <div class="mb-4">
              <h5 class="text-subtitle-1 mb-3">Workload Metrics</h5>
              <v-row>
                <v-col cols="6">
                  <v-card variant="tonal" color="warning">
                    <v-card-text class="text-center">
                      <div class="text-h6 font-weight-bold">{{ dialog.imbalance.data.TARGET_HOURS }}</div>
                      <div class="text-caption">Target Hours</div>
                    </v-card-text>
                  </v-card>
                </v-col>
                <v-col cols="6">
                  <v-card variant="tonal" color="success">
                    <v-card-text class="text-center">
                      <div class="text-h6 font-weight-bold">{{ dialog.imbalance.data.CURRENT_HOURS }}</div>
                      <div class="text-caption">Current Hours</div>
                    </v-card-text>
                  </v-card>
                </v-col>
              </v-row>
            </div>
            
            <!-- Training Distribution -->
            <div>
              <h5 class="text-subtitle-1 mb-3">Training Distribution</h5>
              <v-row>
                <v-col cols="4">
                  <v-card variant="tonal" color="info">
                    <v-card-text class="text-center">
                      <div class="text-h6 font-weight-bold">{{ dialog.imbalance.data.TOTAL_TRAININGS }}</div>
                      <div class="text-caption">Total</div>
                    </v-card-text>
                  </v-card>
                </v-col>
                <v-col cols="4">
                  <v-card variant="tonal" color="success">
                    <v-card-text class="text-center">
                      <div class="text-h6 font-weight-bold">{{ dialog.imbalance.data.PAID_COUNT }}</div>
                      <div class="text-caption">Paid</div>
                    </v-card-text>
                  </v-card>
                </v-col>
                <v-col cols="4">
                  <v-card variant="tonal" color="primary">
                    <v-card-text class="text-center">
                      <div class="text-h6 font-weight-bold">{{ dialog.imbalance.data.FREE_COUNT }}</div>
                      <div class="text-caption">Free</div>
                    </v-card-text>
                  </v-card>
                </v-col>
              </v-row>
            </div>
          </v-card-text>
        </v-card>
      </v-dialog>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, getCurrentInstance, onBeforeMount, computed, watch } from 'vue'
import { useSessionStore } from '@/stores/session'
import { useMXStore } from '@/stores/mx'
import { useRouter } from 'vue-router'
import { decrypt } from '@/utils/encryptDecrypt'
import { useAlertStore } from '@/stores/alert'
import NoProfile from '@/components/common/NoProfile.vue'
import GlobalDatePicker from '@/components/common/GlobalDatePicker.vue'
import BarChart from '@/components/chart/BarChart.vue'
import PieChart from '@/components/chart/PieChart.vue'
import LineChart from '@/components/chart/LineChart.vue'
import Dashboard from '../trainer/Dashboard.vue'

const router = useRouter()
const session = useSessionStore()
const { proxy } = getCurrentInstance()!
const mx = useMXStore()
const alertStore = useAlertStore()

// Loading states
const loading = ref({
  trainings: false,
  imbalance: false,
  charts: false
})


const quickFilterSelection = ref(0)
// Quick date selection
const quickDateSelection = ref(0)
const quickTypeSelection = ref(0)
// table headers
const completedHeaders = ref<any>([
  { title: 'Trainer', align: 'start', key: 'name', sortable: false },
  { title: 'Hours Delivered', align: 'center', key: 'DELIVERED_HOURS', sortable: false },
  { title: 'Target Hours', align: 'center', key: 'TARGET_HOURS', sortable: false },
  { title: 'Sessions', align: 'center', key: 'SESSION_CONDUCTED', sortable: false },
  { title: 'Participants', align: 'center', key: 'TRAINED_PARTICIPANTS', sortable: false },
  // { title: 'Completion Rate', align: 'center', key: 'COMPLETION_RATE', sortable: false },
])

const workloadHeaders = ref<any>([
  { title: 'Trainer', align: 'start', key: 'name', sortable: false },
  { title: 'Total Assignments', align: 'center', key: 'TOTAL_TRAININGS', sortable: false },
  { title: 'Paid Trainings %', align: 'center', key: 'PAID_PERCENT', sortable: false },
  { title: 'Free Trainings %', align: 'center', key: 'FREE_PERCENT', sortable: false },
  // { title: 'Distribution', align: 'center', key: 'workload_distribution', sortable: false },
  { title: 'Workload Status', align: 'center', key: 'WORK_LOAD', sortable: false },
  { title: 'Actions', align: 'center', key: 'actions', sortable: false },
])

const tableData = ref<any>({
  items: [],
  items2: []
})

let mainData = ref<any>({
  completed: [],
  currentMonth: [],
  role_list: [
    { ID: 0, name: 'Admin' },
    { ID: 1, name: 'Manager' },
    { ID: 2, name: 'Supervisor' },
    { ID: 3, name: 'Trainer' }
  ],
  type_list: [
    { ID: 0, name: 'Physical' },
    { ID: 1, name: 'Virtual' },
    { ID: 2, name: 'Free' },
    { ID: 3, name: 'Paid' }
  ],
  trainer_list: [{ name: 'All', ID: 0 }],
  workColor: {
    Low: 'warning',
    Balance: 'success', 
    High: 'error'
  },
  activeImbalance: {},
  dateRange: {
    start: '',
    end: ''
  },
  chartData: [],
  activeTrainer: 1,
  teamMembers: ''
})

const filterModel = ref<any>({
  imbalance: 0,
  completed: 0,
  card_team: 'All',
  card_trainer: 'All',
  completed_team: 'All',
  imbalance_team: 'All'
})

const ChartData = ref<any>({
  bar: {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [
      {
        label: 'Sessions',
        backgroundColor: '#7bd15e',
        borderColor: '#1976d2',
        data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
      }
    ]
  },
  pie: {
    labels: ["Very Dissatisfied", "Dissatisfied", "Neutral", "Satisfied", "Very Satisfied"],
    values: [0, 0, 0, 0, 0]
  },
  line: {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    values: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
  }
})

const menu = ref(false)
const menu2 = ref(false)
const card_filter = ref(false)
const dialog = ref<any>({
  imbalance: {
    status: false,
    data: {}
  }
})

// Computed properties for KPI cards
const kpiCards = computed(() => {
  const kpiData = kpi.value
  return [
    {
      title: 'Total Training Hours',
      subtitle: 'This Period',
      value: `${kpiData.totalHours}`,
      rawValue: kpiData.totalHours,
      caption: '',
      description: 'Hours delivered',
      icon: 'mdi-clock-outline',
      color: 'primary',
    },
    {
      title: 'Training Sessions',
      subtitle: 'Completed',
      value: kpiData.totalSessions.toString(),
      rawValue: kpiData.totalSessions,
      caption: '',
      description: 'Sessions conducted',
      icon: 'mdi-calendar-check',
      color: 'error',
    },
    {
      title: 'Satisfaction Score',
      subtitle: 'Average Rating',
      value: `${kpiData.avgRating.toFixed(1)}/5.0`,
      rawValue: kpiData.avgRating,
      description: '',
      icon: 'mdi-star-outline',
      color: 'warning',
      showRating: true,
    },
    {
      title: 'Top Trainer',
      subtitle: 'Highest Performance',
      value: kpiData.topTrainer.name || 'N/A',
      rawValue: kpiData.topTrainer.totalHours,
      description: `${kpiData.topTrainer.totalHours || 0} hours`,
      icon: 'mdi-trophy-outline',
      color: 'success',
    }
  ]
})

const selectedTrainerName = computed(() => {
  return mainData.value.chartData[mainData.value.activeTrainer]?.trainerName || ''
})

// Utility functions
function getInitials(name: string): string {
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
}
function getCompletionColor(rate: number): string {
  if (rate >= 90) return 'success'
  if (rate >= 70) return 'warning'
  return 'error'
}
function getWorkloadColor(workload: string): string {
  switch (workload) {
    case 'Low': return 'warning'
    case 'Balance': return 'success'
    case 'High': return 'error'
    default: return 'grey'
  }
}
function getWorkloadIcon(workload: string): string {
  switch (workload) {
    case 'Low': return 'mdi-trending-down'
    case 'Balance': return 'mdi-scale-balance'
    case 'High': return 'mdi-trending-up'
    default: return 'mdi-help'
  }
}

function onMenuClick(index: number, item: any): void {
  switch (index) {
    case 0:
      applyQuickDate(item.value)
      break
  }
}
function formatDateRange(): string {
  if (!mainData.value.dateRange.start || !mainData.value.dateRange.end) return ''
  return `${mx.formatDate(mainData.value.dateRange.start)} - ${mx.formatDate(mainData.value.dateRange.end)}`
}

function calculateTotalHours(trainer: any): number {
  return trainer.bar_monthly?.reduce((sum: number, hours: number) => sum + hours, 0) || 0
}

function selectTrainer(index: number): void {
  mainData.value.activeTrainer = index
}

function applyQuickDate(selection: number): void {
  const now = new Date()
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0)
  
  switch (selection) {
    case 0: // This Month
      mainData.value.dateRange.start = formatEnCA(startOfMonth.toISOString())
      mainData.value.dateRange.end = formatEnCA(endOfMonth.toISOString())
      break
    case 1: // Last Month
      const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)
      const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0)
      mainData.value.dateRange.start = formatEnCA(lastMonth.toISOString())
      mainData.value.dateRange.end = formatEnCA(lastMonthEnd.toISOString())
      break
    case 2: // Last 3 Months
      const threeMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 3, 1)
      mainData.value.dateRange.start = formatEnCA(threeMonthsAgo.toISOString())
      mainData.value.dateRange.end = formatEnCA(endOfMonth.toISOString())
      break
    case 3: // Custom - don't auto-set dates
      break
  }
}

function resetFilters(): void {
  mainData.value.dateRange.start = ''
  mainData.value.dateRange.end = ''
  filterModel.value.completed = 0
  filterModel.value.imbalance = 0
  quickDateSelection.value = 0
  menu.value = false
  getTrainings()
}

function saveFilter(): void {
  menu.value = false
  getTrainings()
  alertStore.showAlert('success', '', 'Filters applied successfully', true)
}
function saveFilter2(): void {
  card_filter.value = false
}

function exportCSV(): void {
  try {
    let csvContent = ""
    let dataHeaders = [
      { title: 'Name', key: 'name' },

    ]

    csvContent += completedHeaders.value.map((h: any) => h.title).join(",") + "\n"
    
    computedCompleted.value.forEach((row: any) => {
      let rowData = completedHeaders.value.map((h: any) => {
        let value = row[h.key] ?? ""
        value = String(value).replace(/"/g, '""')
        return `"${value}"`
      })
      csvContent += rowData.join(",") + "\n"
    })
    
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const link = document.createElement("a")
    link.href = URL.createObjectURL(blob)
    
    const team = session.user.role === 'manager' ? 'All' : session.user.team
    const date = new Date().toISOString().split('T')[0].replace(/-/g, '')
    if(session.user.role == 'manager'){
      link.download = `OrgPerformance_${date}.csv`
    }
    if(session.user.role == 'supervisor'){
      link.download = `TeamPerformance_${team}_${date}.csv`
    }
    link.click()
    
    alertStore.showAlert('success', '', 'CSV exported successfully', true)
  } catch (error) {
    alertStore.showAlert('error', '', 'Failed to export CSV', true)
  }
}

function viewImbalanceDetails(item: any): void {
  dialog.value.imbalance.data = item
  dialog.value.imbalance.status = true
}

function formatEnCA(date: string | null): string {
  if (!date) return ""
  return new Date(date).toLocaleDateString("en-CA", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  })
}

function gotoProfile(): void {
  router.push(`/${session.user.role}/profile`)
}

// API Functions with error handling
async function getTeamMembers(){
    let data : any = {
        filters: {
          status: 1
        }
    }
    if(session.user.role == 'supervisor'){
        data.filters.team = session.user.team
        data.filters.manager = 0
    }

    try {
        const res = await proxy!.$api.getData('trainers', data)
        if(res.data.status){
            let decrypted = decrypt(res.data.data)
            mainData.value.teamMembers = decrypted.map((item:any) => item.ID).join(',')
        }
    } catch (error) {
        console.error('Failed to load team data:', error)
        throw error
    }
}

async function getTrainings(): Promise<void> {
  loading.value.trainings = true
  try {
    let res: any
    
    if (mainData.value.dateRange.start && mainData.value.dateRange.end) {
      const data = {
        procName: 'get_kpi',
        dataParams: [
          mainData.value.dateRange.start,
          mainData.value.dateRange.end,
          mainData.value.teamMembers
        ]
      }


      res = await proxy!.$api.callProcedure(data)
    } else {
      const data = {
        filters: {
          team: session.user.role === 'supervisor' ? session.user.team : '',
          TR_MONTH: new Date().getMonth() + 1
        },
        find_in_set_any: {
          ROLE: session.user.role == 'supervisor' ? 'supervisor,trainer' : 'manager,supervisor,trainer',
        }
      }
      
      if (session.user.role != 'supervisor') {
        delete data.filters.team
      }
      
      res = await proxy!.$api.getData('trainer_kpi_view', data)
    }

    if (res.data.status) {
      const decrypted = decrypt(res.data.data)
      mainData.value.completed = decrypted
      tableData.value.items = decrypted.map((item: any) => ({
        ...item,
        COMPLETION_RATE: ((parseFloat(item.DELIVERED_HOURS) / parseFloat(item.TARGET_HOURS)) * 100).toFixed(2)
      }))
    } else {
      throw new Error(res.data.error)
    }
  } catch (error) {
    console.error('Error fetching trainings:', error)
    alertStore.showAlert('error', '', 'Failed to load training data', true)
  } finally {
    loading.value.trainings = false
  }
}

async function getMonthly(): Promise<void> {
  loading.value.charts = true
  try {
    const data = {
      filters: {
        team: session.user.role === 'supervisor' ? session.user.team : '',
      },
      find_in_set_any: {
        ROLE: session.user.role === 'supervisor' ? 'supervisor,trainer' : 'supervisor,trainer,manager'

      }
    }
    
    if (session.user.role != 'supervisor') {
      delete data.filters.team
    }
    const res: any = await proxy!.$api.getData('trainer_monthly_view', data)
    if (res.data.status) {
      const decrypted = decrypt(res.data.data)
      const uniqueTrainer = [...new Set(decrypted.map((item: any) => item.ID))].sort((a, b) => 
        decrypted.find((item: any) => item.ID == b).DELIVERED_HOURS - decrypted.find((item: any) => item.ID == a).DELIVERED_HOURS
      )
      const chartList = [] as any[]
      uniqueTrainer.forEach((trainerId: any) => {
        const trainerName = decrypted.find((item: any) => item.ID === trainerId)?.name || 'Unknown'
        const bar_monthly = []
        const line_monthly = []
        const pie_monthly = [0, 0, 0, 0, 0]
        
        for (let i = 0; i < 12; i++) {
          const monthData = decrypted.find((item: any) => item.ID === trainerId && item.TR_MONTH === i + 1)
          bar_monthly.push(monthData ? monthData.SESSION_CONDUCTED : 0)
          line_monthly.push(monthData ? monthData.TRAINED_PARTICIPANTS : 0)

          if (monthData) {
            pie_monthly[0] += parseFloat(monthData.SCR_PCT_1) || 0
            pie_monthly[1] += parseFloat(monthData.SCR_PCT_2) || 0
            pie_monthly[2] += parseFloat(monthData.SCR_PCT_3) || 0
            pie_monthly[3] += parseFloat(monthData.SCR_PCT_4) || 0
            pie_monthly[4] += parseFloat(monthData.SCR_PCT_5) || 0
          }
        }
        
        chartList.push({
          trainerName,
          bar_monthly,
          line_monthly,
          pie_monthly
        })
      })
      chartList.sort((a, b) => b.bar_monthly.reduce((sum :any, val :any) => sum + val, 0) - a.bar_monthly.reduce((sum:any, val:any) => sum + val, 0))
      mainData.value.chartData = chartList
      mainData.value.activeTrainer = 1
      selectTrainer(0)
    } else {
      throw new Error(res.data.error)
    }
  } catch (error) {
    console.error('Error fetching monthly data:', error)
    alertStore.showAlert('error', '', 'Failed to load chart data', true)
  } finally {
    loading.value.charts = false
  }
}

async function getImbalance(): Promise<void> {
  loading.value.imbalance = true
  try {
    const data = {
      filters: {
        team: session.user.role === 'supervisor' ? session.user.team : '',
        TR_MONTH: new Date().getMonth() + 1
      },
      find_in_set_any:{
        ROLE: session.user.role === 'manager' ? ['supervisor', 'trainer', 'manager'] : ['supervisor', 'trainer'],
      }
    }
    
    if (session.user.role === 'manager') {
      delete data.filters.team
    }

    const res: any = await proxy!.$api.getData('trainer_imbalance_view', data)
    
    if (res.data.status) {
      const decrypted = decrypt(res.data.data)
      tableData.value.items2 = decrypted.map((item: any) => ({
        ...item,
        FREE_PERCENT: parseInt(item.FREE_PERCENT),
        PAID_PERCENT: parseInt(item.PAID_PERCENT)
      }))
      mainData.value.trainer_list = [
        { name: 'All', ID: 0 }, 
        ...decrypted
      ]
    } else {
      throw new Error(res.data.error)
    }
  } catch (error) {
    console.error('Error fetching imbalance data:', error)
    alertStore.showAlert('error', '', 'Failed to load workload data', true)
  } finally {
    loading.value.imbalance = false
  }
}

// Computed properties
const unique_teams = computed(() => {
  const team_list = mainData.value.trainer_list
    .map((item: any) => item.team)
    .filter((v, i, a) => a.indexOf(v) === i && v != null)
    .map((team: any) => ({ name: team, ID: team }));
  return [{ name: 'All', ID: 'All' }, ...team_list];
});



const kpi = computed(() => {
  const data: any = {
    totalHours: 0,
    totalSessions: 0,
    topTrainer: { name: '', totalHours: 0, totalSessions: 0 },
    avgRating: 0
  }
  
  if (mainData.value.completed.length > 0) {
    let completed = mainData.value.completed
    if(filterModel.value.card_team !== 'All' && quickTypeSelection.value == 0){
      completed = completed.filter((item: any) => item.team === filterModel.value.card_team)
    }
    if(filterModel.value.card_trainer !== 'All' && quickTypeSelection.value == 1){
      completed = completed.filter((item: any) => item.ID === filterModel.value.card_trainer)
    }
    data.totalHours = completed.reduce((a: any, b: any) => a + parseInt(b.DELIVERED_HOURS || 0), 0)
    data.totalSessions = completed.reduce((a: any, b: any) => a + parseInt(b.SESSION_CONDUCTED || 0), 0)
    
    const uniqueTrainer = [...new Set(completed.map((item: any) => item.ID))]
    let topTrainer = { name: '', totalHours: 0, totalSessions: 0 }
    
    uniqueTrainer.forEach((trainerId: any) => {
      const trainerData = completed.filter((data: any) => data.ID === trainerId)
      const totalHours = trainerData.reduce((a: any, b: any) => a + parseFloat(b.DELIVERED_HOURS || 0), 0)
      const totalSessions = trainerData.reduce((a: any, b: any) => a + parseFloat(b.SESSION_CONDUCTED || 0), 0)
      
      if (totalHours > topTrainer.totalHours) {
        topTrainer = {
          name: trainerData[0]?.name || 'Unknown',
          totalHours,
          totalSessions
        }
      }
    })
    
    data.topTrainer = topTrainer
    data.avgRating = completed.reduce((a: any, b: any) => 
      a + (b.AVG_SCORE ? parseFloat(b.AVG_SCORE) : 0), 0) / mainData.value.completed.length || 0
  }
  
  return data
})

const computedCompleted = computed(() => {
  let data = tableData.value.items
  if (filterModel.value.completed !== 0) {
    data = tableData.value.items.filter((item: any) => item.ID === filterModel.value.completed)
  }
  if(filterModel.value.completed_team !== 'All'){
    data = data.filter((item: any) => item.team == filterModel.value.completed_team)
  }
  data.sort((a:any, b:any) => (a as any).team.localeCompare(b.team))
  return data
})

const computedImbalance = computed(() => {
  let data = tableData.value.items2
  if (filterModel.value.imbalance !== 0) {
    data = tableData.value.items2.filter((item: any) => item.ID === filterModel.value.imbalance)
  }
  if(filterModel.value.imbalance_team !== 'All'){
    data = data.filter((item: any) => item.team == filterModel.value.imbalance_team)
  }
  return data
})

// Watchers
watch(() => mainData.value.activeTrainer, (newIndex) => {
  if (mainData.value.chartData[newIndex]) {
    const data = mainData.value.chartData[newIndex]
    
    ChartData.value.bar = {
      ...ChartData.value.bar,
      datasets: [{
        ...ChartData.value.bar.datasets[0],
        data: data.bar_monthly,
      }],
    }
    
    ChartData.value.line.values = data.line_monthly
    ChartData.value.pie.values = data.pie_monthly
  }
})

// Lifecycle
onBeforeMount(async () => {
  // Initialize quick date selection to "This Month"
  quickDateSelection.value = 0
  applyQuickDate(0)
  
  // Load all data concurrently for better performance
  await Promise.all([
    await getTeamMembers(),
    await getTrainings(),
    await getImbalance(),
    await getMonthly(),
  ])
})
</script>

<style scoped>

.kpi-card {
  transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
}

.kpi-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0,0,0,0.15) !important;
}

.kpi-card-1 {
  border-left: 4px solid #1976d2;
}

.kpi-card-2 {
  border-left: 4px solid #d32f2f;
}

.kpi-card-3 {
  border-left: 4px solid #f57c00;
}

.kpi-card-4 {
  border-left: 4px solid #388e3c;
}

.scrollable-list {
  height: 320px;
  overflow-y: auto;
}

.chart-container {
  min-height: 300px;
}

.detail-item {
  display: flex;
  align-items: center;
  margin-bottom: 16px;
}

.section-title {
  /* color: #1976d2; */
  font-weight: 600;
}

.globalRadius {
  border-radius: 12px !important;
}

.activeTrainer {
  background-color: rgba(25, 118, 210, 0.1);
  border-left: 4px solid #1976d2;
}

/* Custom scrollbar for webkit browsers */
.scrollable-list::-webkit-scrollbar {
  width: 4px;
}

.scrollable-list::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

.scrollable-list::-webkit-scrollbar-thumb {
  background: #4c65e2;
  border-radius: 4px;
}

.scrollable-list::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

/*  table styling */
.v-data-table .v-data-table__tr:hover {
  background-color: rgba(25, 118, 210, 0.04);
}

/* Loading animation for charts */
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.chart-container > * {
  animation: fadeIn 0.5s ease-out;
}

/* Mobile responsiveness improvements */
@media (max-width: 960px) {
  .chart-container {
    min-height: 250px;
  }
  
  .scrollable-list {
    height: 300px;
  }
}
</style>