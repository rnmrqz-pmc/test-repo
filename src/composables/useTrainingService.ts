// composables/useTrainingService.ts
import { getCurrentInstance } from 'vue'
import { decrypt } from '@/utils/encryptDecrypt'
import type { TrainingData, TeamMember, User } from '../types/training'
import { useSessionStore } from '@/stores/session'
export const useTrainingService = () => {
  const { proxy } = getCurrentInstance()!

  // const createEmptyTraining = (): TrainingData => ({
  //   ID: '',
  //   title: 'Test',
  //   location_type: 'Physical',
  //   location_details: 'Test',
  //   start_date: '2025-09-22',
  //   end_date: '2025-09-22',
  //   start_time: '10:00:00',
  //   end_time: '14:00:00',
  //   audience: 'test',
  //   participants: 8,
  //   objectives: 'test',
  //   training_status: 'Planned',
  //   training_hours: 0,
  //   trainers: [],
  //   training_type: 'Free',
  //   others: '',
  //   training_source: '',
  //   training_source_others: '',
  //   feedback_link: '',
  //   method: '',
  //   attachments: '[]',
  //   link: '',
  //   links: [],
  //   images: []
  // })
  const createEmptyTraining = (): TrainingData => ({
    ID: '',
    title: '',
    location_type: 'Physical',
    location_details: '',
    start_date: '',
    end_date: '',
    start_time: '',
    end_time: '',
    audience: '',
    participants: 0,
    objectives: '',
    training_status: 'Planned',
    training_hours: 0,
    trainers: [],
    training_type: 'Free',
    others: '',
    training_source: '',
    training_source_others: '',
    feedback_link: '',
    method: '',
    attachments: '[]',
    link: '',
    links: [],
    images: [],
    proof_link: ''
  })

  const getTeamMembers = async (user: User): Promise<TeamMember[]> => {
    const filters: any = {
      team: user.team,
      manager: 0,
      admin: 0,
      status: 1,
      // admin: 0,
    }

    if (user.role != 'supervisor') {
      delete filters.team
      delete filters.manager
    }

    const response = await proxy!.$api.getData('trainers', { filters, limit: 100 })
    
    if (!response.data.status) {
      throw new Error('Failed to fetch team members')
    }
    let decrypted = decrypt(response.data.data)
    decrypted.map((item: any) => {
      item.name = `${item.last_name}, ${item.first_name} ${item.middle_name?.substring(0, 1) || ''}`
    })
    return decrypted
  }

  const getTrainings = async (payload: any): Promise<any> => {
    const response = await proxy!.$api.getData('training', payload)
    
    if (!response.data.status) {
      throw new Error('Failed to fetch trainings')
    }
    response.data.data = decrypt(response.data.data)
  
    return  response.data
  }

  // const getTrainings = async (team: TeamMember[]): Promise<TrainingData[]> => {
  //   const data = {
  //     filters: { status: 1 },
  //     find_in_set_any: {
  //       trainers: team.map(member => member.ID).join(',')
  //     }
  //   }

  //   const response = await proxy!.$api.getData('training', data)
    
  //   if (!response.data.status) {
  //     throw new Error('Failed to fetch trainings')
  //   }

  //   return decrypt(response.data.data)
  // }

  const prepareViewData = (item: TrainingData, team: TeamMember[]) => {
    const prepared = { ...item }
    prepared.trainers = typeof item.trainers === 'string' 
      ? item.trainers.split(',').map(t => parseInt(t))
      : item.trainers
    return prepared
  }

  const prepareEditData = (item: TrainingData) => {
    const prepared = { ...item }
    prepared.trainers = typeof item.trainers === 'string'
      ? item.trainers.split(',').map(t => parseInt(t))
      : item.trainers
    prepared.links = typeof item.links === 'string'
      ? JSON.parse(item.links)
      : item.links || []
    prepared.attachments = typeof item.attachments === 'string'
      ? JSON.parse(item.attachments)
      : item.attachments || []
    prepared.images = typeof item.images === 'string'
      ? JSON.parse(item.images)
      : item.images || []
    return prepared
  }

  const saveTraining = async (data: any, attachmentList: File[]) => {
    const session = useSessionStore()
    data.attachments = typeof data.attachments === 'string' ? (data.attachments) : JSON.stringify(data.attachments)
    data.links = typeof data.links === 'string' ? (data.links) : JSON.stringify(data.links)
    data.images = typeof data.images === 'string' ? (data.images) : JSON.stringify(data.images)
    if (Array.isArray(data.trainers)) {
      data.trainers = data.trainers.join(',')
    }

    data.status = 1

    // Handle file uploads
    if (attachmentList.length > 0) {
      attachmentList = attachmentList.filter((file: any) => file != '[' || file != ']')
      const uploadPromises = attachmentList.map(async (file: File) => {
        const formData = new FormData()
        formData.append('document', file)
        formData.append('filePath', `documents/training/${data.title}`)

        const uploadResponse = await proxy!.$api.uploadDoc(formData)
        
        if (uploadResponse.data.status) {
          let res = decrypt(uploadResponse.data.data)
          return {
            name: file.name,
            filename: res.filename,
            path: res.path
          }
        }
        return null
      })

      const uploadedFiles = (await Promise.all(uploadPromises)).filter(Boolean)
      
      if (uploadedFiles.length > 0) {
        data.attachments = [...( typeof data.attachments === 'string' ? JSON.parse(data.attachments) : data.attachments), ...uploadedFiles]
        data.attachments = JSON.stringify(data.attachments)
      }
    }
    if(data.ID == ''){
      data.created_by = session.user.ID
      data.created_on = new Date()
    }else{
      data.updated_by = session.user.ID
      data.updated_on = new Date()
    }
    const response = await proxy!.$api.saveData('training', data)
    if (!response.data.status) {
      throw new Error(response.data.error || 'Failed to save training')
    }

    return {data: decrypt(response.data.data), operation: response.data.operation}
  }

function generateTrainingNotificationMessage(changes: any, operation: string): string {
  const teamInfo = changes.team_name || changes.department_name || 'General'
  
  switch (operation) {
    case 'create':
      return `New training activity "${changes.title}" has been created by ${changes.supervisor_name} for ${teamInfo}. Scheduled for ${formatDate(changes.scheduled_date)}.`
    
    case 'update':
      return `Training activity "${changes.title}" has been updated by ${changes.supervisor_name} for ${teamInfo}.`
    
    case 'delete':
      return `Training activity "${changes.title}" has been cancelled by ${changes.supervisor_name}.`
    
    default:
      return `Training activity "${changes.title}" - ${operation}`
  }
}

function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric', 
    year: 'numeric' 
  })
}

  const saveNotification = async (changes: any, operation: string, old_data: any) => {

    console.log('changes in data', changes)
    console.table(old_data)

 



    let title = operation == 'update' ? 'Training Update' : 'New Training' 


    // create a function that will dynamically generate message layout for training cahnges 


    // const response = await proxy!.$api.saveNotif(data)
    // if (!response.data.status) {
    //   throw new Error(response.data.error || 'Failed to save notification')
    // }
  }
  return {
    createEmptyTraining,
    getTeamMembers,
    getTrainings,
    prepareViewData,
    prepareEditData,
    saveTraining,
    saveNotification
  }
}