

<template>
  <v-menu
    v-model="menu"
    :close-on-content-click="false"
    transition="scale-transition"
    offset-y
    max-width="auto"
  >
    <template #activator="{ props: activatorProps }">
      <v-text-field
        :label="label"
        :model-value="displayTime"
        readonly :density="props.density as any || 'comfortable'"
        variant="outlined"
        :class="props.class"
        v-bind="activatorProps"
        :rules="[rules.required]"
        :hide-details="true" :disabled="props.disabled"
      >
        <template #append-inner>
          <v-icon icon="mdi-clock-outline" />
        </template>
      </v-text-field>
    </template>

    <v-card min-width="200px" style="max-width: 340px; padding: 0;">
      <v-time-picker
        color="blue-accent-4"
        v-model="innerTime"
        format="24hr"
        :min="min ? min.substring(0, 5) : '00:00'" 
        :max="max ? max.substring(0, 5) : '23:59'"
        @update:model-value="updateTime"
      />
      <!-- <v-card-actions>
        <v-spacer />
        <v-btn text @click="menu = false">Cancel</v-btn>
        <v-btn color="blue-accent-4" variant="flat" @click="saveTime">OK</v-btn>
      </v-card-actions> -->
    </v-card>
  </v-menu>
</template>



<script setup lang="ts">
import { ref, computed, watch } from "vue"

interface Props {
  label?: string
  modelValue?: string | null
  class?: string
  min?: string
  max?: string
  density?: string  
  disabled?: boolean
}

const props = defineProps<Props>()
const emit = defineEmits<{
  (e: "update:modelValue", value: string | null): void
}>()

const menu = ref(false)
const innerTime = ref<string | null>(null)

const rules = {
  required: (value: string) => !!value || "This field is required"
};

watch(
  () => props.modelValue,
  val => {
    innerTime.value = val ?? null
  },
  { immediate: true }
)

const displayTime = computed(() => innerTime.value || "")

function updateTime(value: string) {
  innerTime.value = `${value}:00`
  emit("update:modelValue", innerTime.value)
  menu.value = false
}

function saveTime() {
  emit("update:modelValue", innerTime.value)
  menu.value = false
}
</script>