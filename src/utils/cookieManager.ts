// utils/cookieManager.ts
export class CookieManager {
  /**
   * Set a cookie with expiration time
   * @param name - Cookie name
   * @param value - Cookie value
   * @param hours - Validity in hours (default: 1 hour)
   * @param options - Additional cookie options
   */
  static setCookie(
    name: string, 
    value: string, 
    hours: number = 1,
    options: {
      path?: string;
      domain?: string;
      secure?: boolean;
      sameSite?: 'Strict' | 'Lax' | 'None';
    } = {}
  ): void {
    const date = new Date();
    date.setTime(date.getTime() + (hours * 60 * 60 * 1000));
    
    let cookieString = `${encodeURIComponent(name)}=${encodeURIComponent(value)}`;
    cookieString += `;expires=${date.toUTCString()}`;
    cookieString += `;path=${options.path || '/'}`;
    
    if (options.domain) {
      cookieString += `;domain=${options.domain}`;
    }
    
    if (options.secure !== false) {
      cookieString += ';Secure'; // Only send over HTTPS
    }
    
    cookieString += `;SameSite=${options.sameSite || 'Strict'}`;
    
    document.cookie = cookieString;
  }

  /**
   * Get cookie value by name
   * @param name - Cookie name
   * @returns Cookie value or null if not found/expired
   */
  static getCookie(name: string): string | null {
    const nameEQ = `${encodeURIComponent(name)}=`;
    const cookies = document.cookie.split(';');
    
    for (let cookie of cookies) {
      cookie = cookie.trim();
      if (cookie.indexOf(nameEQ) === 0) {
        return decodeURIComponent(cookie.substring(nameEQ.length));
      }
    }
    return null;
  }

  /**
   * Delete a cookie
   * @param name - Cookie name
   * @param options - Should match the options used when setting
   */
  static deleteCookie(
    name: string,
    options: {
      path?: string;
      domain?: string;
    } = {}
  ): void {
    let cookieString = `${encodeURIComponent(name)}=`;
    cookieString += ';expires=Thu, 01 Jan 1970 00:00:00 UTC';
    cookieString += `;path=${options.path || '/'}`;
    
    if (options.domain) {
      cookieString += `;domain=${options.domain}`;
    }
    
    document.cookie = cookieString;
  }

  /**
   * Check if cookie exists and is valid
   * @param name - Cookie name
   */
  static exists(name: string): boolean {
    return this.getCookie(name) !== null;
  }

  /**
   * Get all cookies as an object
   */
  static getAllCookies(): Record<string, string> {
    const cookies: Record<string, string> = {};
    const cookieArray = document.cookie.split(';');
    
    for (const cookie of cookieArray) {
      const [name, value] = cookie.trim().split('=');
      if (name && value) {
        cookies[decodeURIComponent(name)] = decodeURIComponent(value);
      }
    }
    
    return cookies;
  }
}