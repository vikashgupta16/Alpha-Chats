// Token management utilities for better browser compatibility
class TokenManager {
    static TOKEN_KEY = 'authToken'; // Use same key as AuthManager
    
    static setToken(token) {
        // Store in localStorage as fallback for browsers with cookie issues
        if (token) {
            localStorage.setItem(this.TOKEN_KEY, token);
            console.log('💾 [TokenManager] Token stored in localStorage');
        }
    }
    
    static getToken() {
        // First try localStorage
        let token = localStorage.getItem(this.TOKEN_KEY);
        
        // If not found, try cookies as backup
        if (!token) {
            const cookies = document.cookie.split(';');
            for (let cookie of cookies) {
                const [name, value] = cookie.trim().split('=');
                if (name === 'token' || name === 'authToken') {
                    token = value;
                    break;
                }
            }
        }
        
        return token;
    }
      static removeToken() {
        localStorage.removeItem(this.TOKEN_KEY);
        // Also clear old token key for compatibility
        localStorage.removeItem('alpha-chat-token');
        console.log('🗑️ [TokenManager] Token removed from localStorage');
    }
    
    static hasToken() {
        return !!this.getToken();
    }
    
    // Add Authorization header to requests if cookies might not work
    static addAuthHeader(config = {}) {
        const token = this.getToken();
        if (token) {
            config.headers = config.headers || {};
            config.headers['Authorization'] = `Bearer ${token}`;
            console.log('🔑 [TokenManager] Added Authorization header to request');
        }
        return config;
    }
}

export default TokenManager;
