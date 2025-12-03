<template>
  <v-dialog 
    v-model="localModel" 
    :max-width="maxWidth" 
    :persistent="persistent"
    transition="dialog-transition"
    class="modern-confirm-dialog"
  >
    <v-card 
      :class="cardClasses"
      :elevation="elevation"
    >
      <!-- Header Section -->
      <v-card-title class="text-center pa-6 pb-4">
        <div class="d-flex flex-column align-center">
          <!-- Enhanced Icon with Animation -->
          <div 
            v-if="showIcon"
            :class="iconContainerClasses"
            class="mb-4"
          >
            <v-icon
              :color="iconColor"
              :size="iconSize"
              class="dialog-icon"
            >
              {{ icon }}
            </v-icon>
          </div>
          
          <!-- Title with Better Typography -->
          <h2 :class="titleClasses">
            {{ title }}
          </h2>
        </div>
      </v-card-title>

      <!-- Message Content Section -->
      <v-card-text class="text-center pa-6 pt-2">
        <!-- Main Message -->
        <p :class="messageClasses" class="text-black">
          {{ message }}
        </p>
        
        <!-- Subtitle -->
        <p 
          v-if="subtitle" 
          :class="subtitleClasses"
        >
          {{ subtitle }}
        </p>
        <slot name="custom-field"></slot>
        <!-- Loading State -->
        <div v-if="loading" class="mt-4">
          <v-progress-circular
            indeterminate
            :color="confirmColor"
            size="24"
          />
          <p class="text-caption mt-2 text-medium-emphasis">
            {{ loadingText }}
          </p>
        </div>
      </v-card-text>

      <!-- Action Buttons Section -->
      <v-card-actions class="d-flex justify-center pa-6 pt-2">
        <div :class="buttonContainerClasses">
          <!-- Cancel Button -->
          <v-btn
            v-if="!hideCancelButton"
            @click="handleCancel"
            :variant="cancelVariant"
            :color="cancelColor"
            :size="buttonSize"
            :width="buttonWidth"
            :disabled="loading"
            rounded="pill"
            :class="cancelButtonClasses"
            class="me-3"
          >
            <v-icon v-if="cancelIcon" start :size="16">
              {{ cancelIcon }}
            </v-icon>
            {{ cancelText }}
          </v-btn>

          <!-- Confirm Button -->
          <v-btn
            @click="handleConfirm"
            :variant="confirmVariant"
            :color="confirmColor"
            :size="buttonSize"
            :width="buttonWidth"
            :loading="loading"
            :disabled="disabled"
            rounded="pill"
            :class="confirmButtonClasses"
          >
            <v-icon v-if="confirmIcon" start :size="16">
              {{ confirmIcon }}
            </v-icon>
            {{ confirmText }}
          </v-btn>
        </div>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { computed, nextTick, watch } from 'vue'

interface Props {
  modelValue: boolean
  title?: string
  message: string
  subtitle?: string
  confirmText?: string
  cancelText?: string
  confirmColor?: string
  cancelColor?: string
  confirmVariant?: any
  cancelVariant?: any
  confirmIcon?: string
  cancelIcon?: string
  type?: 'default' | 'warning' | 'error' | 'success' | 'info' | 'danger'
  buttonWidth?: string | number
  buttonSize?: string
  maxWidth?: string | number
  persistent?: boolean
  loading?: boolean
  loadingText?: string
  disabled?: boolean
  hideCancelButton?: boolean
  elevation?: number
  dense?: boolean
  rounded?: boolean | string
}

interface Emits {
  (e: 'update:modelValue', value: boolean): void
  (e: 'confirm'): void
  (e: 'cancel'): void
  (e: 'open'): void
  (e: 'close'): void
}

const props = withDefaults(defineProps<Props>(), {
  title: 'Confirm Action',
  confirmText: 'Confirm',
  cancelText: 'Cancel',
  confirmColor: 'primary',
  cancelColor: 'grey-darken-1',
  confirmVariant: 'elevated',
  cancelVariant: 'outlined',
  type: 'default',
  buttonWidth: '120',
  buttonSize: 'default',
  maxWidth: '480',
  persistent: true,
  loading: false,
  loadingText: 'Processing...',
  disabled: false,
  hideCancelButton: false,
  elevation: 8,
  dense: false,
  rounded: 'lg'
})

