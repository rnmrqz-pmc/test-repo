
// composables/useFileUpload.ts
import { getCurrentInstance } from 'vue'
import { decrypt } from '@/utils/encryptDecrypt'

export const useFileUpload = () => {
  const { proxy } = getCurrentInstance()!

  const validateFileSize = (file: File, maxSizeMB: number): boolean => {
    const maxSizeBytes = maxSizeMB * 1024 * 1024
    return file.size <= maxSizeBytes
  }

  const uploadImage = async (file: File): Promise<string> => {
    const formData = new FormData()
    formData.append('image', file)

    const response = await proxy!.$api.uploadImg(formData)
    
    if (!response.data.status) {
      throw new Error('Failed to upload image')
    }

    return decrypt(response.data.data)
  }

  const uploadMultipleImages = async (files: File[]): Promise<string[]> => {
    const uploadPromises = files.map(uploadImage)
    const results = await Promise.allSettled(uploadPromises)
    
    return results
      .filter((result): result is PromiseFulfilledResult<string> => 
        result.status === 'fulfilled')
      .map(result => result.value)
  }

  const createObjectUrl = (file: File): string => {
    return URL.createObjectURL(file)
  }

  return {
    validateFileSize,
    uploadImage,
    uploadMultipleImages,
    createObjectUrl
  }
}

