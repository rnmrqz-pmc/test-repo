
// composables/useFormValidation.ts
import { useAlertStore } from '@/stores/alert'
import { link_rule } from '@/utils/rules'
import type { TrainingData } from '@/types/training'

export const useFormValidation = () => {
  const alertStore = useAlertStore()

  const validateTrainingData = (data: TrainingData): boolean => {
    const requiredFields = [
      { field: 'title', message: 'Title is required' },
      { field: 'start_date', message: 'Start Date is required' },
      { field: 'end_date', message: 'End Date is required' },
      { field: 'start_time', message: 'Start Time is required' },
      { field: 'end_time', message: 'End Time is required' },
      { field: 'participants', message: 'Number of Participants is required' },
      { field: 'objectives', message: 'Objectives is required' },
      { field: 'location_details', message: 'Location Details is required' },
      { field: 'audience', message: 'Audience is required' },
      { field: 'training_source', message: 'Training Source is required' },
      { field: 'method', message: 'Delivery Method is required' }
    ]

    for (const { field, message } of requiredFields) {
      if (!data[field as keyof TrainingData] || data[field as keyof TrainingData] === '') {
        alertStore.showAlert('warning', '', message, true)
        return false
      }
    }

    if (data.participants <= 0) {
      alertStore.showAlert('warning', '', 'Number of participants must be greater than 0', true)
      return false
    }

    if (!data.trainers || (Array.isArray(data.trainers) && data.trainers.length === 0)) {
      alertStore.showAlert('warning', '', 'At least one trainer is required', true)
      return false
    }

    if (data.training_hours <= 0) {
      alertStore.showAlert('warning', '', 'Training hours must be greater than 0', true)
      return false
    }

    return true
  }

  const validateLink = (link: string): boolean => {
    return link_rule(link) === true
  }

  return {
    validateTrainingData,
    validateLink
  }
}
