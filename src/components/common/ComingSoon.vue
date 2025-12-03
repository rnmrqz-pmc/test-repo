<template>
  <div class="coming-soon-container">
    <!-- Animated Background -->
    <div class="background-animation">
      <div class="wave wave-1"></div>
      <div class="wave wave-2"></div>
      <div class="wave wave-3"></div>
    </div>
    
    <!-- Floating Particles -->
    <div class="particles">
      <div v-for="i in 20" :key="i" :class="`particle particle-${i}`"></div>
    </div>

    <!-- Main Content -->
    <div class="content-wrapper">
      <!-- Icon Section -->
      <div class="icon-section">
        <div class="icon-container">
          <v-icon class="main-icon">mdi-rocket-launch</v-icon>
          <div class="icon-glow"></div>
        </div>
      </div>

      <!-- Text Content -->
      <div class="text-content">
        <h1 class="main-title">
          <span class="title-line">Something Amazing</span>
          <span class="title-line">is Coming Soon</span>
        </h1>
        
        <p class="subtitle">
          We're working hard to bring you an incredible new experience. 
          Stay tuned for the big reveal!
        </p>
      </div>



      <!-- Progress Indicator -->
      <!-- <div class="progress-section">
        <div class="progress-text">Development Progress</div>
        <div class="progress-bar">
          <div class="progress-fill" :style="{ width: `${progress}%` }"></div>
        </div>
        <div class="progress-percentage">{{ progress }}% Complete</div>
      </div> -->
    </div>

    <!-- Decorative Elements -->
    <div class="decorative-shapes">
      <div class="shape shape-1"></div>
      <div class="shape shape-2"></div>
      <div class="shape shape-3"></div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  targetDate: {
    type: String,
    default: '2024-12-31T00:00:00'
  },
  showCountdown: {
    type: Boolean,
    default: true
  },
  progress: {
    type: Number,
    default: 75
  }
})

const emit = defineEmits(['subscribe', 'social-click'])

// Reactive state
const email = ref('')
const isSubscribed = ref(false)
const countdown = ref({
  days: 0,
  hours: 0,
  minutes: 0,
  seconds: 0
})

let countdownInterval: number | null = null

// Computed properties
const isValidEmail = computed(() => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email.value)
})

// Methods
const updateCountdown = () => {
  const target = new Date(props.targetDate).getTime()
  const now = new Date().getTime()
  const difference = target - now

  if (difference > 0) {
    countdown.value = {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
      minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
      seconds: Math.floor((difference % (1000 * 60)) / 1000)
    }
  }
}

const subscribe = () => {
  if (isValidEmail.value) {
    emit('subscribe', email.value)
    isSubscribed.value = true
  }
}

const openSocial = (platform: string) => {
  emit('social-click', platform)
}

// Lifecycle hooks
onMounted(() => {
  if (props.showCountdown) {
    updateCountdown()
    countdownInterval = setInterval(updateCountdown, 1000)
  }
})

onUnmounted(() => {
  if (countdownInterval) {
    clearInterval(countdownInterval)
  }
})
</script>

