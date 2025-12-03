<template>
  <div>
    <v-dialog 
      v-model="alert.show" 
      max-width="500" 
      :persistent="(alert as any).persistent || false"
      transition="dialog-bottom-transition"
    >
      <v-card class="rounded-xl overflow-hidden" elevation="8">
        <!-- Enhanced header with gradient and better positioning -->
        <v-card-title class="pa-0 ma-0 position-relative d-flex">
          <div class="header-background" :style="headerStyle">
            <!-- Animated gradient overlay -->
            <div class="gradient-overlay"></div>
            
            <!-- Decorative elements -->
            <div class="decoration-circle decoration-1"></div>
            <div class="decoration-circle decoration-2"></div>
          </div>

          <!-- Enhanced circle icon with pulse animation -->
          <div
            :class="`alert-icon d-flex align-center justify-center ${colorClass}`"
            :style="iconStyle"
          >
            <v-icon 
              color="white" 
              size="36"
              class="icon-bounce"
            >
              {{ icon }}
            </v-icon>
          </div>

          <!-- Close button (if not persistent) -->
          <!-- <v-btn
            v-if="!(alert as any).persistent && (alert as any).showCloseIcon !== false"
            icon
            size="small"
            variant="text"
            class="close-btn"
            @click="closeAlert"
          >
            <v-icon size="20" color="white">mdi-close</v-icon>
          </v-btn> -->
        </v-card-title>

        <!-- Enhanced content area -->
        <v-card-text class="text-center px-6 py-4">
          <h2 class="text-h5 font-weight-bold mb-3 mt-2 alert-title">
            {{ title }}
          </h2>
          <p class="text-body-1 text-medium-emphasis mx-2 alert-message">
            {{ alert.message }}
          </p>
          
          <!-- Progress bar for auto-close -->
          <v-progress-linear
            v-if="(alert as any).autoClose && (alert as any).autoClose > 0"
            v-model="progressValue"
            :color="progressColor"
            class="mt-4 rounded"
            height="4"
          />
        </v-card-text>

        <!-- Enhanced action buttons -->
        <v-card-actions class="justify-center pb-4 px-6">
          <!-- Custom action buttons -->
          <template v-if="(alert as any).actions && (alert as any).actions.length > 0">
            <v-btn
              v-for="(action, index) in (alert as any).actions"
              :key="index"
              @click="handleAction(action)"
              :color="action.color || 'primary'"
              :variant="action.variant || 'outlined'"
              class="rounded-pill px-6 mx-1"
              :loading="action.loading"
            >
              <v-icon v-if="action.icon" start>{{ action.icon }}</v-icon>
              {{ action.label }}
            </v-btn>
          </template>
          
          <!-- Default close button -->
          <v-btn
            v-else-if="alert.close !== false"
            @click="closeAlert"
            :color="'black'"
            class="rounded-pill px-8 close-button"
            variant="outlined"
          >
            <!-- <v-icon start>mdi-check</v-icon> -->
            {{ (alert as any).closeText || 'Close' }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue';
import { useAlertStore } from '@/stores/alert';

const alert = useAlertStore();

// Auto-close functionality
const progressValue = ref(0);
const autoCloseInterval = ref<any | null>(null);

const title = computed(() => {
  return alert.title || {
    success: 'Success!',
    info: 'Information',
    warning: 'Warning!',
    error: 'Error!',
  }[alert.type];
});

const headerStyle = computed(() => ({
  height: '80px',
  background: `linear-gradient(135deg, ${colors.value.primary}, ${colors.value.secondary})`,
  position: 'relative',
}));

const colors = computed(() => {
  const colorMap = {
    success: { 
      primary: '#4caf50', 
      secondary: '#81c784',
      light: '#e8f5e8',
      progress: 'success'
    },
    info: { 
      primary: '#2196f3', 
      secondary: '#64b5f6',
      light: '#e3f2fd',
      progress: 'info'
    },
    warning: { 
      primary: '#ff9800', 
      secondary: '#ffb74d',
      light: '#fff3e0',
      progress: 'warning'
    },
    error: { 
      primary: '#f44336', 
      secondary: '#e57373',
      light: '#ffebee',
      progress: 'error'
    },
  };
  return colorMap[alert.type] || colorMap.info;
});

const colorClass = computed(() => {
  return {
    success: 'bg-green',
    info: 'bg-blue',
    warning: 'bg-orange',
    error: 'bg-red',
  }[alert.type];
});

const buttonColor = computed(() => colors.value.primary);
const progressColor = computed(() => colors.value.progress);

const iconStyle = computed(() => ({
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -20%)',
  borderRadius: '50%',
  backgroundColor: colors.value.primary,
  width: '70px',
  height: '70px',
  boxShadow: `0 4px 12px rgba(0,0,0,0.15), 0 0 20px ${colors.value.primary}40`,
  border: '4px solid white',
  zIndex: 2,
}));

