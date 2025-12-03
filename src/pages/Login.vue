<template>
  <div class="v-center background">
    <v-row class="d-flex justify-center pa-0 ma-0">
      <v-col class="pa-0 ma-0" cols="12" lg="4" md="6" sm="8" xs="10">
        <v-card class="pa-4 rounded --bg-main globalRadius" variant="flat">
          <v-card-text class="pa-0 text-white">
            <div class="head-border globalRadius">
              <img 
                class="d-flex justify-center mx-auto py-2" 
                style="width: 80%;"
                src="../assets/images/Basecamp.png" 
                alt="Basecamp Logo" 
              />
              <h2 class="text-center">Welcome Back!</h2>
            </div>

            <v-card class="pa-0 ma-0 px-5 mt-4 pt-4 --bg-main" variant="flat" rounded="lg">
              <form @submit.prevent="handleLogin">
                <div class="form-field">
                  <label class="text-white field-label">Username</label>
                  <v-text-field 
                    v-model="loginForm.email"
                    variant="outlined" 
                    color="black" 
                    class="white-input"    
                    placeholder="Enter your username"
                    :rules="validationRules.email"
                    :error-messages="loginErrors.email"
                    autocomplete="username"
                    @input="clearFieldError('email')"
                    @keydown.enter="handleLogin"
                  />
                </div>

                <div class="form-field">
                  <label class="text-white field-label">Password</label>
                  <v-text-field 
                    v-model="loginForm.password"
                    variant="outlined"
                    color="black"
                    class="white-input"
                    :type="loginForm.showPassword ? 'text' : 'password'"
                    :append-inner-icon="loginForm.showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                    @click:append-inner="loginForm.showPassword = !loginForm.showPassword"
                    placeholder="Enter your password"
                    :rules="validationRules.password"
                    :error-messages="loginErrors.password"
                    autocomplete="current-password"
                    @input="clearFieldError('password')"
                    @keydown.enter="handleLogin"
                  />
                </div>

                <!-- Remember Me & Forgot Password -->
                <div class=" align-center mb-4">
                  <!-- <v-checkbox 
                    v-model="loginForm.rememberMe" 
                    label="Remember me" 
                    color="white"
                    class="text-white"
                    density="compact"
                  /> -->
                  <p @click="openForgotPasswordDialog" class="text-center forgot">
                    <a>Forgot your password?</a>
                  </p>
                </div>

                <!-- Login Attempts Warning -->
                <v-alert 
                  v-if="loginAttempts >= 3"
                  type="warning"
                  variant="tonal"
                  class="mb-4"
                  density="compact"
                >
                  Too many failed attempts. Please wait {{ lockoutTimeRemaining }} seconds.
                </v-alert>

                <div class="d-flex justify-center pt-2 pb-3">
                  <v-btn 
                    @click="openSignupDialog"  
                    variant="outlined"
                    color="white" 
                    class="mx-1" 
                    width="120" 
                    rounded="pill"
                    :disabled="isLocked"
                  >
                    Sign up
                  </v-btn>
                  <v-btn 
                    type="submit"
                    class="mx-1" 
                    variant="elevated" 
                    color="white" 
                    width="120" 
                    rounded="pill" 
                    :disabled="!isLoginFormValid || busy || isLocked" 
                    :loading="busy"
                  >
                    Login
                  </v-btn>
                </div>
              </form>
            </v-card>
          </v-card-text>
        </v-card>                
      </v-col>
    </v-row>

    <!-- Enhanced Signup Dialog -->
    <v-dialog 
      v-model="signupDialog.isOpen" 
      max-width="700" 
      :persistent="true"
      scrollable
    >
      <v-card class="globalRadius"> 
        <v-card-title class="text-center pa-2 --bg-main text-white">
          <h2>Create Account</h2>
        </v-card-title>
        
        <v-card-text class="py-2 px-4 --bg-main">
          <v-overlay 
            v-model="signupDialog.loading"
            class="align-center justify-center" 
            contained
          >
            <v-progress-circular 
              indeterminate 
              size="64" 
              width="5" 
              class="text-primary"
            />
          </v-overlay>

          <div class="head-border pt-3 globalRadius mb-4">
            <img 
              class="d-flex justify-center mx-auto" 
              style="width: 68%;"
              src="../assets/images/Basecamp.png" 
              alt="Basecamp Logo" 
            />
          </div>


          <div>
            <div class="pt-4">
              <p class="text-white mb-3">Please enter your employee number to verify your identity:</p>
              
              <div class="form-field">
                <label class="text-white field-label">Employee Number</label>
                <v-text-field 
                  v-model="employeeQuery" 
                  type="number"
                  variant="outlined" 
                  color="black"
                  class="white-input" 
                  density="comfortable"
                  placeholder="Enter your employee number"
                  :readonly="employeeVerified"
                  :error-messages="signupErrors.employeeNo"
                  @input="clearFieldError('employeeNo')"
                />
              </div>
            </div>
               <form @submit.prevent="handleSignup">
                  <div class="">
                    <v-row class="pa-0 ma-0">
                      <v-col class="py-0 px-1 ma-0" cols="12" md="6">
                        <div class="form-field">
                          <label class="text-white field-label">Name</label>
                          <v-text-field 
                            v-model="signupForm.name"
                            :readonly="true"
                            variant="outlined"
                            color="black"
                            class="white-input"
                            density="comfortable"
                          />
                        </div>
                      </v-col>
                      <v-col class="py-0 px-1 ma-0" cols="12" md="6">
                        <div class="form-field">
                          <label class="text-white field-label">Email</label>
                          <v-text-field 
                            v-model="signupForm.email"
                            :readonly="true"
                            variant="outlined"
                            color="black"
                            class="white-input"
                            density="comfortable"
                          />
                        </div>
                      </v-col>
                    </v-row>

                    <v-row class="pa-0 ma-0">
                      <v-col class="py-0 px-1 ma-0" cols="12" md="6">
                        <div class="form-field">
                          <label class="text-white field-label">Team</label>
                          <v-text-field 
                            v-model="signupForm.team"
                            :readonly="true"
                            variant="outlined"
                            color="black"
                            class="white-input"
                            density="comfortable"
                          />
                        </div>
                      </v-col>
                      <v-col class="py-0 px-1 ma-0" cols="12" md="6">
                        <div class="form-field">
                          <label class="text-white field-label">Position</label>
                          <v-text-field 
                            v-model="signupForm.position"
                            :readonly="true"
                            variant="outlined"
                            color="black"
                            class="white-input"
                            density="comfortable"
                          />
                        </div>
                      </v-col>
                    </v-row>
                    
                    <div class="form-field py-0 px-1">
                      <label class="text-white field-label">Password</label>
                      <v-text-field 
                        v-model="signupForm.password"
                        variant="outlined"
                        color="black"
                        class="white-input"
                        density="comfortable"
                        :type="signupForm.showPassword ? 'text' : 'password'"
                        :append-inner-icon="signupForm.showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                        @click:append-inner="signupForm.showPassword = !signupForm.showPassword"
                        placeholder="Create a strong password"
                        :error-messages="signupErrors.password"
                        autocomplete="new-password"
                        @input="clearFieldError('password')"
                      />
                    </div>

                    <div class="form-field py-0 px-1">
                      <label class="text-white field-label">Confirm Password</label>
                      <v-text-field 
                        v-model="signupForm.confirmPassword"
                        variant="outlined"
                        color="black"
                        class="white-input"
                        density="comfortable"
                        :type="signupForm.showConfirmPassword ? 'text' : 'password'"
                        :append-inner-icon="signupForm.showConfirmPassword ? 'mdi-eye' : 'mdi-eye-off'"
                        @click:append-inner="signupForm.showConfirmPassword = !signupForm.showConfirmPassword"
                        placeholder="Confirm your password"
                        :error-messages="signupErrors.confirmPassword"
                        autocomplete="new-password"
                        @input="clearFieldError('confirmPassword')"
                      />
                    </div>

                    <!-- Enhanced Password Requirements -->
                    <div 
                      v-if="signupForm.password && !isPasswordValid" 
                      class="password-requirements text-black mb-4"
                    >
                      <p class="mb-2"><strong>Password Requirements:</strong></p>
                      <div class="requirements-grid">
                        <div 
                          v-for="(req, key) in passwordRequirements" 
                          :key="key"
                          class="requirement-item d-flex align-center"
                        >
                          <v-icon 
                            :color="req.valid ? 'success' : 'error'" 
                            size="small" 
                            class="mr-2"
                          >
                            {{ req.valid ? 'mdi-check-circle' : 'mdi-close-circle' }}
                          </v-icon>
                          <span :class="req.valid ? 'text-success' : 'text-error'">
                            {{ req.text }}
                          </span>
                        </div>
                      </div>
                    </div>

                    <!-- Terms and Conditions -->
                    <!-- <v-checkbox 
                      v-model="signupForm.acceptTerms"
                      color="white"
                      class="text-white mb-2"
                      density="compact"
                    >
                      <template v-slot:label>
                        <span class="text-white">
                          I agree to the 
                          <a @click.prevent="showTermsDialog = true" class="text-blue-300">
                            Terms and Conditions
                          </a>
                        </span>
                      </template>
                    </v-checkbox> -->
                  </div>

                  <div class="d-flex justify-center pb-2">
                    <v-btn 
                      @click="confirmDialog.status = true" 
                      variant="outlined" 
                      color="white" 
                      class="mx-1" 
                      width="120" 
                      rounded="pill"
                    >
                      Cancel
                    </v-btn>
                    <v-btn 
                      type="submit"
                      :disabled="!isSignupFormValid" 
                      :loading="signupDialog.loading"
                      class="mx-1" 
                      color="white"
                      width="120" 
                      rounded="pill"
                    >
                      Sign Up
                    </v-btn>
                  </div>
                </form>
          </div>
        </v-card-text>
      </v-card>
    </v-dialog>

    <!-- Enhanced Forgot Password Dialog -->
    <v-dialog 
      v-model="forgotPasswordDialog.isOpen" 
      max-width="500" 
      :persistent="true"
    >
      <v-card class="pa-3 globalRadius">
        <v-card-title class="text-center pa-0">
          <h2>Reset Password</h2>
        </v-card-title>
        <v-divider class="my-3" />
        
        <v-card-text>
          <p class="mb-4 text-body-2">
            Enter your email address and we'll send you a link to reset your password.
          </p>
          
          <div class="form-field">
            <label><strong>Email Address</strong></label>
            <v-text-field 
              v-model="forgotPasswordDialog.email" 
              variant="outlined" 
              color="black" 
              class="mt-2" 
              type="email"
              density="comfortable" 
              placeholder="Enter your email address"
              :error-messages="forgotPasswordDialog.error"
              :rules="[email_rule]"
              autocomplete="email"
              @input="forgotPasswordDialog.error = ''"
            />
          </div>

          <v-alert 
            v-if="forgotPasswordDialog.success"
            type="success"
            variant="tonal"
            class="mb-4"
            density="compact"
          >
            Password reset link has been sent to your email!
          </v-alert>
        </v-card-text>

        <v-card-actions class="justify-center pb-4">
          <v-btn 
            @click="closeForgotPasswordDialog" 
            variant="outlined" 
            color="black" 
            class="mx-1" 
            width="120" 
            rounded="pill"
            :disabled="forgotPasswordDialog.loading"
          >
            Cancel
          </v-btn>
          <v-btn 
            @click="handleForgotPassword"
            :loading="forgotPasswordDialog.loading"
            class="--bg-main text-white"  
            width="120" 
            rounded="pill"
            :disabled="!forgotPasswordDialog.email || (email_rule(forgotPasswordDialog.email)) != true"
          >
            Send Link
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <ConfirmDialog
      v-model="confirmDialog.status"
      title="Cancel"
      :type="'info'"
      cancelText="No"
      confirmText="Yes"
      message="Are you sure you want to cancel? All unsaved changes will be lost."
      @confirm="signupDialog.isOpen = false"
    />
    <!-- Terms and Conditions Dialog -->
    <v-dialog v-model="showTermsDialog" max-width="600" scrollable>
      <v-card>
        <v-card-title>Terms and Conditions</v-card-title>
        <v-divider />
        <v-card-text style="height: 400px;">
          <div class="terms-content">
            <h3>1. Acceptance of Terms</h3>
            <p>By creating an account, you agree to these terms and conditions...</p>
            
            <h3>2. Account Security</h3>
            <p>You are responsible for maintaining the security of your account...</p>
            
            <h3>3. Privacy Policy</h3>
            <p>Your privacy is important to us. Please review our privacy policy...</p>
            
            <!-- Add more terms as needed -->
          </div>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn @click="showTermsDialog = false" color="primary">Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, watch, onMounted, getCurrentInstance } from 'vue'
