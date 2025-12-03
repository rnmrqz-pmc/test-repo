<!-- EmptyState.vue -->
<template>
  <v-card 
    class="empty-state-card pa-6 globalRadius mx-2 mb-3 d-flex flex-column justify-center align-center" 
    variant="elevated" 
    :height="height"
    elevation="2"
  >
    <!-- Icon -->
    <div class="empty-state-icon mb-4">
      <v-avatar
        :size="iconSize"
        :color="iconColor"
        class="elevation-2"
      >
        <v-icon 
          :icon="icon" 
          :size="iconSize === 80 ? 'x-large' : 'large'"
          color="white"
        />
      </v-avatar>
    </div>

    <!-- Content -->
    <div class="empty-state-content text-center">
      <h3 class="empty-state-title mb-2">{{ title }}</h3>
      <p v-if="subtitle" class="empty-state-subtitle mb-4">{{ subtitle }}</p>
      
      <!-- Action Button -->
      <v-btn
        v-if="showAction && actionText"
        :color="actionColor"
        :variant="actionVariant"
        rounded="pill"
        class="empty-state-action"
        @click="onAction"
      >
        <v-icon v-if="actionIcon" :icon="actionIcon" size="small" class="mr-2" />
        {{ actionText }}
      </v-btn>

      <!-- Custom Slot for additional content -->
      <div v-if="$slots.default" class="empty-state-custom mt-4">
        <slot />
      </div>
    </div>
  </v-card>
</template>

<script lang="ts" setup>
interface Props {
  icon?: string
  title: string
  subtitle?: string
  showAction?: boolean
  actionText?: string
  actionIcon?: string
  actionColor?: string
  actionVariant?: 'elevated' | 'flat' | 'tonal' | 'outlined' | 'text' | 'plain'
  height?: string | number
  iconSize?: number
  iconColor?: string
}

const props = withDefaults(defineProps<Props>(), {
  icon: 'mdi-inbox',
  subtitle: '',
  showAction: false,
  actionText: '',
  actionIcon: '',
  actionColor: 'primary',
  actionVariant: 'elevated',
  height: '250',
  iconSize: 80,
  iconColor: 'grey-lighten-1'
})

const emit = defineEmits<{
  action: []
}>()

const onAction = () => {
  emit('action')
}
</script>

<style scoped>
.empty-state-card {
  background: linear-gradient(135deg, rgba(0, 0, 0, 0.02) 0%, transparent 100%);
  border: 2px dashed rgba(0, 0, 0, 0.12);
}

.empty-state-icon {
  position: relative;
}

.empty-state-icon::before {
  content: '';
  position: absolute;
  top: -10px;
  left: -10px;
  right: -10px;
  bottom: -10px;
  background: radial-gradient(circle, rgba(0, 0, 0, 0.05) 0%, transparent 70%);
  border-radius: 50%;
  z-index: -1;
}

.empty-state-title {
  font-size: 20px !important;
  font-weight: 600;
  color: rgba(0, 0, 0, 0.8);
}

.empty-state-subtitle {
  font-size: 14px !important;
  color: rgba(0, 0, 0, 0.6);
  line-height: 1.4;
  max-width: 400px;
}

.empty-state-action {
  font-weight: 600;
  text-transform: none;
}

.empty-state-custom {
  max-width: 400px;
}

/* Responsive Design */
@media (max-width: 600px) {
  .empty-state-title {
    font-size: 18px !important;
  }
  
  .empty-state-subtitle {
    font-size: 13px !important;
  }
}

/* Animation for better UX */
.empty-state-card {
  animation: fadeInUp 0.6s ease-out;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (prefers-reduced-motion: reduce) {
  .empty-state-card {
    animation: none;
  }
}
</style>