const icon = computed(() => {
  return {
    success: 'mdi-check-circle',
    info: 'mdi-information',
    warning: 'mdi-alert',
    error: 'mdi-alert-circle',
  }[alert.type];
});

const closeAlert = () => {
  clearAutoCloseTimer();
  alert.show = false;
  if ((alert as any).onClose) {
    (alert as any).onClose();
  }
};

const handleAction = (action: any) => {
  if (action.handler) {
    action.handler();
  }
  if (action.closeOnClick !== false) {
    closeAlert();
  }
};

const startAutoClose = () => {
  if ((alert as any).autoClose && (alert as any).autoClose > 0) {
    const duration = 3000; // Convert to milliseconds
    const interval = 50; // Update every 50ms for smooth animation
    let elapsed = 0;

    autoCloseInterval.value = setInterval(() => {
      elapsed += interval;
      progressValue.value = (elapsed / duration) * 100;
      
      if (elapsed >= duration) {
        closeAlert();
      }
    }, interval);
  }
};

const clearAutoCloseTimer = () => {
  if (autoCloseInterval.value) {
    clearInterval(autoCloseInterval.value);
    autoCloseInterval.value = null;
    progressValue.value = 0;
  }
};

// Watch for dialog visibility changes
watch(() => alert.show, (newValue) => {
  if (newValue) {
    startAutoClose();
  } else {
    clearAutoCloseTimer();
  }
});

onUnmounted(() => {
  clearAutoCloseTimer();
});
</script>

<style scoped>
.header-background {
  width: 100%;
  overflow: hidden;
  position: relative;
}

.gradient-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(45deg, transparent, rgba(255,255,255,0.1));
  animation: shimmer 3s infinite;
}

.decoration-circle {
  position: absolute;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  animation: float 4s ease-in-out infinite;
}

.decoration-1 {
  width: 30px;
  height: 30px;
  top: 15px;
  right: 30px;
  animation-delay: 0s;
}

.decoration-2 {
  width: 20px;
  height: 20px;
  top: 45px;
  right: 60px;
  animation-delay: 2s;
}

.alert-icon {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.icon-bounce {
  animation: iconBounce 0.6s ease-out;
}

.close-btn {
  position: absolute;
  top: 8px;
  right: 8px;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
}

.alert-title {
  /* animation: slideInUp 0.5s ease-out 0.2s both; */
}

.alert-message {
  /* animation: slideInUp 0.5s ease-out 0.3s both; */
  line-height: 1.6;
}

.close-button {
  /* animation: slideInUp 0.5s ease-out 0.4s both; */
  transition: all 0.3s ease;
}

.close-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
}

/* Animations */
@keyframes shimmer {
  0%, 100% { transform: translateX(-100%); }
  50% { transform: translateX(100%); }
}

@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
}

@keyframes iconBounce {
  0% { transform: scale(0.3); }
  50% { transform: scale(1.1); }
  70% { transform: scale(0.9); }
  100% { transform: scale(1); }
}

@keyframes slideInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Responsive adjustments */
@media (max-width: 600px) {
  .alert-icon {
    width: 60px !important;
    height: 60px !important;
  }
  
  .header-background {
    height: 70px !important;
  }
  
  .alert-title {
    font-size: 1.3rem !important;
  }
}

/* Dark theme support */
.v-theme--dark .close-btn {
  background: rgba(0, 0, 0, 0.2);
}

.v-theme--dark .alert-icon {
  border-color: #424242;
}
</style>