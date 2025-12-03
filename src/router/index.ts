import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import { useSessionStore } from '@/stores/session'
// import { getCurrentInstance } from 'vue';
import { useMXStore } from '@/stores/mx';
import axios from 'axios'
import { encrypt } from '@/utils/encryptDecrypt'
import { CookieManager } from '@/utils/cookieManager';


const BASE_PATH = import.meta.env.VITE_BASE_PATH as string
const BASE_API_LINK = import.meta.env.VITE_BASE_API as string

const apiClient = axios.create({
  baseURL: `${BASE_API_LINK}/api`, 
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  }
})

// ---- Route Definitions ----
const routes: RouteRecordRaw[] = [
  { path: '/test', name: 'test', component: () => import('../pages/test.vue'), 
    meta: { requiresAuth: false } 
  },
  { path: '/', name: 'Root', redirect: '/login',
    meta: { requiresAuth: false } 
  },
  // Auth Routes  
  { path: '/login', name: 'Login', component: () => import('../pages/Login.vue'), 
    meta: { requiresAuth: false } 
  },
  { path: '/2fa_auth', name: '2fa', component: () => import('../pages/2FA.vue'), 
    meta: { requiresAuth: false } 
  },
  { path: "/password-reset/:token", name: "PasswordReset", component: () => import("@/components/auth/ResetPassword.vue"),
    meta: { requiresAuth: false }, props: true
  },

  // --- Trainer Routes ---
  { path: '/trainer', name: 'Trainer_Dashboard', component: () => import('../pages/trainer/Dashboard.vue'),
    meta: { requiresAuth: true, role: 'trainer' }
  },
  { path: '/trainer/trainings', name: 'Trainer_Trainings', component: () => import('../pages/trainer/Training.vue'),
    meta: { requiresAuth: true, role: 'trainer' }
  },
  { path: '/trainer/calendar', name: 'Trainer_Calendar', component: () => import('../pages/trainer/Calendar.vue'),
    meta: { requiresAuth: true, role: 'trainer' }
  },
  { path: '/trainer/performance', name: 'Trainer_Performance', component: () => import('../pages/trainer/Performance.vue'),
    meta: { requiresAuth: true, role: 'trainer' }
  },
  { path: '/trainer/profile', name: 'Trainer_Profile', component: () => import('../pages/trainer/Profile.vue'),
    meta: { requiresAuth: true, role: 'trainer' }
  },

  // --- Supervisor Routes ---
  { path: '/supervisor', name: 'Supervisor_Dashboard', component: () => import('../pages/manager/Dashboard.vue'),
    meta: { requiresAuth: true, role: 'supervisor' }
  },
  { path: '/supervisor/trainers', name: 'Supervisor_Trainers', component: () => import('../pages/manager/TrainerProfile.vue'),
    meta: { requiresAuth: true, role: 'supervisor' }
  },
  { path: '/supervisor/trainings', name: 'Supervisor_Trainings', component: () => import('../pages/manager/Training.vue'),
    meta: { requiresAuth: true, role: 'supervisor' }
  },
  { path: '/supervisor/calendar', name: 'Supervisor_Calendar', component: () => import('../pages/manager/Calendar.vue'),
    meta: { requiresAuth: true, role: 'supervisor' }
  },
  { path: '/supervisor/trainer_availability', name: 'Supervisor_Trainer_Availability', component: () => import('../pages/manager/TrainerAvailability.vue'),
    meta: { requiresAuth: true, role: 'supervisor' }
  },
  { path: '/supervisor/performance_review', name: 'Supervisor_Performance_Review', component: () => import('../pages/manager/PerformanceReview.vue'),
    meta: { requiresAuth: true, role: 'supervisor' }
  },
  { path: '/supervisor/reports', name: 'Supervisor_Reports', component: () => import('../pages/manager/Report.vue'),
    meta: { requiresAuth: true, role: 'supervisor' }
  },
  { path: '/supervisor/profile', name: 'Supervisor_Profile', component: () => import('../pages/manager/Profile.vue'),
    meta: { requiresAuth: true, role: 'supervisor' }
  },

  // --- Manager Routes ---
  { path: '/manager', name: 'Manager_Dashboard', component: () => import('../pages/manager/Dashboard.vue'),
    meta: { requiresAuth: true, role: 'manager' }
  },
  { path: '/manager/trainers', name: 'Manager_Trainers', component: () => import('../pages/manager/TrainerProfile.vue'),
    meta: { requiresAuth: true, role: 'manager' }
  },
  { path: '/manager/trainings', name: 'Manager_Trainings', component: () => import('../pages/manager/Training.vue'),
    meta: { requiresAuth: true, role: 'manager' }
  },
  { path: '/manager/calendar', name: 'Manager_Calendar', component: () => import('../pages/manager/Calendar.vue'),
    meta: { requiresAuth: true, role: 'manager' }
  },
  { path: '/manager/trainer_availability', name: 'Manager_Trainer_Availability', component: () => import('../pages/manager/TrainerAvailability.vue'),
    meta: { requiresAuth: true, role: 'manager' }
  },
  { path: '/manager/performance_review', name: 'Manager_Performance_Review', component: () => import('../pages/manager/PerformanceReview.vue'),
    meta: { requiresAuth: true, role: 'manager' }
  },
  { path: '/manager/reports', name: 'Manager_Reports', component: () => import('../pages/manager/Report.vue'),
    meta: { requiresAuth: true, role: 'manager' }
  },
  { path: '/manager/profile', name: 'Manager_Profile', component: () => import('../pages/manager/Profile.vue'),
    meta: { requiresAuth: true, role: 'manager' }
  },

  // --- Admin Routes ---
  { path: '/admin', name: 'Admin_Dashboard', component: () => import('../pages/manager/Dashboard.vue'),
    meta: { requiresAuth: true, role: 'admin' }
  },
  { path: '/admin/trainers', name: 'Admin_Trainers', component: () => import('../pages/manager/TrainerProfile.vue'),
    meta: { requiresAuth: true, role: 'admin' }
  },
  { path: '/admin/trainings', name: 'Admin_Trainings', component: () => import('../pages/manager/Training.vue'),
    meta: { requiresAuth: true, role: 'admin' }
  },
  { path: '/admin/calendar', name: 'Admin_Calendar', component: () => import('../pages/manager/Calendar.vue'),
    meta: { requiresAuth: true, role: 'admin' }
  },
  { path: '/admin/trainer_availability', name: 'Admin_Trainer_Availability', component: () => import('../pages/manager/TrainerAvailability.vue'),
    meta: { requiresAuth: true, role: 'admin' }
  },
  { path: '/admin/performance_review', name: 'Admin_Performance_Review', component: () => import('../pages/manager/PerformanceReview.vue'),
    meta: { requiresAuth: true, role: 'admin' }
  },
  { path: '/admin/reports', name: 'Admin_Reports', component: () => import('../pages/manager/Report.vue'),
    meta: { requiresAuth: true, role: 'admin' }
  },
  { path: '/admin/profile', name: 'Admin_Profile', component: () => import('../pages/manager/Profile.vue'),
    meta: { requiresAuth: true, role: 'admin' }
  },

]



