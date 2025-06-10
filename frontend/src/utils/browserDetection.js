// Browser detection and compatibility utilities for Socket.IO
export const getBrowserInfo = () => {
  const userAgent = navigator.userAgent;
  const platform = navigator.platform;
  
  const browser = {
    name: 'unknown',
    version: 'unknown',
    isMobile: /Mobi|Android/i.test(userAgent),
    isIOS: /iPad|iPhone|iPod/.test(userAgent),
    isAndroid: /Android/.test(userAgent),
    isSamsung: /SamsungBrowser/.test(userAgent),
    isSafari: /Safari/.test(userAgent) && !/Chrome/.test(userAgent),
    isChrome: /Chrome/.test(userAgent) && !/Edge/.test(userAgent),
    isFirefox: /Firefox/.test(userAgent),
    isEdge: /Edge/.test(userAgent),
    platform: platform
  };

  // Detect browser name and version
  if (browser.isSamsung) {
    browser.name = 'Samsung Internet';
    const match = userAgent.match(/SamsungBrowser\/([\d.]+)/);
    browser.version = match ? match[1] : 'unknown';
  } else if (browser.isSafari) {
    browser.name = 'Safari';
    const match = userAgent.match(/Version\/([\d.]+)/);
    browser.version = match ? match[1] : 'unknown';
  } else if (browser.isChrome) {
    browser.name = 'Chrome';
    const match = userAgent.match(/Chrome\/([\d.]+)/);
    browser.version = match ? match[1] : 'unknown';
  } else if (browser.isFirefox) {
    browser.name = 'Firefox';
    const match = userAgent.match(/Firefox\/([\d.]+)/);
    browser.version = match ? match[1] : 'unknown';
  } else if (browser.isEdge) {
    browser.name = 'Edge';
    const match = userAgent.match(/Edge\/([\d.]+)/);
    browser.version = match ? match[1] : 'unknown';
  }

  return browser;
};

export const hasSocketIOIssues = () => {
  const browser = getBrowserInfo();
  
  // Helper function to safely parse version numbers
  const parseVersion = (versionString) => {
    if (!versionString || versionString === 'unknown') return 0;
    const majorVersion = versionString.split('.')[0];
    return parseInt(majorVersion, 10) || 0;
  };
  
  // Known problematic browsers for Socket.IO
  const problematicBrowsers = [
    browser.isSamsung,
    browser.isIOS && browser.isSafari,
    browser.isMobile && browser.name === 'Chrome' && parseVersion(browser.version) < 90
  ];

  return problematicBrowsers.some(Boolean);
};

export const getOptimalTransports = () => {
  const browser = getBrowserInfo();
  
  // Samsung Browser and Safari on iOS work better with polling first
  if (browser.isSamsung || (browser.isIOS && browser.isSafari)) {
    return ['polling', 'websocket'];
  }
  
  // For mobile Chrome, use polling first for reliability
  if (browser.isMobile && browser.isChrome) {
    return ['polling', 'websocket'];
  }
  
  // Desktop browsers can handle websocket first
  if (!browser.isMobile) {
    return ['websocket', 'polling'];
  }
  
  // Default fallback for other mobile browsers
  return ['polling', 'websocket'];
};

export const getSocketConfig = () => {
  const browser = getBrowserInfo();
  const transports = getOptimalTransports();
  
  const baseConfig = {
    withCredentials: true,
    transports,
    timeout: 20000,
    reconnection: true,
    reconnectionAttempts: 15,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    autoConnect: true,
    forceNew: true
  };

  // Samsung Browser specific optimizations
  if (browser.isSamsung) {
    return {
      ...baseConfig,
      timeout: 30000,
      reconnectionAttempts: 20,
      upgrade: false, // Disable transport upgrades for Samsung Browser
      rememberUpgrade: false,
      polling: {
        extraHeaders: {
          'X-Custom-Header': 'samsung-browser'
        }
      }
    };
  }

  // Safari iOS specific optimizations
  if (browser.isIOS && browser.isSafari) {
    return {
      ...baseConfig,
      timeout: 25000,
      reconnectionAttempts: 12,
      upgrade: true,
      rememberUpgrade: false, // Don't remember upgrades on iOS Safari
      polling: {
        extraHeaders: {
          'X-Custom-Header': 'ios-safari'
        }
      }
    };
  }

  // Mobile Chrome optimizations
  if (browser.isMobile && browser.isChrome) {
    return {
      ...baseConfig,
      timeout: 15000,
      reconnectionAttempts: 10,
      upgrade: true,
      rememberUpgrade: true
    };
  }

  return baseConfig;
};

export const logBrowserInfo = () => {
  const browser = getBrowserInfo();
  console.log('🌐 Browser Detection:', {
    name: browser.name,
    version: browser.version,
    isMobile: browser.isMobile,
    platform: browser.platform,
    hasSocketIssues: hasSocketIOIssues(),
    optimalTransports: getOptimalTransports()
  });
  
  if (hasSocketIOIssues()) {
    console.warn('⚠️ Browser may have Socket.IO compatibility issues. Using fallback configuration.');
  }
};

// Network connectivity check
export const checkNetworkConnectivity = () => {
  return new Promise((resolve) => {
    if (!navigator.onLine) {
      resolve(false);
      return;
    }

    // Try to fetch a lightweight resource
    fetch('/favicon.ico', { 
      method: 'HEAD',
      cache: 'no-cache',
      mode: 'no-cors'
    })
    .then(() => resolve(true))
    .catch(() => resolve(false));
  });
};

// Enhanced error handling for different browsers
export const handleSocketError = (error, browser = null) => {
  const browserInfo = browser || getBrowserInfo();
  
  console.error('🔌 Socket Error Details:', {
    error: error.message || error,
    browser: browserInfo.name,
    version: browserInfo.version,
    isMobile: browserInfo.isMobile,
    timestamp: new Date().toISOString()
  });

  // Browser-specific error messages
  if (browserInfo.isSamsung) {
    console.warn('Samsung Browser detected: Consider using alternative connection method');
  } else if (browserInfo.isIOS && browserInfo.isSafari) {
    console.warn('iOS Safari detected: WebSocket issues may occur, using polling fallback');
  }
};