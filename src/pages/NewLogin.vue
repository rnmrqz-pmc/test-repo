<template>
  <v-app>
    <v-main>
      <v-container fluid class="pa-0 fill-height">
        <v-row no-gutters class="fill-height">
          <!-- Left Panel - Branding -->
          <v-col cols="12" md="6" class="branding-panel d-flex align-center justify-center">
            <div class="text-center">
              <h1 class="basecamp-logo">Basecamp</h1>
              <p class="basecamp-subtitle">by Power Mac Center</p>
            </div>
          </v-col>

          <!-- Right Panel - Login Form -->
          <v-col cols="12" md="6" class="login-panel d-flex align-center justify-center">
            <v-card 
              class="login-card pa-8" 
              flat
              max-width="400"
              width="100%"
            >
              <div class="text-center mb-8">
                <h2 class="login-title mb-2">LOGIN</h2>
                <p class="login-subtitle">Please sign in to continue.</p>
              </div>

              <v-form @submit.prevent="handleLogin">
                <div class="mb-6">
                  <v-text-field
                    v-model="username"
                    label="Username"
                    variant="outlined"
                    density="comfortable"
                    prepend-inner-icon="mdi-account-outline"
                    class="custom-input"
                    :rules="usernameRules"
                    required
                  ></v-text-field>
                </div>

                <div class="mb-6">
                  <v-text-field
                    v-model="password"
                    :type="showPassword ? 'text' : 'password'"
                    label="Password"
                    variant="outlined"
                    density="comfortable"
                    prepend-inner-icon="mdi-lock-outline"
                    :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
                    @click:append-inner="showPassword = !showPassword"
                    class="custom-input"
                    :rules="passwordRules"
                    required
                  ></v-text-field>
                </div>

                <div class="d-flex gap-3 mb-6">
                  <v-btn
                    type="submit"
                    color="primary"
                    size="large"
                    class="login-btn flex-grow-1"
                    :loading="loading"
                  >
                    LOGIN
                  </v-btn>
                  <v-btn
                    color="primary"
                    variant="outlined"
                    size="large"
                    class="signup-btn flex-grow-1"
                    @click="handleSignUp"
                  >
                    SIGN UP
                  </v-btn>
                </div>

                <div class="text-center">
                  <v-btn
                    variant="text"
                    color="primary"
                    class="forgot-password-btn"
                    @click="handleForgotPassword"
                  >
                    Forgot your password?
                  </v-btn>
                </div>
              </v-form>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import { ref } from 'vue'

// Reactive data
const username = ref<string>('')
const password = ref<string>('')
const showPassword = ref<boolean>(false)
const loading = ref<boolean>(false)

// Form validation rules
const usernameRules = [
  (v: string) => !!v || 'Username is required',
  (v: string) => v.length >= 3 || 'Username must be at least 3 characters'
]

const passwordRules = [
  (v: string) => !!v || 'Password is required',
  (v: string) => v.length >= 6 || 'Password must be at least 6 characters'
]

// Methods
const handleLogin = async (): Promise<void> => {
  loading.value = true
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    console.log('Login attempt:', { username: username.value, password: password.value })
    // Handle successful login here
  } catch (error) {
    console.error('Login error:', error)
  } finally {
    loading.value = false
  }
}

const handleSignUp = (): void => {
  console.log('Sign up clicked')
  // Handle sign up navigation
}

const handleForgotPassword = (): void => {
  console.log('Forgot password clicked')
  // Handle forgot password navigation
}
</script>

<style scoped>
.branding-panel {
  background: linear-gradient(135deg, #5b6bc0 0%, #3949ab 100%);
  color: white;
}

.basecamp-logo {
  font-size: 4rem;
  font-weight: 300;
  letter-spacing: -0.02em;
  margin-bottom: 0.5rem;
}

.basecamp-subtitle {
  font-size: 1.1rem;
  opacity: 0.9;
  font-weight: 300;
}

.login-panel {
  background: #f5f5f5;
}

.login-card {
  background: white !important;
  border-radius: 8px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1) !important;
}

.login-title {
  font-size: 2rem;
  font-weight: 500;
  color: #333;
  letter-spacing: 0.1em;
}

.login-subtitle {
  color: #666;
  font-size: 1rem;
}

.custom-input {
  margin-bottom: 1rem;
}

.custom-input :deep(.v-field) {
  background: #f8f9fa;
  border-radius: 8px;
}

.custom-input :deep(.v-field--focused) {
  background: white;
}

.login-btn {
  border-radius: 8px !important;
  font-weight: 600;
  letter-spacing: 0.05em;
}

.signup-btn {
  border-radius: 8px !important;
  font-weight: 600;
  letter-spacing: 0.05em;
}

.forgot-password-btn {
  text-decoration: underline;
  font-size: 0.9rem;
}

/* Responsive adjustments */
@media (max-width: 960px) {
  .branding-panel {
    min-height: 200px;
  }
  
  .basecamp-logo {
    font-size: 3rem;
  }
  
  .login-card {
    margin: 2rem 1rem;
  }
}
</style>