<template>
  <OtpInput 
    :phone="userPhone"
    :email="userEmail"
    @verified="handleOtpVerified"
    @resent="handleOtpResent"
  />
</template>

<script setup lang="ts">
import { ref, onBeforeUnmount } from 'vue'
import { useSessionStore } from '@/stores/session'
import OtpInput from '@/components/auth/OtpInput.vue'

const session = useSessionStore()
const userPhone = ''
const userEmail = session.user.email

const handleOtpVerified = (otpCode: string) => {
  // Handle successful verification
}

const handleOtpResent = () => {
  // Handle resend confirmation
}

onBeforeUnmount(() => {
//   session.logout()
})

</script>