import { useAlertStore } from "@/stores/alert";
import { required_rule, email_rule } from "@/utils/rules";
import { useSessionStore } from '@/stores/session';
import { useRouter } from 'vue-router';
import { encrypt, decrypt } from '@/utils/encryptDecrypt';
import { debounce } from '@/utils/debounce';
import { useMXStore } from '@/stores/mx';
import ConfirmDialog from '@/components/common/ConfirmDialog.vue';
import { CookieManager } from '@/utils/cookieManager';


// Store instances
const alertStore = useAlertStore();
const session = useSessionStore();
const router = useRouter();
const mx = useMXStore();
const { proxy } = getCurrentInstance()!;

// Reactive data
const busy = ref(false);
const loginAttempts = ref(0);
const lockoutTime = ref(0);
const signupStep = ref(1);
const employeeQuery = ref('');
const employeeVerified = ref(false);
const showTermsDialog = ref(false);

// Login form state
const loginForm = ref({
  email: '',
  password: '',
  showPassword: false,
  rememberMe: false
});

// Signup form state
const signupForm = ref({
  ID: '',
  employeeNo: '',
  email: '',
  name: '',
  team: '',
  position: '',
  password: '',
  confirmPassword: '',
  showPassword: false,
  showConfirmPassword: false,
  acceptTerms: false
});

