<template>
  <v-dialog v-model="localModel" :max-width="dialogWidth" :persistent="true">
    <v-card class="pa-6 globalRadius">
      <v-card-title class="text-center mb-4">
        <h3>Complete Training</h3>
        <p class="text-subtitle-1 text-medium-emphasis">
          Upload a link or photos to mark this training as completed
        </p>
      </v-card-title>
      <v-text-field
        label="Google Drive Link"
        variant="outlined"
        color="primary"
        class="mx-1 mb-1"
        density="compact"
        prepend-inner-icon="mdi-link"
        prepend-icon=""
        type="url"
        placeholder="Paste Google Drive link here"
        @blur="inputLink($event.target.value)"
        :rules="[drive_link_rule]"
      ></v-text-field>
      <!-- File Upload Section -->
      <v-file-input 
        @change="handleFileChange"
        label="Upload Images: JPEG, JPG, PNG | Max File Size: 10MB" 
        variant="outlined" 
        color="primary"
        class="mx-1 mb-4" 
        density="compact" 
        :hide-details="false"
        accept="image/jpeg, image/png, image/jpg"
        prepend-inner-icon="mdi-camera"
        prepend-icon=""
        multiple
        :rules="fileRules"
      >
        <template v-slot:selection="{ fileNames }">
          <template v-for="fileName in fileNames" :key="fileName">
            <v-chip class="me-2" color="primary" size="small">
              {{ fileName }}
            </v-chip>
          </template>
        </template>
      </v-file-input>

      <!-- Image Preview Section -->
      <div v-if="images.length > 0" class="mb-4">
        <h4 class="mb-3">Image Preview:</h4>
        <div class="d-flex pa-2 pb-1" style="max-width: 100%; overflow-x: auto; gap: 12px;">
          <div 
            v-for="(img, index) in images" 
            :key="index" 
            class="position-relative d-flex justify-center border rounded"
            style="flex-shrink: 0;"
          >
            <!-- Remove button -->
            <v-btn
              @click="$emit('remove-image', index)"
              class="position-absolute remove-btn"
              size="small"
              icon
              color="error"
              variant="elevated"
              style="top: -8px; right: -8px; z-index: 2;"
            >
              <v-icon size="18">mdi-close</v-icon>
            </v-btn>
            
            <!-- Image and filename -->
            <div class="d-flex flex-column align-center">
              <v-img
                :src="getObjectUrl(img)"
                height="200"
                width="200"
                class="rounded"
                cover
              >
                <template v-slot:error>
                  <v-row class="fill-height ma-0" align="center" justify="center">
                    <v-icon size="48" color="grey">mdi-image-broken-variant</v-icon>
                  </v-row>
                </template>
              </v-img>
              <p class="text-center font-weight-bold text-caption mt-2" style="max-width: 200px; word-wrap: break-word;">
                {{ img.name }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else class="text-center py-8">
        <v-icon size="64" color="grey-lighten-1" class="mb-4">mdi-camera-plus</v-icon>
        <p class="text-h6 text-medium-emphasis mb-2">No images selected</p>
        <p class="text-body-2 text-disabled">
          Please upload at least one image to complete the training
        </p>
      </div>

      <!-- Upload Guidelines -->
      <v-alert
        type="info"
        variant="tonal"
        class="mb-4"
        density="compact"
      >
        <strong>Upload Guidelines:</strong>
        <ul class="mt-2 ml-4">
          <li>Accepted formats: JPEG, JPG, PNG</li>
          <li>Maximum file size: 10MB per image</li>
          <li>Multiple images can be uploaded</li>
          <li>Images will be used as proof of training completion</li>
        </ul>
      </v-alert>

      <!-- Action Buttons -->
      <v-card-actions class="d-flex justify-center pt-4">
        <v-btn 
          @click="localModel = false" 
          variant="outlined" 
          color="grey-darken-1" 
          class="mx-2" 
          width="120" 
          rounded="pill"
        >
          Cancel
        </v-btn>
        <v-btn 
          @click="$emit('upload')" 
          variant="elevated" 
          color="success" 
          class="mx-2" 
          width="120" 
          rounded="pill"
          :disabled="images.length === 0 && prooflink === ''"
          :loading="uploading"
        >
          <v-icon left>mdi-upload</v-icon>
          Complete
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useMXStore } from '@/stores/mx'
import { drive_link_rule } from '@/utils/rules'
const mx = useMXStore()

const dialogWidth = computed(() => {
    if(mx.isMobile) return '100%'
    else if(mx.isTablet) return '100%'
    else if(mx.isDesktop) return '50%'
    else return '50%'
})
interface Props {
  modelValue: boolean
  images: File[]
  prooflink?: string
  uploading?: boolean
}

interface Emits {
  (e: 'update:modelValue', value: boolean): void
  (e: 'link-change', value: string): void
  (e: 'file-change', file: File): void
  (e: 'remove-image', index: number): void
  (e: 'upload'): void
}

const props = withDefaults(defineProps<Props>(), {
  uploading: false
})

const emit = defineEmits<Emits>()

// Local model for v-model
const localModel = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

// File validation rules
const fileRules = [
  (files: File[] | null) => {
    if (!files || files.length === 0) return true
    
    for (const file of files) {
      // Check file size (5MB = 5 * 1024 * 1024 bytes)
      if (file.size > 10 * 1024 * 1024) {
        return `File "${file.name}" is too large. Maximum size is 10MB.`
      }
      
      // Check file type
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png']
      if (!allowedTypes.includes(file.type)) {
        return `File "${file.name}" is not a valid image type. Only JPEG, JPG, and PNG are allowed.`
      }
    }
    
    return true
  }
]

function inputLink(link: string) {
  emit('link-change', link)
}

// Event handlers
function handleFileChange(event: Event): void {
  const target = event.target as HTMLInputElement
  if (target.files) {
    Array.from(target.files).forEach(file => {
      // Validate file before emitting
      const validation = fileRules[0]([file])
      if (validation === true) {
        emit('file-change', file)
      } else {
        console.warn('File validation failed:', validation)
        // You could show an alert here instead
      }
    })
    // Clear the input so the same file can be selected again if needed
    target.value = ''
  }
}

function getObjectUrl(file: File): string {
  return URL.createObjectURL(file)
}
</script>

<style scoped>
.globalRadius {
  border-radius: 8px;
}

.remove-btn {
  box-shadow: 0 2px 4px rgba(0,0,0,0.2);
}

.border {
  border: 1px solid rgba(0, 0, 0, 0.12);
}

.rounded {
  border-radius: 8px;
}

.position-relative {
  position: relative;
}

.position-absolute {
  position: absolute;
}
</style>