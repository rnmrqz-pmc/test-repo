<template>
  <div class="v-center">
    <v-row class="d-flex justify-center pa-0 ma-0">
      <v-col cols="12" lg="4" md="6" sm="8" xs="10">
        <v-card class="pa-4 px-6 --bg-main text-white globalRadius">
          <!-- Header -->
          <div class="text-center mb-4">
            <v-icon size="48" class="mb-2">mdi-lock-reset</v-icon>
            <h2 class="mb-1">Reset Password</h2>
            <p class="text-body-2 text-grey-lighten-1">
              Create a new secure password for your account
            </p>
          </div>

          <!-- Form -->
          <v-form ref="formRef" v-model="isFormValid">
            <!-- New Password Field -->
            <div class="mb-3">
              <label class="text-white font-weight-bold mb-2 d-block">New Password</label>
              <v-text-field
                v-model="formModel.password"
                class="white-input text-black"
                variant="outlined"
                color="black"
                density="comfortable"
                placeholder="Enter your new password"
                :type="formModel.showPass ? 'text' : 'password'"
                :append-inner-icon="formModel.showPass ? 'mdi-eye' : 'mdi-eye-off'"
                :rules="passwordRules"
                :error="hasPasswordError"
                :error-messages="passwordErrorMessages"
                @click:append-inner="formModel.showPass = !formModel.showPass"
                @input="onPasswordChange"
              />
            </div>

            <!-- Confirm Password Field -->
            <div class="mb-3">
              <label class="text-white font-weight-bold mb-2 d-block">Confirm Password</label>
              <v-text-field
                v-model="formModel.confirmPassword"
                class="white-input text-black"
                variant="outlined"
                color="black"
                density="comfortable"
                placeholder="Confirm your new password"
                :type="formModel.showPass2 ? 'text' : 'password'"
                :append-inner-icon="formModel.showPass2 ? 'mdi-eye' : 'mdi-eye-off'"
                :rules="confirmPasswordRules"
                :error="hasConfirmPasswordError"
                :error-messages="confirmPasswordErrorMessages"
                @click:append-inner="formModel.showPass2 = !formModel.showPass2"
                @input="onConfirmPasswordChange"
              />
            </div>

            <!-- Password Requirements -->
            <v-expand-transition>
              <div v-if="showPasswordRequirements" class="password-requirements mb-4">
                <div class="d-flex align-center mb-2 text-black">
                  <v-icon size="16" class="mr-2">mdi-shield-check</v-icon>
                  <span class="text-body-2 font-weight-medium">Password Requirements:</span>
                </div>
                
                <div class="requirements-grid">
                  <div 
                    v-for="(req, key) in passwordRequirements" 
                    :key="key"
                    class="requirement-item d-flex align-center mb-1"
                  >
                    <v-icon 
                      :color="req.met ? 'success' : 'error'" 
                      size="16" 
                      class="mr-2"
                    >
                      {{ req.met ? 'mdi-check-circle' : 'mdi-close-circle' }}
                    </v-icon>
                    <span 
                      :class="req.met ? 'text-success' : 'text-error'"
                      class="text-body-2"
                    >
                      {{ req.text }}
                    </span>
                  </div>
                </div>
                         <!-- Password Strength Indicator -->
                <div v-if="formModel.password" class="mb-4 pt-3">
                  <div class="d-flex justify-space-between align-center mb-1">
                    <span class="text-body-2 text-black">Password Strength</span>
                    <span class="text-body-2 font-weight-medium" :class="passwordStrength.colorClass">
                      {{ passwordStrength.label }}
                    </span>
                  </div>
                  <v-progress-linear
                    :model-value="passwordStrength.score"
                    :color="passwordStrength.color"
                    height="4"
                    rounded
                  />
                </div>
              </div>
              
            </v-expand-transition>

   

            <!-- Action Buttons -->
            <div class="d-flex justify-center pt-2" style="gap: 8px;">
              <v-btn
                variant="outlined"
                color="white"
                width="120"
                rounded="pill"
                :disabled="isLoading"
                @click="goBack"
              >
                Cancel
              </v-btn>
              <v-btn
                color="white"
                class="text-black"
                width="120"
                rounded="pill"
                :disabled="!canSubmit"
                :loading="isLoading"
                @click="changePassword"
              >
                {{ isLoading ? 'Changing...' : 'Submit' }}
              </v-btn>
            </div>
          </v-form>

          <!-- Success State -->
          <v-overlay v-model="showSuccessOverlay" class="text-center" contained persistent>
            <div class="success-content">
              <v-icon color="success" size="64" class="mb-3">mdi-check-circle</v-icon>
              <h3 class="text-success mb-2">Password Changed!</h3>
              <p class="text-body-1 mb-3">Your password has been updated successfully.</p>
              <p class="text-body-2">Redirecting to login page...</p>
            </div>
          </v-overlay>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script setup lang="ts">