// Dialog states
const signupDialog = ref({
  isOpen: false,
  loading: false
});

const forgotPasswordDialog = ref({
  isOpen: false,
  loading: false,
  email: '',
  error: '',
  success: false
});
const confirmDialog = ref({
  status: false
});

// Error tracking
const loginErrors = ref<any>({
  email: '',
  password: ''
});

const signupErrors = ref<any>({
  employeeNo: '',
  password: '',
  confirmPassword: ''
});

// Validation rules
const validationRules = {
  email: [
    (v: string) => !!v || 'Email is required',
    (v: string) => /.+@.+\..+/.test(v) || 'Email must be valid'
  ],
  password: [
    (v: string) => !!v || 'Password is required',
    (v: string) => v.length >= 8 || 'Password must be at least 8 characters'
  ]
};

// Computed properties
const isLoginFormValid = computed(() => {
  return loginForm.value.email && 
         loginForm.value.password && 
         /.+@.+\..+/.test(loginForm.value.email);
});

const isSignupFormValid = computed(() => {
  return signupForm.value.password &&
         signupForm.value.confirmPassword &&
         signupForm.value.password === signupForm.value.confirmPassword &&
         isPasswordValid.value &&
        //  signupForm.value.acceptTerms &&
         employeeVerified.value;
});

