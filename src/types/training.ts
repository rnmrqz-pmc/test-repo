
// types/training.ts
export interface User {
  role: string
  team: string
}

export interface TeamMember {
  ID: number
  name: string
}

export interface TrainingData {
  ID: string
  title: string
  location_type: string
  location_details: string
  start_date: string
  end_date: string
  start_time: string
  end_time: string
  audience: string
  participants: number
  objectives: string
  training_status: string
  training_hours: number
  trainers: number[] | string
  training_type: string
  others: string
  training_source: string
  training_source_others: string
  feedback_link: string
  method: string
  attachments: any
  link: string
  links: string[]
  images: any[]
  status?: number
  proof_link: string
}

export interface DialogState {
  main: {
    status: boolean
    busy: boolean
    data: TrainingData
    copy: TrainingData
  }
  view: {
    status: boolean
    data: any
  }
  complete: {
    status: boolean
    data: any
    images: File[]
    uploaded: any[]
    proof_link: string
  }
  cancel: {
    status: boolean
  }
}