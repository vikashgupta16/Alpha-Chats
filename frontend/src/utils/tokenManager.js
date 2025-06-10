// Token management utilities for better browser compatibility
class TokenManager {
    static TOKEN_KEY = 'alpha-chat-token';
    
    static setToken(token) {
        // Store in localStorage as fallback for browsers with cookie issues
        if (token) {
            localStorage.setItem(this.TOKEN_KEY, token);
            console.log('💾 [TokenManager] Token stored in localStorage');
        }
    }
    
    static getToken() {
        return localStorage.getItem(this.TOKEN_KEY);
    }
    
    static removeToken() {
        localStorage.removeItem(this.TOKEN_KEY);
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