const passwordRequirements = computed(() => {
  const password = signupForm.value.password;
  return {
    length: {
      valid: password.length >= 8,
      text: 'At least 8 characters long'
    },
    upper: {
      valid: /[A-Z]/.test(password),
      text: 'At least one uppercase letter'
    },
    lower: {
      valid: /[a-z]/.test(password),
      text: 'At least one lowercase letter'
    },
    number: {
      valid: /\d/.test(password),
      text: 'At least one number'
    },
    special: {
      valid: /[@$!%*?&]/.test(password),
      text: 'At least one special character (@$!%*?&)'
    }
  };
});

const isPasswordValid = computed(() => {
  return Object.values(passwordRequirements.value).every(req => req.valid);
});

const isLocked = computed(() => {
  return loginAttempts.value >= 5 && lockoutTime.value > 0;
});

const lockoutTimeRemaining = computed(() => {
  return Math.ceil(lockoutTime.value / 1000);
});

// Methods
const clearFieldError = (field: string) => {
  if (loginErrors.value[field]) {
    loginErrors.value[field] = '';
  }
  if (signupErrors.value[field]) {
    if(signupErrors.value.password == signupErrors.value.confirmPassword) {
      signupErrors.value.password = '';
      signupErrors.value.confirmPassword = '';
    }

    // signupErrors.value[field] = '';
  }
};