<style scoped>
.coming-soon-container {
  position: relative;
  height: 96vh;
  display: flex;
  align-items: center;
  justify-content: center;
  /* padding: 20px; */
  overflow: hidden;
  overflow-y: hidden !important;
  background: linear-gradient(135deg, #143b97e2 0%, #1e293b 50%, #334155 100%);
}

.background-animation {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow: hidden;
}

.wave {
  position: absolute;
  width: 200%;
  height: 200%;
  background: linear-gradient(45deg, 
    rgba(59, 130, 246, 0.1), 
    rgba(147, 51, 234, 0.1),
    transparent);
  border-radius: 50%;
  animation: rotate 20s linear infinite;
}

.wave-1 {
  top: -50%;
  left: -50%;
  animation-duration: 20s;
}

.wave-2 {
  top: -50%;
  right: -50%;
  animation-duration: 25s;
  animation-direction: reverse;
}

.wave-3 {
  bottom: -50%;
  left: -50%;
  animation-duration: 30s;
}

@keyframes rotate {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.particles {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
}

.particle {
  position: absolute;
  width: 4px;
  height: 4px;
  background: rgba(59, 130, 246, 0.6);
  border-radius: 50%;
  animation: float 3s ease-in-out infinite;
}

.particle:nth-child(odd) {
  background: rgba(147, 51, 234, 0.6);
  animation-duration: 4s;
}

.particle:nth-child(3n) {
  background: rgba(236, 72, 153, 0.6);
  animation-duration: 5s;
}

@keyframes float {
  0%, 100% { 
    transform: translateY(0px) translateX(0px); 
    opacity: 0.3; 
  }
  50% { 
    transform: translateY(-20px) translateX(10px); 
    opacity: 1; 
  }
}

/* Generate random positions for particles */
.particle-1 { top: 20%; left: 10%; animation-delay: 0s; }
.particle-2 { top: 40%; left: 20%; animation-delay: 0.5s; }
.particle-3 { top: 60%; left: 15%; animation-delay: 1s; }
.particle-4 { top: 30%; left: 80%; animation-delay: 1.5s; }
.particle-5 { top: 70%; left: 85%; animation-delay: 2s; }
.particle-6 { top: 10%; left: 60%; animation-delay: 2.5s; }
.particle-7 { top: 80%; left: 40%; animation-delay: 3s; }
.particle-8 { top: 25%; left: 45%; animation-delay: 0.3s; }
.particle-9 { top: 55%; left: 70%; animation-delay: 0.8s; }
.particle-10 { top: 15%; left: 30%; animation-delay: 1.3s; }
.particle-11 { top: 65%; left: 25%; animation-delay: 1.8s; }
.particle-12 { top: 35%; left: 90%; animation-delay: 2.3s; }
.particle-13 { top: 75%; left: 60%; animation-delay: 2.8s; }
.particle-14 { top: 45%; left: 5%; animation-delay: 0.2s; }
.particle-15 { top: 85%; left: 75%; animation-delay: 0.7s; }
.particle-16 { top: 5%; left: 50%; animation-delay: 1.2s; }
.particle-17 { top: 50%; left: 95%; animation-delay: 1.7s; }
.particle-18 { top: 90%; left: 20%; animation-delay: 2.2s; }
.particle-19 { top: 25%; left: 65%; animation-delay: 2.7s; }
.particle-20 { top: 65%; left: 50%; animation-delay: 3.2s; }

.content-wrapper {
  position: relative;
  z-index: 10;
  text-align: center;
  max-width: 600px;
  width: 100%;
  animation: fadeInUp 1s ease-out;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.icon-section {
  margin-bottom: 32px;
}

.icon-container {
  position: relative;
  display: inline-block;
}

.main-icon {
  font-size: 80px !important;
  background: linear-gradient(135deg, #3b82f6, #9333ea, #ec4899);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: bounce 2s ease-in-out infinite;
}

.icon-glow {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 120px;
  height: 120px;
  background: radial-gradient(circle, rgba(59, 130, 246, 0.3) 0%, transparent 70%);
  border-radius: 50%;
  transform: translate(-50%, -50%);
  animation: pulse 3s ease-in-out infinite;
}

@keyframes bounce {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
}

@keyframes pulse {
  0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 0.7; }
  50% { transform: translate(-50%, -50%) scale(1.2); opacity: 0.3; }
}

.text-content {
  margin-bottom: 48px;
}

.main-title {
  font-size: 48px;
  font-weight: 800;
  margin-bottom: 24px;
  line-height: 1.1;
}

.title-line {
  display: block;
  background: linear-gradient(135deg, #ffffff, #e2e8f0);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: slideIn 0.8s ease-out forwards;
  opacity: 0;
}

.title-line:first-child {
  animation-delay: 0.2s;
}

.title-line:last-child {
  animation-delay: 0.4s;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateX(-30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.subtitle {
  font-size: 18px;
  color: #94a3b8;
  line-height: 1.6;
  margin: 0;
}

.countdown-section {
  margin-bottom: 48px;
  padding: 32px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
}

.countdown-title {
  font-size: 16px;
  color: #94a3b8;
  margin-bottom: 20px;
}

.countdown-grid {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 16px;
}

.countdown-item {
  text-align: center;
}

.countdown-number {
  font-size: 32px;
  font-weight: 700;
  color: #ffffff;
  background: linear-gradient(135deg, #3b82f6, #9333ea);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.countdown-label {
  font-size: 12px;
  color: #64748b;
  text-transform: uppercase;
  margin-top: 4px;
}

.countdown-separator {
  font-size: 24px;
  color: #64748b;
  font-weight: bold;
}

.action-section {
  margin-bottom: 48px;
}

.notify-form {
  display: flex;
  gap: 12px;
  margin-bottom: 32px;
  max-width: 400px;
  margin-left: auto;
  margin-right: auto;
}

.email-input {
  flex: 1;
  padding: 16px 20px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  color: #ffffff;
  font-size: 16px;
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
}

.email-input::placeholder {
  color: #94a3b8;
}

.email-input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.notify-btn {
  padding: 16px 24px;
  background: linear-gradient(135deg, #3b82f6, #9333ea);
  color: white;
  border: none;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;
}

.notify-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(59, 130, 246, 0.4);
}

.notify-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.success-message {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 16px;
  background: rgba(34, 197, 94, 0.1);
  border: 1px solid rgba(34, 197, 94, 0.3);
  border-radius: 12px;
  color: #4ade80;
  margin-bottom: 32px;
}

.success-icon {
  font-size: 20px;
}

.social-section {
  text-align: center;
}

.social-text {
  color: #94a3b8;
  margin-bottom: 16px;
}

.social-links {
  display: flex;
  justify-content: center;
  gap: 16px;
}

.social-btn {
  width: 48px;
  height: 48px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  color: #94a3b8;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.social-btn:hover {
  background: rgba(255, 255, 255, 0.2);
  color: #ffffff;
  transform: translateY(-2px);
}

.progress-section {
  background: rgba(255, 255, 255, 0.05);
  padding: 24px;
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.progress-text {
  color: #94a3b8;
  margin-bottom: 12px;
  font-size: 14px;
}

.progress-bar {
  width: 100%;
  height: 8px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 8px;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #3b82f6, #9333ea, #ec4899);
  border-radius: 4px;
  transition: width 0.3s ease;
  animation: shimmer 2s infinite;
}

@keyframes shimmer {
  0% { background-position: -200px 0; }
  100% { background-position: 200px 0; }
}

.progress-percentage {
  color: #ffffff;
  font-weight: 600;
  text-align: right;
}

.decorative-shapes {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
}

.shape {
  position: absolute;
  border-radius: 50%;
  opacity: 0.1;
}

.shape-1 {
  width: 200px;
  height: 200px;
  background: linear-gradient(45deg, #3b82f6, #9333ea);
  top: 10%;
  right: 5%;
  animation: float 8s ease-in-out infinite;
}

.shape-2 {
  width: 120px;
  height: 120px;
  background: linear-gradient(45deg, #ec4899, #f59e0b);
  bottom: 20%;
  left: 10%;
  animation: float 6s ease-in-out infinite reverse;
}

.shape-3 {
  width: 80px;
  height: 80px;
  background: linear-gradient(45deg, #10b981, #3b82f6);
  top: 60%;
  right: 20%;
  animation: float 10s ease-in-out infinite;
}

/* Responsive Design */
@media (max-width: 768px) {
  .coming-soon-container {
    padding: 16px;
  }
  
  .main-title {
    font-size: 36px;
  }
  
  .main-icon {
    font-size: 60px !important;
  }
  
  .notify-form {
    flex-direction: column;
  }
  
  .countdown-grid {
    gap: 12px;
  }
  
  .countdown-number {
    font-size: 24px;
  }
  
  .countdown-section {
    padding: 20px;
  }
  
  .decorative-shapes {
    display: none;
  }
}

@media (max-width: 480px) {
  .main-title {
    font-size: 28px;
  }
  
  .subtitle {
    font-size: 16px;
  }
  
  .countdown-grid {
    flex-wrap: wrap;
    gap: 8px;
  }
  
  .countdown-item {
    min-width: 60px;
  }
  
  .particles {
    display: none;
  }
}
</style>