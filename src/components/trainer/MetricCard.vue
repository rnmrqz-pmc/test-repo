<!-- MetricCard.vue -->
<template>
  <v-card
    class="info-card  card-hover-y pa-4 mx-2 globalRadius"
    rounded="lg"
    elevation="3"
    :class="{ 'metric-card--clickable': clickable }"
    tabindex="0"
    role="button"
    :aria-label="`${title}: ${displayValue}`"
  >
    <!-- Loading State -->
    <div v-if="loading" class="d-flex flex-column align-center">
      <v-skeleton-loader type="text" class="mb-2" />
      <v-skeleton-loader type="text" width="60%" class="mb-2" />
      <v-skeleton-loader type="text" width="40%" />
    </div>

    <!-- Content -->
    <div v-else class="metric-content">
      <!-- Header with Icon -->
      <div class="d-flex align-center justify-center mb-3">
        <v-icon :icon="icon" class="mr-2" size="small" color="grey-darken-1" />
        <h3 class="text-center text-header">{{ title }}</h3>
      </div>

      <!-- Value Display -->
      <div class="value-container text-center mb-2">
        <p class="text-detail mb-0">
          <span class="text-highlight" :class="colorClass">
            {{ displayValue }}
          </span>
          <span v-if="unit" class="unit-text ml-1">{{ unit }}</span>
        </p>

        <!-- Star Rating for rating metric -->
        <v-rating
          v-if="showRating"
          :model-value="Number(value)"
          class="d-flex justify-center mt-1"
          style="transform: scale(1.1);"
          density="compact"
          color="amber-darken-2"
          half-increments
          readonly
        />
      </div>

      <!-- Subtitle -->
      <p v-if="subtitle" class="text-center text-caption mb-0">{{ subtitle }}</p>

      <!-- Trend Indicator -->
      <div v-if="trend" class="trend-indicator text-center mt-2">
        <v-chip
          :color="trend.direction === 'up' ? 'success' : trend.direction === 'down' ? 'error' : 'info'"
          size="small"
          variant="tonal"
        >
          <v-icon
            :icon="getTrendIcon(trend.direction)"
            size="x-small"
            class="mr-1"
          />
          {{ trend.percentage }}%
        </v-chip>
      </div>
    </div>
  </v-card>
</template>

<script lang="ts" setup>
import { computed } from 'vue'

interface Trend {
  direction: 'up' | 'down' | 'stable'
  percentage: number
}

interface Props {
  title: string
  value: number | string
  unit?: string
  subtitle?: string
  colorClass?: string
  icon?: string
  showRating?: boolean
  loading?: boolean
  clickable?: boolean
  trend?: Trend
}

const props = withDefaults(defineProps<Props>(), {
  unit: '',
  subtitle: '',
  colorClass: '',
  icon: 'mdi-chart-line',
  showRating: false,
  loading: false,
  clickable: true,
  trend: undefined
})

const emit = defineEmits<{
  click: []
}>()

const displayValue = computed(() => {
  if (typeof props.value === 'number') {
    if (props.showRating) {
      return props.value.toFixed(1)
    }
    // Format large numbers
    if (props.value >= 1000) {
      return (props.value / 1000).toFixed(1) + 'K'
    }
    return props.value.toString()
  }
  return props.value
})

const getTrendIcon = (direction: string) => {
  switch (direction) {
    case 'up': return 'mdi-trending-up'
    case 'down': return 'mdi-trending-down'
    default: return 'mdi-trending-neutral'
  }
}

const onClick = () => {
  if (props.clickable) {
    emit('click')
  }
}
</script>

<style scoped>
.metric-card {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  min-height: 140px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

/* .metric-card--clickable {
  cursor: pointer;
} */

/* .metric-card--clickable:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15) !important;
} */

/* .metric-card:focus-visible {
  outline: 2px solid #2196F3;
  outline-offset: 2px;
} */

.text-header {
  font-size: 16px !important;
  font-weight: 600;
  color: rgba(0, 0, 0, 0.87);
}

.text-highlight {
  font-size: 32px !important;
  font-weight: 800;
  line-height: 1.2;
}

.text-detail {
  font-size: 18px !important;
}

.text-caption {
  font-size: 14px !important;
  color: rgba(0, 0, 0, 0.6);
}

.unit-text {
  font-size: 18px !important;
  font-weight: normal;
  color: rgba(0, 0, 0, 0.6);
}

.value-container {
  min-height: 50px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.trend-indicator {
  margin-top: 8px;
}

/* Responsive adjustments */
@media (max-width: 600px) {
  .text-header {
    font-size: 14px !important;
  }
  
  .text-highlight {
    font-size: 24px !important;
  }
  
  .metric-card {
    min-height: 120px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .metric-card {
    transition: none !important;
  }
}
</style>