const handleLogin = async (state?: boolean) => {
  if (!isLoginFormValid.value || busy.value || isLocked.value) return;

  busy.value = true;
  
  try {
    const data = {
      filters: {
        email: loginForm.value.email,
        password: loginForm.value.password
      }
    };


    const promise = new Promise((resolve, reject) => {
        proxy!.$api.login(data).then(response => resolve(response)).catch(error => reject(error));
    });
    const res : any = await promise;
    if (res.data.status) {
      // Store session data
      let decryptedData = decrypt(res.data.data);      
      CookieManager.setCookie('__SESSION', JSON.stringify(res.data.data), 2);
      CookieManager.setCookie('_SendThrottle', String(0), 2);
      let params = {
        filters: {
          trainerID: decryptedData.ID
        }
      }
      const promise = new Promise((resolve, reject) => {
          proxy!.$api.getData('trainer_details', params).then(response => resolve(response)).catch(error => reject(error));
      });
      const usr_dt : any = await promise;
      if(usr_dt.data.status){
        let decrypted = decrypt(usr_dt.data.data)
        if(decrypted.length > 0){     
            delete decrypted[0].bio
            delete decrypted[0].professional
            delete decrypted[0].academic
            delete decrypted[0].license
            delete decrypted[0].language
            delete decrypted[0].documents
            CookieManager.setCookie('_SessionInfo', JSON.stringify( encrypt(decrypted)) , 2);
        }
      }
      
      // Remember me functionality
      if (loginForm.value.rememberMe) {
        localStorage.setItem('rememberedEmail', loginForm.value.email);
      } else {
        localStorage.removeItem('rememberedEmail');
      }
      
      if(state != false){
        alertStore.showAlert('success', '', 'Login successful!', true);
      }
      
      // Reset login attempts
      loginAttempts.value = 0;
      
      // Redirect based on role
      const roleRoutes : any = {
        admin: '/admin',
        manager: '/manager',
        supervisor: '/supervisor',
        trainer: '/trainer'
      };
      
      setTimeout(() => {
        router.go(0)
      }, 1500);

      // await new Promise<void>(async (resolve, reject) => {
      //   await check2fa().then(() => resolve()).catch(error => reject(error));
      // });
   
      
    } else {
      throw new Error(res.data.message || 'Login failed');
    }
  } catch (error) {    
    alertStore.showAlert('error', 'Login Failed', (error as any).message, true);
  } finally {
    busy.value = false;
  }
};

const handleSignup = async () => {
  if (!isSignupFormValid.value || signupDialog.value.loading) return;

  signupDialog.value.loading = true;
  
  try {
    signupForm.value.ID = '';
    const data = {
      ...signupForm.value,
      employeeNo: employeeQuery.value
    };

    delete (data as any).name
    delete (data as any).acceptTerms
    delete (data as any).confirmPassword
    delete (data as any).showConfirmPassword
    delete (data as any).showPassword
    delete (data as any).created_by
    delete (data as any).created_on
    
    // Simulate API call - replace with actual API
    const promise = new Promise((resolve, reject) => {
        proxy!.$api.register(data).then(response => resolve(response)).catch(error => reject(error));
    });
    const response : any = await promise;
    
    if (response.data.status) {
      alertStore.showAlert('success', 'Success', 'Account created successfully!', true);
      
      // Auto-login after successful registration
      loginForm.value.email = signupForm.value.email;
      loginForm.value.password = signupForm.value.password;
      
      closeSignupDialog();
      await handleLogin(false);
    } else {
      throw new Error(response.message || 'Registration failed');
    }
  } catch (error) {
    alertStore.showAlert('error', 'Registration Failed', (error as any).message, true);
  } finally {
    signupDialog.value.loading = false;
  }
};
// async function check2fa() {
//   const user = decrypt(JSON.parse(CookieManager.getCookie('__SESSION') as any));
//   const user_auth = (CookieManager.getCookie('_VerifiedID') as any);
//     let data = {
//         userID: (user as any).ID,
//         UUID: mx.getDeviceId(),
//         USER_AGENT: mx.getUserAgent()
//     }

//     if((user_auth as any) != 1){

//       const promise = new Promise((resolve, reject) => {
//           proxy!.$api.check2FA(data).then(response => resolve(response)).catch(error => reject(error));
//       });
//       const res : any = await promise;
//       // const res = await proxy!.$api.check2FA(data)
//       setTimeout(() => {
//         if(res.data.status === false){
//           router.push('/2fa_auth')
//           router.push({ path: '/2fa_auth' })
//           // router.go(0)
//         }else{
//           router.push(`/${user.role}`)
//           router.go(0)
//         }
//       }, 1200);
//     }

