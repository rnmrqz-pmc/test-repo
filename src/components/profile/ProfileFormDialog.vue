<template>
    <v-dialog v-model="props.status" max-width="800" :persistent="true">

    </v-dialog>

</template>


<script setup lang="ts">
import { ref, computed, watch, getCurrentInstance } from 'vue'
import { decrypt } from '@/utils/encryptDecrypt'
import { useAlertStore } from '@/stores/alert'
import { useMXStore } from '@/stores/mx'

interface Props {
  modelValue: any
  status: boolean
  teamOptions: any[]
  trainingSources: any[]
  deliveryMethods: any[]
  attachmentList: any
  readOnly: boolean
}
interface Emits {
  (e: 'update:data', value: boolean): void
  (e: 'update:modelValue', value: object): void
  (e: 'save'): void
  (e: 'cancel'): void
  (e: 'attach', file: File): void
  (e: 'remove-attachment', index: number, type: number): void
  (e: 'add-link', link: string): void
  (e: 'remove-link', index: number): void
}

const mx = useMXStore()
const alertStore = useAlertStore()
const { proxy } = getCurrentInstance()!
const props = defineProps<Props>()
const emit = defineEmits<Emits>()


</script>