import { ref, onBeforeMount, computed, getCurrentInstance, nextTick } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useSessionStore } from "@/stores/session";
import { useAlertStore } from "@/stores/alert";
import { useMXStore } from "@/stores/mx";

// Store instances
const mx = useMXStore();
const { proxy } = getCurrentInstance()!;
const session = useSessionStore();
const route = useRoute();
const router = useRouter();
const alertStore = useAlertStore();

// Refs
const formRef = ref();
const isFormValid = ref(false);
const isLoading = ref(false);
const showSuccessOverlay = ref(false);

// Form model
const formModel = ref({
  password: '',
  confirmPassword: '',
  showPass: false,
  showPass2: false,
  email: '',
  trainerID: '',
  expirationDate: ''
});

// Validation state
const passwordTouched = ref(false);
const confirmPasswordTouched = ref(false);

// Password validation rules
const passwordRules = [
  (v: string) => !!v || 'Password is required',
  (v: string) => v.length >= 8 || 'Password must be at least 8 characters',
  (v: string) => /[A-Z]/.test(v) || 'Password must include uppercase letter',
  (v: string) => /[a-z]/.test(v) || 'Password must include lowercase letter',
  (v: string) => /\d/.test(v) || 'Password must include a number',
  (v: string) => /[@$!%*?&]/.test(v) || 'Password must include special character'
];

const confirmPasswordRules = [
  (v: string) => !!v || 'Please confirm your password',
  (v: string) => v === formModel.value.password || 'Passwords do not match'
];

// Computed properties
const passwordRequirements = computed(() => ({
  length: {
    text: 'At least 8 characters long',
    met: formModel.value.password.length >= 8
  },
  upper: {
    text: 'Include at least one uppercase letter',
    met: /[A-Z]/.test(formModel.value.password)
  },
  lower: {
    text: 'Include at least one lowercase letter',
    met: /[a-z]/.test(formModel.value.password)
  },
  number: {
    text: 'Include at least one number',
    met: /\d/.test(formModel.value.password)
  },
  special: {
    text: 'Include at least one special character (@$!%*?&)',
    met: /[@$!%*?&]/.test(formModel.value.password)
  }
}));

const showPasswordRequirements = computed(() => {
  return formModel.value.password.length > 0 && passwordTouched.value;
});

const passwordStrength = computed(() => {
  const password = formModel.value.password;
  if (!password) return { score: 0, label: '', color: 'grey', colorClass: '' };

  let score = 0;
  const requirements = passwordRequirements.value;

  // Calculate score based on requirements
  Object.values(requirements).forEach(req => {
    if (req.met) score += 20;
  });

  // Additional complexity bonus
  if (password.length >= 12) score += 10;
  if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) score += 10;

  let label = '';
  let color = '';
  let colorClass = '';

  if (score < 40) {
    label = 'Weak';
    color = 'error';
    colorClass = 'text-error';
  } else if (score < 80) {
    label = 'Fair';
    color = 'warning';
    colorClass = 'text-warning';
  } else if (score < 100) {
    label = 'Good';
    color = 'info';
    colorClass = 'text-info';
  } else {
    label = 'Strong';
    color = 'success';
    colorClass = 'text-success';
  }

  return { score, label, color, colorClass };
});

const hasPasswordError = computed(() => {
  return passwordTouched.value && !isPasswordValid.value;
});

const hasConfirmPasswordError = computed(() => {
  return confirmPasswordTouched.value && !isConfirmPasswordValid.value;
});

const isPasswordValid = computed(() => {
  return Object.values(passwordRequirements.value).every(req => req.met);
});

const isConfirmPasswordValid = computed(() => {
  return formModel.value.confirmPassword === formModel.value.password && 
         formModel.value.confirmPassword.length > 0;
});

const passwordErrorMessages = computed(() => {
  if (!passwordTouched.value || isPasswordValid.value) return [];
  
  const errors = [];
  const reqs = passwordRequirements.value;
  
  if (!reqs.length.met) errors.push('Must be at least 8 characters');
  if (!reqs.upper.met) errors.push('Must include uppercase letter');
  if (!reqs.lower.met) errors.push('Must include lowercase letter');
  if (!reqs.number.met) errors.push('Must include a number');
  if (!reqs.special.met) errors.push('Must include special character');
  
  return errors;
});

