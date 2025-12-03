<template>
  <div class="profile-setup-container" >
    <!-- Background Elements -->
    <div class=""></div>
    <div class="floating-shapes">
      <div class="shape shape-1"></div>
      <div class="shape shape-2"></div>
      <div class="shape shape-3"></div>
      <div class="shape shape-4"></div>
    </div>

    <!-- Main Card -->
    <div class="profile-card">
      <!-- Header Section -->
      <div class="card-header">
        <div class="icon-container">
          <div class="icon-wrapper">
            <v-icon class="profile-icon">mdi-account-circle</v-icon>
            <div class="icon-pulse"></div>
          </div>
        </div>
      </div>

      <!-- Content Section -->
      <div class="card-content">
        <div class="text-content">
          <h1 class="main-title">
            Complete Your Profile
          </h1>
          <p class="subtitle">
            A complete profile is the first step to a successful training journey. 
            Fill in your details in the Profile Tab to get started.
          </p>
        </div>

        <!-- Action Section -->
        <div class="action-section">
          <v-btn 
            @click="goto"
            class="continue-btn"
            size="large"
            rounded="xl"
            elevation="0"
          >
            <span>Continue</span>
            <v-icon class="btn-icon">mdi-arrow-right</v-icon>
          </v-btn>
        </div>
      </div>

      <!-- Decorative Elements -->
      <div class="card-decoration">
        <div class="decoration-circle"></div>
        <div class="decoration-line"></div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
const emit = defineEmits(['goto', 'skip'])

const goto = () => {
  emit('goto')
}

const skipForNow = () => {
  emit('skip')
}
</script>

<style scoped>
.profile-setup-container {
  position: relative;
  height: 90vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  overflow: hidden;
}

.background-gradient {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, 
    #667eea 0%, 
    #764ba2 50%, 
    #f093fb 100%);
  opacity: 0.1;
}

.floating-shapes {
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
  animation: float 6s ease-in-out infinite;
}

.shape-1 {
  width: 120px;
  height: 120px;
  background: linear-gradient(45deg, #83ee41, #04900d);
  top: 20%;
  left: 10%;
  animation-delay: 1s;
}

.shape-2 {
  width: 80px;
  height: 80px;
  background: linear-gradient(45deg, #4ecdc4, #07a989);
  top: 60%;
  right: 15%;
  animation-delay: 2s;
}

.shape-3 {
  width: 60px;
  height: 60px;
  background: linear-gradient(45deg, #575ffe, #9fafff);
  bottom: 30%;
  left: 20%;
  animation-delay: 1.5s;
}

.shape-4 {
  width: 80px;
  height: 80px;
  background: linear-gradient(45deg, #57a2fe, #0325d0);
  top: 10%;
  right: 20%;
  animation-delay: 2.5s;
}

@keyframes float {
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-20px) rotate(180deg); }
}

.profile-card {
  position: relative;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 24px;
  padding: 0;
  width: 100%;
  max-width: 480px;
  box-shadow: 
    0 20px 25px -5px rgba(0, 0, 0, 0.1),
    0 10px 10px -5px rgba(0, 0, 0, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.2);
  overflow: hidden;
  animation: slideUp 0.6s ease-out;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.card-header {
  padding: 32px 32px 16px;
  text-align: center;
  position: relative;
}

.icon-container {
  margin-bottom: 24px;
}

.icon-wrapper {
  position: relative;
  display: inline-block;
}

.profile-icon {
  font-size: 64px !important;
  color: #667eea;
    background: linear-gradient(135deg, #667eea 0%, #2b38ee);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  filter: drop-shadow(0 4px 8px rgba(102, 126, 234, 0.3));
}

.icon-pulse {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 80px;
  height: 80px;
  border: 2px solid rgba(102, 126, 234, 0.3);
  border-radius: 50%;
  transform: translate(-50%, -50%);
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% {
    transform: translate(-50%, -50%) scale(0.8);
    opacity: 1;
  }
  100% {
    transform: translate(-50%, -50%) scale(1.4);
    opacity: 0;
  }
}

.progress-dots {
  display: flex;
  justify-content: center;
  gap: 8px;
}

.dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #e2e8f0;
  transition: all 0.3s ease;
}

.dot.active {
  background: linear-gradient(135deg, #667eea, #764ba2);
  transform: scale(1.2);
}

.card-content {
  padding: 16px 32px 32px;
}

.text-content {
  text-align: center;
  margin-bottom: 32px;
}

.main-title {
  font-size: 28px;
  font-weight: 700;
  background: linear-gradient(135deg, #2d3748, #4a5568);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 16px;
  line-height: 1.2;
}

.subtitle {
  font-size: 16px;
  color: #64748b;
  line-height: 1.6;
  margin: 0;
}

.action-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

.continue-btn {
  background: linear-gradient(135deg, #667eea 0%, #2b38ee 100%) !important;
  color: white !important;
  font-weight: 600 !important;
  padding: 0 32px !important;
  height: 48px !important;
  box-shadow: 0 8px 25px -8px rgba(102, 126, 234, 0.5) !important;
  transition: all 0.3s ease !important;
  position: relative;
  overflow: hidden;
}

.continue-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: left 0.5s;
}

.continue-btn:hover::before {
  left: 100%;
}

.continue-btn:hover {
  transform: translateY(-2px) !important;
  box-shadow: 0 12px 35px -8px rgba(102, 126, 234, 0.6) !important;
}

.btn-icon {
  margin-left: 8px;
  transition: transform 0.3s ease;
}

.continue-btn:hover .btn-icon {
  transform: translateX(4px);
}

.skip-btn {
  background: none;
  border: none;
  color: #64748b;
  font-size: 14px;
  cursor: pointer;
  padding: 8px 16px;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.skip-btn:hover {
  color: #334155;
  background: rgba(100, 116, 139, 0.1);
}

.card-decoration {
  position: absolute;
  top: 0;
  right: 0;
  width: 100px;
  height: 100px;
  pointer-events: none;
}

.decoration-circle {
  position: absolute;
  top: -30px;
  right: -30px;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.1), rgba(118, 75, 162, 0.1));
}

.decoration-line {
  position: absolute;
  top: 20px;
  right: 20px;
  width: 40px;
  height: 2px;
  background: linear-gradient(90deg, transparent, rgba(102, 126, 234, 0.3));
  border-radius: 1px;
}

/* Responsive Design */
@media (max-width: 640px) {
  .profile-setup-container {
    padding: 16px;
  }
  
  .profile-card {
    max-width: 100%;
    margin: 0;
  }
  
  .card-header,
  .card-content {
    padding-left: 24px;
    padding-right: 24px;
  }
  
  .main-title {
    font-size: 24px;
  }
  
  .subtitle {
    font-size: 15px;
  }
  
  .shape {
    display: none;
  }
}

/* Dark mode support */
/* @media (prefers-color-scheme: dark) {
  .profile-card {
    background: rgba(15, 23, 42, 0.95);
    border: 1px solid rgba(255, 255, 255, 0.1);
  }
  
  .main-title {
    background: linear-gradient(135deg, #f8fafc, #e2e8f0);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
  
  .subtitle {
    color: #94a3b8;
  }
  
  .skip-btn {
    color: #94a3b8;
  }
  
  .skip-btn:hover {
    color: #e2e8f0;
    background: rgba(148, 163, 184, 0.1);
  }
} */
</style>