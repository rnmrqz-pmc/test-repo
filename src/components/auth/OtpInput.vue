<template>
  <v-container fluid class="fill-height">
    <v-row justify="center" align="center" class="fill-height">
      <v-col cols="12" sm="8" md="6" lg="4">
        <v-card class="pa-8 globalRadius" elevation="8">
          <v-card-title class="text-center pb-4">
            <v-icon size="64" color="primary" class="mb-4">mdi-shield-check</v-icon>
            <h2 class="text-h4 font-weight-bold">Verify Your Identity</h2>
          </v-card-title>
          
          <v-card-text class="text-center pb-6">
            <p class="text-body-1 text-medium-emphasis mb-4">
              We've sent a 6-digit verification code to
            </p>
            <p class="text-body-1 font-weight-medium">
              {{ maskedPhone || maskedEmail }}
            </p>
          </v-card-text>

          <v-form @submit.prevent="verifyOtp">
            <v-row justify="center" class="mb-6">
              <v-col cols="auto">
                <div class="otp-container">
                  <v-text-field
                    v-for="(digit, index) in otpDigits"
                    :key="index"
                    :ref="(el) => setInputRef(el, index)"
                    v-model="otpDigits[index]"
                    class="otp-input"
                    variant="outlined"
                    density="comfortable"
                    hide-details
                    maxlength="1"
                    @input="handleInput(index, $event)"
                    @keydown="handleKeydown(index, $event)"
                    @paste="handlePaste"
                    :disabled="loading"
                  />
                </div>
              </v-col>
            </v-row>

            <v-alert
              v-if="errorMessage"
              type="error"
              variant="tonal"
              class="mb-4"
              closable
              @click:close="errorMessage = ''"
            >
              {{ errorMessage }}
            </v-alert>

            <v-alert
              v-if="successMessage"
              type="success"
              variant="tonal"
              class="mb-4"
            >
              {{ successMessage }}
            </v-alert>

            <v-btn
              type="submit"
              color="primary"
              size="large"
              block
              :loading="loading"
              :disabled="!isOtpComplete"
              class="mb-4"
            >
              Verify Code
            </v-btn>

            <div class="text-center">
              <p class="text-body-2 text-medium-emphasis mb-2">
                Didn't receive the code?
              </p>
              <v-btn
                variant="text"
                color="primary"
                :disabled="loading || resendCountdown > 0"
                @click="resendOtp"
              >
                {{ resendCountdown > 0 ? `Resend in ${Math.floor(resendCountdown / 60)}m ${resendCountdown % 60}s` : 'Resend Code' }}
              </v-btn>
            </div>
          </v-form>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, nextTick, getCurrentInstance, onBeforeUnmount } from 'vue'
import { useMXStore } from '@/stores/mx'
import { useSessionStore } from '@/stores/session'
import { CookieManager } from '@/utils/cookieManager'
import { useRouter } from 'vue-router'

const session = useSessionStore()
const { proxy } = getCurrentInstance()!
const mx = useMXStore()
const router = useRouter()

// Props (you can pass these from parent component or route params)
const props = defineProps({
  phone: {
    type: String,
    default: '+1234567890'
  },
  email: {
    type: String,
    default: 'user@example.com'
  }
})

// Reactive data
const otpDigits = ref<any>(['', '', '', '', '', ''])
const inputRefs = ref<any>([])
const loading = ref(false)
const errorMessage = ref('')
const successMessage = ref('')
const resendCountdown = ref(0)

// Computed properties
const isOtpComplete = computed(() => {
  return otpDigits.value.every((digit : any) => digit !== '')
})

const otpValue = computed(() => {
  return otpDigits.value.join('')
})

const maskedPhone = computed(() => {
  if (!props.phone) return null
  const phone = props.phone.replace(/\D/g, '')
  return phone.replace(/(\d{3})\d{4}(\d{3})/, '$1****$2')
})

const maskedEmail = computed(() => {
  if (!props.email) return null
  const [username, domain] = props.email.split('@')
  const maskedUsername = username.charAt(0) + '*'.repeat(username.length - 2) + username.charAt(username.length - 1)
  return maskedUsername + '@' + domain
})

// Methods
const setInputRef = (el : any, index :any) => {
  if (el) {
    inputRefs.value[index] = el
  }
}

const handleInput = (index : any, event : any) => {
  const value = event.target.value.replace(/\D/g, '') // Only allow digits
  
  if (value) {
    otpDigits.value[index] = value
    
    // Move to next input
    if (index < otpDigits.value.length - 1) {
      focusInput(index + 1)
    }
  } else {
    otpDigits.value[index] = ''
  }
  
  // Clear any error message when user starts typing
  if (errorMessage.value) {
    errorMessage.value = ''
  }
}