// }
const handleForgotPassword = async () => {
  if (!forgotPasswordDialog.value.email || forgotPasswordDialog.value.loading) return;

  forgotPasswordDialog.value.loading = true;
  forgotPasswordDialog.value.error = '';
  
  try {
    const payload = { 
      email: forgotPasswordDialog.value.email,
      datetime: new Date().toLocaleDateString('en-CA', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false }),
      appUrl: mx.originUrl
    };
    
    forgotPasswordDialog.value.loading = true

    const response = await proxy!.$api.forgotPassword( payload );
     if(response.data.status){
        forgotPasswordDialog.value.loading = false
        alertStore.showAlert('success', 'Success', 'Password reset link sent successfully!', true);
        closeForgotPasswordDialog();
    }  else {
      throw new Error(response.data.message || 'Failed to send reset link');
    }
  } catch (error) {
    forgotPasswordDialog.value.error = (error as any).message;
  } finally {
    forgotPasswordDialog.value.loading = false;
  }
};

const verifyEmployee = async (employeeNo: string) => {
  if (!employeeNo) {
    employeeVerified.value = false;
    return;
  }

  try {
    signupDialog.value.loading = true;
    
    let data = {
      filters: {
        employeeNo: employeeQuery.value
      }
    }
    const res = await proxy!.$api.getStaging(data);

    
    if (res.data.status) {
      let decrypted = decrypt(res.data.data);
      decrypted.name = `${decrypted.last_name}, ${decrypted.first_name} ${decrypted.middle_name?.substring(0, 1) || ''}`;
      Object.assign(signupForm.value, decrypted);
      employeeVerified.value = true;
      signupErrors.value.employeeNo = '';
    } else {
      employeeVerified.value = false;
      alertStore.showAlert('error', 'Error', res.data.message || 'Employee not found', true);
      signupErrors.value.employeeNo = res.data.message || 'Employee not found';
    }
  } catch (error) {
    employeeVerified.value = false;
    signupErrors.value.employeeNo = (error as any).message || 'Error verifying employee';
  } finally {
    signupDialog.value.loading = false;
  }
};

// Dialog controls
const openSignupDialog = () => {
  signupDialog.value.isOpen = true;
  resetSignupForm();
  signupStep.value = 1;
};

const closeSignupDialog = () => {
  signupDialog.value.isOpen = false;
  resetSignupForm();
};

const openForgotPasswordDialog = () => {
  forgotPasswordDialog.value.isOpen = true;
};

const closeForgotPasswordDialog = () => {
  forgotPasswordDialog.value.isOpen = false;
  forgotPasswordDialog.value.email = '';
  forgotPasswordDialog.value.error = '';
  forgotPasswordDialog.value.success = false;
};

const nextStep = () => {
  if (employeeVerified.value) {
    signupStep.value = 2;
  }
};

const previousStep = () => {
  signupStep.value = 1;
};

const resetSignupForm = () => {
  Object.assign(signupForm.value, {
    employeeNo: '',
    email: '',
    name: '',
    team: '',
    position: '',
    password: '',
    confirmPassword: '',
    showPassword: false,
    showConfirmPassword: false,
    acceptTerms: false
  });
  employeeQuery.value = '';
  employeeVerified.value = false;
  signupStep.value = 1;
};

// Watchers
const debouncedVerifyEmployee = debounce(verifyEmployee, 1000);
watch(employeeQuery, (newValue) => {
  if (newValue) {
    debouncedVerifyEmployee(newValue);
  } else {
    employeeVerified.value = false;
  }
});

// Password confirmation validation
watch([() => signupForm.value.password, () => signupForm.value.confirmPassword], () => {
  if ( signupForm.value.password !== signupForm.value.confirmPassword && signupForm.value.confirmPassword) {
    signupErrors.value.confirmPassword = 'Passwords do not match';
  } else {
    signupErrors.value.confirmPassword = '';
  }
});

// Initialize component
onMounted(() => {
  // Load remembered email
  const rememberedEmail = localStorage.getItem('rememberedEmail');
  if (rememberedEmail) {
    loginForm.value.email = rememberedEmail;
    loginForm.value.rememberMe = true;
  }
});

</script>

<style scoped>
.v-center {
  display: flex; 
  place-items: center;
  min-height: 100vh;
  min-width: 100vw;
  /* background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); */
}

.forgot {
  text-decoration: underline;
  cursor: pointer;
  color: white;
  font-size: 0.875rem;
  transition: opacity 0.2s ease;
}

.forgot:hover {
  opacity: 0.8;
}

.head-border {
  border: 4px solid #ffffff !important;
  border-radius: 8px;
  padding-bottom: 10px;
  background: rgba(255, 255, 255, 0.05);
}

