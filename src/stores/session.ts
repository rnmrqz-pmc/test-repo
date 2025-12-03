

// ===============================
// Session Store (Pinia)
// ===============================
// This file contains the definition of the session store which is used to store information about the current user.
// The store is used to store the user's id, name, email and other relevant information in cookies.
// The store is used by the entire application to get or set the user's information.
// ===============================


import { defineStore } from "pinia";
import { decrypt, encrypt } from "@/utils/encryptDecrypt";
import { CookieManager } from '@/utils/cookieManager';

export interface User {
  id: number;
  name: string;
  email: string;
}

export interface SessionName {
  name: string
}

export const useSessionStore = defineStore("session", {
  state: () => <any>({
    user: (() => {
      const storedUser = CookieManager.getCookie('__SESSION');
      return storedUser ? decrypt(JSON.parse(storedUser) as User) : null;
    })(),
    details: (() => {
      const storedDetails = CookieManager.getCookie('_SessionInfo');
      if(!storedDetails){
        return null
      }
      
      let data = decrypt(JSON.parse(storedDetails as any))
      // data[0].academic = JSON.parse(data[0].academic)
      // data[0].professional = JSON.parse(data[0].professional)
      // data[0].language = JSON.parse(data[0].language)
      // data[0].license = JSON.parse(data[0].license)
      // data[0].picture = JSON.parse(data[0].picture)
      return data
    })(),    
    auth: CookieManager.getCookie('_VerifiedID') || "null",
    auth_token: CookieManager.getCookie('__TOKEN') || "null",
  }),
  actions: {
    setUser(user: User) {
      this.user = user;
      CookieManager.setCookie('__SESSION', JSON.stringify((user)), 2);
    },
    setDetails(details: any) {
      CookieManager.setCookie('_SessionInfo', JSON.stringify(encrypt([details])), 2);
    },
    logout() {
      this.user = null;
      this.details = null;
      this.auth = 'null'
      CookieManager.deleteCookie('__SESSION');
      CookieManager.deleteCookie('_SessionInfo');
      CookieManager.deleteCookie('_VerifiedID');
    },
    getUser() {
      return this.user;
    },
    setAuth(auth: any){
      this.auth = String(auth)
      CookieManager.setCookie('_VerifiedID', String(auth), 2);
    },
    setAuthToken(auth_token: any){
      // this.auth_token = auth_token
      CookieManager.setCookie('__TOKEN', String(auth_token), 2);
    }
  },
});
