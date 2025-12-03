<template>
    <v-menu
        v-model="menu"
        :close-on-content-click="false"
        transition="scale-transition"
        offset-y
        >
      <template #activator="{ props: activatorProps }">
            <v-text-field variant="outlined" color="black" :density="props.density as any || 'comfortable'"
                :label="label"
                :model-value="displayDate"
                readonly 
                :class="props.class"
                :rules="[rules.required]"
                :hide-details="true"
                :disabled="props.disabled"
                v-bind="activatorProps">
                <template #prepend-inner v-if="props.tooltip">
                    <v-tooltip location="top">
                         {{ props.tooltip }}
                        <template #activator="{ props: tooltipProps }">
                            <v-icon v-bind="tooltipProps" icon="mdi-information-slab-circle-outline" />
                        </template>
                    </v-tooltip>
                </template>

                <template #append-inner>
                    <v-icon icon="mdi-calendar" />
                </template>
            </v-text-field>
        </template>
        <v-card min-width="200px" style="max-width: 325px; padding: 0;">
          <v-date-picker 
            v-model="innerDate"
            :min="props.min  ? new Date(new Date(props.min).setDate(new Date(props.min).getDate())).toISOString().split('T')[0] : ''" 
            :max="props.max ? new Date(new Date(props.max).setDate(new Date(props.max).getDate())).toISOString().split('T')[0] : ''"
            @update:model-value="updateDate"
            color="blue-accent-4"
            />

            
          <i v-if="props.min" class="mx-2 d-flex align-center" style="font-size: 0.9rem;">
            You may select dates from 
            {{ new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric' }).format(new Date(props.min)) }}
            to 
            {{ new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric' }).format(new Date()) }}
          </i>
  


        </v-card>
       
  </v-menu>
</template>


<script setup lang="ts">
import { ref, computed, watch } from "vue"

interface Props {
  label?: string
  modelValue?: string | null | undefined
  format?: (date: string | null) => string
  class?: string
  min?: string 
  max?: string
  density?: string 
  disabled?: boolean
  tooltip?: string
}

const props = defineProps<Props>()
const emit = defineEmits<{
  (e: "update:modelValue", value: string | null | undefined): void
}>()

const menu = ref(false)
const innerDate = ref<string | null>(props.modelValue || null)

const rules = {
  required: (value: string) => !!value || "This field is required"
};

watch(
  () => props.modelValue,
  val => {
    innerDate.value = val ?? null
  }
)

const displayDate = computed(() => {
  if (props.format) {
    return props.format(innerDate.value)
  }
  return innerDate.value || ""
})

function updateDate(value: string | null) {
  innerDate.value = value
  emit("update:modelValue", new Date(value as any).toLocaleDateString('en-CA'))
  menu.value = false
}
</script>