const handleKeydown = (index : any, event : any) => {
  // Handle backspace
  if (event.key === 'Backspace' && !otpDigits.value[index] && index > 0) {
    focusInput(index - 1)
  }
  
  // Handle arrow keys
  if (event.key === 'ArrowLeft' && index > 0) {
    focusInput(index - 1)
  }
  
  if (event.key === 'ArrowRight' && index < otpDigits.value.length - 1) {
    focusInput(index + 1)
  }
}

const handlePaste = (event : any) => {
  event.preventDefault()
  const pastedData = event.clipboardData.getData('text').replace(/\D/g, '')
  
  if (pastedData.length === 6) {
    for (let i = 0; i < 6; i++) {
      otpDigits.value[i] = pastedData[i] || ''
    }
    focusInput(5) // Focus last input
  }
}

const focusInput = async (index : any) => {
  await nextTick()
  if (inputRefs.value[index]) {
    const input = inputRefs.value[index].$el.querySelector('input')
    if (input) {
      input.focus()
      input.select()
    }
  }
}

const verifyOtp = async () => {
  if (!isOtpComplete.value) {
    errorMessage.value = 'Please enter all 6 digits'
    return
  }

  loading.value = true
  errorMessage.value = ''
  successMessage.value = ''

  try {
    // Simulate API call
    let data = {
        userID: session.user.ID,
        otp: otpValue.value,
        UUID: mx.getDeviceId(),
        USER_AGENT: mx.getUserAgent()
    }
    const response = await proxy!.$api.verify2FA(data)

    if(response.data.status){
        session.setAuth(response.data.status)
        successMessage.value = 'OTP verified successfully!'
        CookieManager.deleteCookie('_SendThrottle');
        setTimeout(() => {
            // location.reload()
            router.push('/') 
        }, 1000);
    } else {
      errorMessage.value = response.data.message
      // Clear the OTP inputs
      otpDigits.value = ['', '', '', '', '', '']
      await nextTick()
      focusInput(0)
    }
  } catch (error) {
    errorMessage.value = 'Something went wrong. Please try again.'
  } finally {
    loading.value = false
  }
}

const resendOtp = async () => {
  loading.value = true
  errorMessage.value = ''
  
  try {
    let data = {
        userID: session.user.ID,
        'UUID': mx.getDeviceId(),
        USER_AGENT: mx.getUserAgent()
    }
    // Simulate API call
    const res = await proxy!.$api.generate2FA(data)
    let timer = parseInt(res.data.throttleTime)
    // Start countdown
    resendCountdown.value = timer
    const countdown = setInterval(() => {
      resendCountdown.value--
      CookieManager.setCookie('_SendThrottle', String(resendCountdown.value), 2)
      if (resendCountdown.value <= 0) {
        clearInterval(countdown)
      }
    }, 1000)
    
    // Clear existing OTP
    otpDigits.value = ['', '', '', '', '', '']
    await nextTick()
    focusInput(0)
    
  } catch (error) {
    console.log(error)
    errorMessage.value = 'Failed to resend code. Please try again.'
  } finally {
    loading.value = false
  }
}

const sendOtp = async () => {
    const uuid = mx.getDeviceId()
    const userAgent = mx.getUserAgent()
    await proxy!.$api.generate2FA({ userID: session.user.ID, UUID: uuid, USER_AGENT: userAgent  })

}

// Lifecycle
onMounted(async () => {

  focusInput(0)
  const authCount = CookieManager.getCookie('_SendThrottle')
  if (authCount) {
    resendCountdown.value = Number(authCount)
    if(resendCountdown.value > 0){
      const countdown = setInterval(() => {
        resendCountdown.value--
        CookieManager.setCookie('_SendThrottle', String(resendCountdown.value), 2)
        if (resendCountdown.value <= 0) {
          clearInterval(countdown)
        }
      }, 1000)
    }
  }
  if(!loading || resendCountdown.value == 0){
    await sendOtp()

  }

})

onBeforeUnmount(() => {
  CookieManager.setCookie('_SendThrottle', String(resendCountdown.value), 2)
})

</script>

<style scoped>
.otp-container {
  display: flex;
  gap: 12px;
  justify-content: center;
}

.otp-input {
  width: 56px !important;
  max-width: 56px;
}

.otp-input :deep(.v-field__input) {
  text-align: center;
  font-size: 24px;
  font-weight: bold;
  padding: 0;
}

.otp-input :deep(.v-field) {
  border-radius: 12px;
}

.otp-input :deep(.v-field--focused) {
  box-shadow: 0 0 0 2px rgb(var(--v-theme-primary));
}

@media (max-width: 480px) {
  .otp-container {
    gap: 8px;
  }
  
  .otp-input {
    width: 48px !important;
    max-width: 48px;
  }
  
  .otp-input :deep(.v-field__input) {
    font-size: 20px;
  }
}
</style>