// ---- Create Router Instance ----
const router = createRouter({
  history: createWebHistory(`${BASE_PATH}`),
  routes,
})


const getFreshSession = () => {
  return {
    auth: CookieManager.getCookie('_VerifiedID'), // or however you read it
  }
}

// Re-read session at the start of each navigation
const currentSession = getFreshSession()


// ---- Navigation Guards ----
// Handles authentication, 2FA, and role-based access before each route change
router.beforeEach(async (to, from, next) => {
  const session = useSessionStore()
  const mx = useMXStore();

  const isLoggedIn = !!session.user

  // Restrict access to protected routes
  if (!isLoggedIn && (to.meta.requiresAuth || to.name === '2fa')) {
    return next('/login')
  }

  // Redirect root path to login if not logged in
  if (!isLoggedIn && to.path === '/') {
    return next('/login')
  }

  // Manage 2FA and role-based redirection
  if (isLoggedIn) {
    // 2FA is complete, but user is trying to access 2FA page
    if (session.auth != 'null' && to.name === '2fa') {
      return next('/')
    }

    // 2FA not complete, redirect to 2FA page
    if (currentSession.auth == 'null' && to.name !== '2fa') {
      return next({ name: '2fa' })
    }

    // 2FA is complete, but user is trying to access login page
    if (currentSession.auth != 'null' && session.user) {
      let data = {
        userID: (session.user as any).ID,
        UUID: mx.getDeviceId(),
        USER_AGENT: mx.getUserAgent()
      }
      
      const promise = await new Promise((resolve, reject) => {
        apiClient.post<any>('/auth/2fa/status', encrypt(data))
          .then(response => {
            resolve(response)
          })
          .catch(error => {
            if (error.response.status === 500 && error.response.data.error.code === "token_could_not_parse") {
              CookieManager.deleteCookie('__SESSION');
              CookieManager.deleteCookie('_SessionInfo');
              CookieManager.deleteCookie('_VerifiedID');
              alert('Your session has expired. Please login again.')
              window.location.href = '/'
              return
            }
            return reject(error)
          })
      })

      if ((promise as any).data.status === false) {
        // Only redirect if not already on 2fa page
        if (to.name !== '2fa') {
          return next({ name: '2fa' })
        }
        return next() // Allow navigation if already on 2fa
      } else {
        const targetRoute = `/${session.user.role}`        
        if (!to.path.startsWith(targetRoute)) {
          return next(targetRoute)
        }
        return next()
      }
    }

    // Redirect from login/password reset/root to role-based route
    if (to.path === '/login' || to.name === 'PasswordReset' || to.path === '/') {
      return next(`/${session.user.role}`)
    }

    // Prevent access to other roles’ routes
    if (to.meta.requiresAuth && to.meta.role && to.meta.role !== session.user.role) {
      return next('/')
    }
  }

  // Allow navigation to proceed
  next()
})



export default router