const emit = defineEmits<Emits>()

// Local model for v-model
const localModel = computed({
  get: () => props.modelValue,
  set: (value) => {
    emit('update:modelValue', value)
    if (value) {
      emit('open')
    } else {
      emit('close')
    }
  }
})

// Enhanced icon mapping with more types
const icon = computed(() => {
  const iconMap = {
    warning: 'mdi-alert',
    error: 'mdi-alert-circle',
    danger: 'mdi-alert-octagon',
    success: 'mdi-check-circle',
    info: 'mdi-information',
    default: 'mdi-help-circle'
  }
  return iconMap[props.type] || iconMap.default
})

// Enhanced color mapping
const iconColor = computed(() => {
  const colorMap = {
    warning: 'warning',
    error: 'error',
    danger: 'error',
    success: 'success',
    info: 'info',
    default: props.confirmColor
  }
  return colorMap[props.type] || colorMap.default
})

// Dynamic sizing based on type and density
const iconSize = computed(() => {
  if (props.dense) return 36
  return props.type === 'error' || props.type === 'danger' ? 52 : 48
})

const showIcon = computed(() => {
  return props.type !== 'default' || props.type
})

// Enhanced CSS classes
const cardClasses = computed(() => [
  'modern-confirm-card',
  {
    'modern-confirm-card--dense': props.dense,
    'modern-confirm-card--rounded': props.rounded,
    [`modern-confirm-card--${props.type}`]: props.type !== 'default'
  }
])

const iconContainerClasses = computed(() => [
  'dialog-icon-container',
  `dialog-icon-container--${props.type}`
])

const titleClasses = computed(() => [
  'dialog-title',
  {
    'text-h5': !props.dense,
    'text-h6': props.dense
  }
])

const messageClasses = computed(() => [
  'dialog-message',
  {
    'text-body-1': !props.dense,
    'text-body-2': props.dense
  }
])

const subtitleClasses = computed(() => [
  'dialog-subtitle',
  'text-medium-emphasis',
  'mt-3',
  {
    'text-body-2': !props.dense,
    'text-caption': props.dense
  }
])

const buttonContainerClasses = computed(() => [
  'd-flex',
  'flex-column flex-sm-row',
  'align-center',
  'ga-3'
])

const confirmButtonClasses = computed(() => [
  'confirm-btn',
  {
    'confirm-btn--loading': props.loading
  }
])

const cancelButtonClasses = computed(() => [
  'cancel-btn'
])

// Enhanced event handlers with better UX
async function handleConfirm(): Promise<void> {
  if (props.loading || props.disabled) return
  
  emit('confirm')
  
  // Small delay for better UX if not loading
  if (!props.loading) {
    await nextTick()
    setTimeout(() => {
      localModel.value = false
    }, 100)
  }
}

function handleCancel(): void {
  if (props.loading) return
  
  emit('cancel')
  localModel.value = false
}

// Watch for escape key
watch(() => props.modelValue, (newVal) => {
  if (newVal && !props.persistent) {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleCancel()
        document.removeEventListener('keydown', handleEscape)
      }
    }
    document.addEventListener('keydown', handleEscape)
  }
})
</script>

<style scoped>
.modern-confirm-dialog {
  z-index: 9999;
}

.modern-confirm-card {
  border-radius: 16px !important;
  backdrop-filter: blur(10px);
  background: rgba(var(--v-theme-surface), 0.95) !important;
  border: 1px solid rgba(var(--v-theme-outline), 0.12);
  overflow: hidden;
  position: relative;
}

.modern-confirm-card--dense {
  border-radius: 12px !important;
}

.modern-confirm-card--rounded {
  border-radius: 20px !important;
}

/* Type-specific card styling */
.modern-confirm-card--error,
.modern-confirm-card--danger {
  border-top: 4px solid rgb(var(--v-theme-error));
}

.modern-confirm-card--warning {
  border-top: 4px solid rgb(var(--v-theme-warning));
}

.modern-confirm-card--success {
  border-top: 4px solid rgb(var(--v-theme-success));
}

