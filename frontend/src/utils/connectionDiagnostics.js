// Connection diagnostics for browser compatibility issues
import { getBrowserInfo, checkNetworkConnectivity } from './browserDetection.js';

export class ConnectionDiagnostics {
  constructor() {
    this.browser = getBrowserInfo();
    this.diagnostics = {
      networkConnectivity: false,
      socketIOSupport: false,
      cookiesEnabled: false,
      corsSupport: false,
      webSocketSupport: false,
      pollingSupport: false
    };
  }

  async runDiagnostics() {
    console.log('🔍 Running connection diagnostics for', this.browser.name);
    
    // Test network connectivity
    this.diagnostics.networkConnectivity = await checkNetworkConnectivity();
    
    // Test cookies
    this.diagnostics.cookiesEnabled = this.testCookies();
    
    // Test WebSocket support
    this.diagnostics.webSocketSupport = this.testWebSocket();
    
    // Test CORS support
    this.diagnostics.corsSupport = this.testCORS();
    
    // Test polling support
    this.diagnostics.pollingSupport = this.testPolling();
    
    // Overall Socket.IO support
    this.diagnostics.socketIOSupport = this.diagnostics.networkConnectivity && 
                                       this.diagnostics.cookiesEnabled && 
                                       (this.diagnostics.webSocketSupport || this.diagnostics.pollingSupport);
    
    return this.generateReport();
  }

  testCookies() {
    try {
      document.cookie = "test=1; SameSite=None; Secure";
      const cookieEnabled = document.cookie.indexOf("test=1") !== -1;
      // Clean up test cookie
      document.cookie = "test=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      return cookieEnabled;
    } catch (error) {
      console.warn('Cookie test failed:', error);
      return false;
    }
  }

  testWebSocket() {
    try {
      if (!window.WebSocket) {
        return false;
      }
      
      // Try to create a WebSocket connection (will fail but tells us if it's supported)
      const ws = new WebSocket('wss://echo.websocket.org');
      ws.close();
      return true;
    } catch (error) {
      console.warn('WebSocket test failed:', error);
      return false;
    }
  }

  testCORS() {
    try {
      // Check if XMLHttpRequest supports CORS
      const xhr = new XMLHttpRequest();
      return 'withCredentials' in xhr;
    } catch (error) {
      return false;
    }
  }

  testPolling() {
    try {
      // Test if we can make HTTP requests (polling fallback)
      return typeof fetch !== 'undefined' || typeof XMLHttpRequest !== 'undefined';
    } catch (error) {
      return false;
    }
  }

  generateReport() {
    const report = {
      browser: this.browser,
      diagnostics: this.diagnostics,
      recommendations: this.getRecommendations(),
      timestamp: new Date().toISOString()
    };

    console.log('📊 Connection Diagnostic Report:', report);
    return report;
  }

  getRecommendations() {
    const recommendations = [];

    if (!this.diagnostics.networkConnectivity) {
      recommendations.push('Check your internet connection');
    }

    if (!this.diagnostics.cookiesEnabled) {
      recommendations.push('Enable cookies in your browser settings');
    }

    if (!this.diagnostics.webSocketSupport && !this.diagnostics.pollingSupport) {
      recommendations.push('Your browser may not support real-time communication');
    }

    if (this.browser.isSamsung) {
      recommendations.push('Samsung Internet: Try clearing browser cache and cookies');
      recommendations.push('Samsung Internet: Consider using Chrome or Firefox for better compatibility');
    }

    if (this.browser.isIOS && this.browser.isSafari) {
      recommendations.push('iOS Safari: Ensure JavaScript is enabled');
      recommendations.push('iOS Safari: Try refreshing the page if developers list is empty');
    }

    if (this.browser.isMobile) {
      recommendations.push('Mobile browser: Ensure stable network connection');
      recommendations.push('Mobile browser: Try switching between WiFi and mobile data');
    }

    if (!this.diagnostics.corsSupport) {
      recommendations.push('CORS not supported: Try a different browser');
    }

    if (recommendations.length === 0) {
      recommendations.push('All tests passed! If you still have issues, try refreshing the page.');
    }

    return recommendations;
  }

  // Show user-friendly error messages
  getUserFriendlyMessage() {
    if (!this.diagnostics.socketIOSupport) {
      if (this.browser.isSamsung) {
        return "Samsung Internet detected. For the best experience, please try using Chrome or Firefox.";
      } else if (this.browser.isIOS && this.browser.isSafari) {
        return "iOS Safari detected. If the developers list is empty, please refresh the page.";
      } else if (!this.diagnostics.networkConnectivity) {
        return "No internet connection detected. Please check your network connection.";
      } else {
        return "Your browser may have compatibility issues. Try refreshing the page or using a different browser.";
      }
    }
    return null;
  }
}

// Utility function to run quick diagnostics
export const runQuickDiagnostics = async () => {
  const diagnostics = new ConnectionDiagnostics();
  return await diagnostics.runDiagnostics();
};

// Utility function to get user-friendly error message
export const getBrowserCompatibilityMessage = async () => {
  const diagnostics = new ConnectionDiagnostics();
  await diagnostics.runDiagnostics();
  return diagnostics.getUserFriendlyMessage();
};