.password-requirements {
  font-size: 13px;
  background: rgb(255, 255, 255);
  border-radius: 8px;
  padding: 12px;
  border-left: 4px solid #ffa726;
}

.requirements-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
  margin-top: 8px;
}

.requirement-item {
  font-size: 0.75rem;
}

.form-field {
  margin-bottom: 0px;
}

.field-label {
  display: block;
  margin-bottom: 4px;
  font-weight: 600;
  font-size: 0.875rem;
}

.employee-info {
  border-radius: 8px;
  border-left: 4px solid #4caf50;
}

.terms-content h3 {
  color: #1976d2;
  margin: 16px 0 8px 0;
  font-size: 1.1rem;
}

.terms-content p {
  margin-bottom: 12px;
  line-height: 1.5;
  color: #666;
}

/* Animation classes */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

.slide-up-enter-active, .slide-up-leave-active {
  transition: all 0.3s ease;
}

.slide-up-enter-from {
  transform: translateY(30px);
  opacity: 0;
}

.slide-up-leave-to {
  transform: translateY(-30px);
  opacity: 0;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .requirements-grid {
    grid-template-columns: 1fr;
  }
  
  .v-center {
    padding: 16px;
  }
}

/* Loading states */
.loading-overlay {
  backdrop-filter: blur(2px);
}

/* Focus states for accessibility */
.v-text-field:focus-within {
  transform: translateY(-1px);
  transition: transform 0.2s ease;
}

/* Button hover effects */
.v-btn {
  transition: all 0.2s ease;
}

.v-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

/* Custom checkbox styling */
.v-checkbox .v-selection-control__input {
  border-radius: 4px;
}

/* Alert customizations */
.v-alert {
  border-radius: 8px;
  font-size: 0.875rem;
}

/* Stepper customizations */
.v-stepper-header {
  background: transparent !important;
  box-shadow: none !important;
}

.v-stepper-item {
  color: rgba(255, 255, 255, 0.7) !important;
}

.v-stepper-item--complete {
  color: white !important;
}
</style>

<!-- Global styles for input fields -->
<style>

.white-input .v-field:hover {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.white-input .v-field--focused {
  box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.3);
}

.white-input .v-field__input {
  color: #333 !important;
  font-weight: 500;
}

.white-input .v-field__input::placeholder {
  color: #888 !important;
  opacity: 0.8;
}

.white-input .v-field__append-inner {
  color: #666 !important;
}

/* Enhanced error states */
.white-input .v-field--error {
  border: 1px solid #f44336 !important;
}

/* Success states */
.white-input .v-field--valid {
  border: 1px solid #4caf50 !important;
}

/* Loading states */
.v-overlay--contained {
  border-radius: 8px;
}


/* Stepper enhancements */
.v-stepper-window {
  background: transparent !important;
}

/* Button loading states */
.v-btn--loading {
  pointer-events: none;
}

/* Scrollbar styling for dialog content */
.v-card-text::-webkit-scrollbar {
  width: 6px;
}

.v-card-text::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 3px;
}

.v-card-text::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.3);
  border-radius: 3px;
}

.v-card-text::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.5);
}

/* Enhanced transitions */
.v-dialog-transition-enter-active,
.v-dialog-transition-leave-active {
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
}

.v-dialog-transition-enter-from {
  transform: scale(0.9);
  opacity: 0;
}

.v-dialog-transition-leave-to {
  transform: scale(1.1);
  opacity: 0;
}

/* Mobile responsiveness */
@media (max-width: 600px) {
  .v-dialog {
    margin: 16px !important;
  }
  
  .v-dialog .v-card {
    margin: 0;
  }
}

/* Dark theme support */
@media (prefers-color-scheme: dark) {
  .terms-content h3 {
    color: #90caf9;
  }
  
  .terms-content p {
    color: #bbb;
  }
}

/* Print styles */
@media print {
  .v-center {
    display: none;
  }
}

/* Accessibility enhancements */
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}

/* High contrast mode */
@media (prefers-contrast: high) {
  .white-input .v-field {
    border: 2px solid #000 !important;
  }
  
  .v-btn {
    border: 2px solid #000 !important;
  }
}

/* Focus visible for keyboard navigation */
.v-btn:focus-visible {
  outline: 3px solid #fff;
  outline-offset: 2px;
}

.v-text-field:focus-visible .v-field {
  outline: 3px solid #fff;
  outline-offset: 2px;
}
</style>