.modern-confirm-card--info {
  border-top: 4px solid rgb(var(--v-theme-info));
}

/* Icon container with enhanced animations */
.dialog-icon-container {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 72px;
  height: 72px;
  border-radius: 50%;
  animation: iconFadeIn 0.4s ease-out;
}

.dialog-icon-container--error,
.dialog-icon-container--danger {
  background: rgba(var(--v-theme-error), 0.1);
  animation: iconPulse 0.6s ease-out, iconFadeIn 0.4s ease-out;
}

.dialog-icon-container--warning {
  background: rgba(var(--v-theme-warning), 0.1);
  animation: iconShake 0.5s ease-out, iconFadeIn 0.4s ease-out;
}

.dialog-icon-container--success {
  background: rgba(var(--v-theme-success), 0.1);
  animation: iconBounce 0.6s ease-out, iconFadeIn 0.4s ease-out;
}

.dialog-icon-container--info,
.dialog-icon-container--default {
  background: rgba(var(--v-theme-primary), 0.1);
  animation: iconFadeIn 0.4s ease-out;
}

.dialog-icon {
  animation: iconScale 0.3s ease-out 0.2s both;
}

/* Enhanced typography */
.dialog-title {
  font-weight: 600;
  line-height: 1.3;
  color: rgb(var(--v-theme-on-surface));
  animation: textSlideUp 0.4s ease-out 0.1s both;
}

.dialog-message {
  line-height: 1.5;
  color: rgb(var(--v-theme-on-surface-variant));
  animation: textSlideUp 0.4s ease-out 0.2s both;
}

.dialog-subtitle {
  line-height: 1.4;
  animation: textSlideUp 0.4s ease-out 0.3s both;
}

/* Enhanced button styling */
.confirm-btn,
.cancel-btn {
  font-weight: 500;
  letter-spacing: 0.0178571429em;
  text-transform: none;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  animation: buttonSlideUp 0.4s ease-out 0.4s both;
}

.confirm-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.12);
}

.cancel-btn:hover {
  transform: translateY(-1px);
}

.confirm-btn--loading {
  pointer-events: none;
}

/* Animations */
@keyframes iconFadeIn {
  from {
    opacity: 0;
    transform: scale(0.8);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes iconScale {
  from {
    transform: scale(0.5);
  }
  to {
    transform: scale(1);
  }
}

@keyframes iconPulse {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
}

@keyframes iconShake {
  0%, 100% {
    transform: translateX(0);
  }
  25% {
    transform: translateX(-2px);
  }
  75% {
    transform: translateX(2px);
  }
}

@keyframes iconBounce {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-4px);
  }
}

@keyframes textSlideUp {
  from {
    opacity: 0;
    transform: translateY(8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes buttonSlideUp {
  from {
    opacity: 0;
    transform: translateY(12px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Responsive design */
@media (max-width: 600px) {
  .modern-confirm-card {
    margin: 16px;
    border-radius: 12px !important;
  }
  
  .dialog-icon-container {
    width: 60px;
    height: 60px;
  }
  
  .dialog-title {
    font-size: 1.125rem !important;
  }
}

/* Dark mode enhancements */
.v-theme--dark .modern-confirm-card {
  background: rgba(var(--v-theme-surface), 0.98) !important;
  border-color: rgba(var(--v-theme-outline), 0.2);
}

/* Focus and accessibility */
.confirm-btn:focus-visible,
.cancel-btn:focus-visible {
  outline: 2px solid rgb(var(--v-theme-primary));
  outline-offset: 2px;
}

/* Loading state */
.confirm-btn--loading {
  opacity: 0.7;
}

/* High contrast mode support */
@media (prefers-contrast: high) {
  .modern-confirm-card {
    border-width: 2px;
  }
  
  .dialog-icon-container {
    border: 2px solid currentColor;
  }
}

/* Reduced motion support */
@media (prefers-reduced-motion: reduce) {
  .dialog-icon-container,
  .dialog-icon,
  .dialog-title,
  .dialog-message,
  .dialog-subtitle,
  .confirm-btn,
  .cancel-btn {
    animation: none;
  }
  
  .confirm-btn:hover,
  .cancel-btn:hover {
    transform: none;
  }
}
</style>