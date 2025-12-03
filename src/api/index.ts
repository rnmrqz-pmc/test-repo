import { App } from 'vue'
import axios from 'axios'
import type { AxiosResponse } from 'axios'
import { encodeBase64, decodeBase64 } from '@/utils/base64'
import { decrypt, encrypt } from '@/utils/encryptDecrypt'
import { paramsGenerator } from '@/utils/paramsGenerator'
import { useAlertStore } from '@/stores/alert'
import { CookieManager } from '@/utils/cookieManager'

// ---- Environment Variables ----
const API_KEY = import.meta.env.VITE_API_KEY as string
const BASE_API_LINK = import.meta.env.VITE_BASE_API as string

const base64Key = encodeBase64(API_KEY)

// ---- Axios Clients ----
const apiClient = axios.create({
  baseURL: `${BASE_API_LINK}/api`, 
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  }
})

// File upload client (uses multipart/form-data)
const fileClient = axios.create({
  baseURL: `${BASE_API_LINK}/api`,
  withCredentials: true, 
  headers: {
    'Content-Type': 'multipart/form-data',
  }
})

// ---- Request Interceptor ----
apiClient.interceptors.request.use(
  async (config) => {  
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// ---- Response Interceptor ----
apiClient.interceptors.response.use(
  (response) => {
    return Promise.resolve(response)
  },
  async (error) => {
    const alertStore = useAlertStore()
    
    if (error.response) {
      const { status } = error.response
      
      // Handle unauthorized or expired token
      if (status === 401 || status === 400) {
        const err = error.response.data
        
        if (err.error?.message) {
          if (err.error.message.includes('has expired') || 
              err.error.message.includes('Unauthenticated')) {
              
              CookieManager.deleteCookie('__SESSION');
              CookieManager.deleteCookie('_SessionInfo');
              CookieManager.deleteCookie('_VerifiedID');
            
            alert('Your session has expired. Please login again.')
            window.location.href = '/'
          }
        }
      }
      
      // Parse JSON error if present
      const jsonPart = error.response.data
      if (jsonPart) {
        const json = typeof jsonPart == 'string' ? JSON.parse(jsonPart) : jsonPart
        // console.log('JSON Error:', json)
        alertStore.showAlert('error', json.error, json.message, true)
        return Promise.reject(json)
      }
      
      return Promise.reject(error.response.data)
    }
    
    return Promise.reject(error)
  }
)

// ---- File Client Request Interceptor ----
fileClient.interceptors.request.use(
  async (config) => {    
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// ---- API Methods ----
const api = {
  // ---- Authentication ----
  async getStaging(payload: any): Promise<AxiosResponse<any>> {
    return apiClient.get<any>(`/auth/staging?${paramsGenerator(payload)}`)
  },
  
  async register(payload: any): Promise<AxiosResponse<any>> {
    return apiClient.put<any>('/auth/register', encrypt(payload))
  },
  
  async login(payload: any): Promise<AxiosResponse<any>> {
    return apiClient.post<any>(`/auth/login`, (payload.filters))
  },
  
  async logout(): Promise<AxiosResponse<any>> {
    // Backend will clear the HTTP-only cookie
    const response = await apiClient.post<any>('/auth/logout')
    
    return response
  },
  
  async changePassword(payload: any): Promise<AxiosResponse<any>> {
    return apiClient.post<any>('/auth/reset', encrypt(payload))
  },
  
  async check2FA(payload: any): Promise<AxiosResponse<any>> {
    return apiClient.post<any>('/auth/2fa/status', (payload))
  },
  
  async verify2FA(payload: any): Promise<AxiosResponse<any>> {
    return apiClient.post<any>('/auth/2fa/verify', (payload))
  },

  async generate2FA(payload: any): Promise<AxiosResponse<any>> {
    return apiClient.post<any>('/auth/2fa/generate', (payload))
  },

  async forgotPassword(payload: any): Promise<AxiosResponse<any>> {
    return apiClient.post<any>('/auth/forgot', encrypt(payload))
  },

  async checkResetToken (payload: any): Promise<AxiosResponse<any>> {
    return apiClient.get<any>('/auth/reset?token=' + payload, (payload))
  },

  // ---- Data Operations ----
  async viewTrainer(payload: any): Promise<AxiosResponse<any>> {
    return apiClient.get<any>(`/view/trainer?${paramsGenerator(payload)}`)
  },
  
  async getData(table: string, payload: any): Promise<AxiosResponse<any>> {
    return apiClient.get<any>(`/data/${table}?${paramsGenerator(payload)}`)
  },
  
  async saveData(table: string, payload: any): Promise<AxiosResponse<any>> {
    // const user: any = localStorage.getItem('user')
    const user: any = CookieManager.getCookie('__SESSION')
    const decryptedUser = decrypt(JSON.parse(user))
    payload.user_id = decryptedUser.ID
    return apiClient.post<any>(`/data/${table}/upsert`, encrypt(payload))
  },
  
 async changePass(payload: any): Promise<AxiosResponse<any>> {
    return apiClient.patch<any>('/auth/change-pass', encrypt(payload))
  },

  // ---- Procedures ----
  async callProcedure(payload: any): Promise<AxiosResponse<any>> {
    return apiClient.post<any>('/call/procedure', encrypt(payload))
  },

  // ---- File Uploads ----
  async uploadImg(payload: any): Promise<AxiosResponse<any>> {
    return fileClient.post<any>('/upload-image', (payload))
  },
  
  async uploadDoc(payload: any): Promise<AxiosResponse<any>> {
    return fileClient.post<any>('/upload-doc', (payload))
  },

  // ---- Email ----
    async sendMail(payload: any): Promise<AxiosResponse<any>> {
        return apiClient.post<any>('/email/send', encrypt(payload))
    },  
    
    async getNotif(payload: any): Promise<AxiosResponse<any>> {
        return apiClient.get<any>(`/notifications/trainer?${paramsGenerator(payload)}`)
    },
    async readNotif(payload: any): Promise<AxiosResponse<any>> {
        return apiClient.post<any>('/notifications/trainer', (payload))
    },
    async saveNotif(payload: any): Promise<AxiosResponse<any>> {
        return apiClient.post<any>('/notifications/create', encrypt(payload))
    },
}

// ---- Vue Plugin ----
export default {
  install: (app: App) => {
    app.config.globalProperties.$api = api
  }
}

export type ApiType = typeof api