const confirmPasswordErrorMessages = computed(() => {
  if (!confirmPasswordTouched.value) return [];
  if (!formModel.value.confirmPassword) return ['Please confirm your password'];
  if (!isConfirmPasswordValid.value) return ['Passwords do not match'];
  return [];
});

const canSubmit = computed(() => {
  return isPasswordValid.value && 
         isConfirmPasswordValid.value && 
         !isLoading.value;
});

// Methods
const onPasswordChange = () => {
  passwordTouched.value = true;
};

const onConfirmPasswordChange = () => {
  confirmPasswordTouched.value = true;
};

const validateForm = async (): Promise<boolean> => {
  if (!formRef.value) return false;
  
  const { valid } = await formRef.value.validate();
  return valid && isPasswordValid.value && isConfirmPasswordValid.value;
};

const changePassword = async () => {
  try {
    isLoading.value = true;

    // Final validation
    const isValid = await validateForm();
    if (!isValid) {
      alertStore.showAlert("warning", "Validation Error", "Please fix the errors before submitting", true);
      return;
    }

    // API call
    const res = await proxy!.$api.changePassword({
      trainerID: String(formModel.value.trainerID),
      email: formModel.value.email,
      password: formModel.value.password,
      password_token: route.params.token
    });
    if (res.data.status) {
      // showSuccessOverlay.value = true;
      alertStore.showAlert("success", "Success", 'Password has been updated successfully.', true);
      // Redirect after delay
      setTimeout(() => {
        router.push({ path: '/login' });
      }, 3000);
    } else {
      alertStore.showAlert("error", "Password Reset Failed", res.data.message || "An error occurred", true);
    }
  } catch (error) {
    console.error('Password change error:', error);
    alertStore.showAlert("error", "Network Error", "Please check your connection and try again", true);
  } finally {
    isLoading.value = false;
  }
};

const goBack = () => {
  router.push({ path: '/login' });
};

// Lifecycle
onBeforeMount(async () => {
  try {
    const token = Array.isArray(route.params.token)
      ? route.params.token[0]
      : route.params.token;

    if (!token) {
      throw new Error('No reset token provided');
    }

    const res = await proxy!.$api.checkResetToken(token);
    if(res.data.status === false){
      alertStore.showAlert("error", "Invalid Link", 'This reset link is invalid. Please request a new one.', true);
      setTimeout(() => {
        router.push({ path: '/login' });
      }, 1500);
    }

    const jsonStr = atob(token);
    const decoded = JSON.parse(jsonStr);
    const { email, trainerID, expirationDate } = decoded;

    if (!email || !trainerID || !expirationDate) {
      throw new Error('Invalid token data');
    }

    formModel.value.email = email;
    formModel.value.trainerID = trainerID;
    formModel.value.expirationDate = expirationDate;

    // Check expiration
    const now = new Date();
    const expiry = new Date(expirationDate);
    
    if (now > expiry) {
      alertStore.showAlert("error", "Link Expired", 'Your reset link has expired. Please request a new one.', true);
      setTimeout(() => {
        router.push({ path: '/login' });
      }, 3000);
    }
  } catch (error) {
    console.error("Invalid or corrupted reset token", error);
    alertStore.showAlert("error", "Invalid Link", 'This reset link is invalid or corrupted. Please request a new one.', true);
  }
});
</script>

<style scoped>
.v-center {
  display: flex;
  place-items: center;
  min-height: 100vh;
  min-width: 100vw;
  background: linear-gradient(135deg, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.3) 100%);
}

.password-requirements {
  background: rgba(255, 255, 255, 0.903);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  padding: 16px;
}

.requirement-item {
  min-height: 24px;
}

.requirements-grid {
  display: grid;
  gap: 4px;
}

.success-content {
  background: rgba(0, 0, 0, 0.8);
  padding: 32px;
  border-radius: 16px;
  max-width: 300px;
}


/* Loading state styles */
.v-btn--loading {
  pointer-events: none;
}

/* Enhanced focus styles */
.white-input :deep(.v-field--focused .v-field__outline) {
  border-color: #2196F3 !important;
  border-width: 2px !important;
}

/* Error state styles */
.white-input :deep(.v-field--error .v-field__outline) {
  border-color: #f44336 !important;
}

/* Animation for requirements */
.requirement-item {
  transition: all 0.2s ease;
}

.requirement-item:hover {
  transform: translateX(2px);
}
</style>