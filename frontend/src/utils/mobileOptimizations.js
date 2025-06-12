// Mobile optimization utilities
export const isMobileDevice = () => {
  return window.innerWidth < 640 || /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
};

export const getOptimalTextLength = (containerWidth, fontSize = 16) => {
  // Calculate approximate characters that can fit
  const avgCharWidth = fontSize * 0.6; // Approximate character width
  const padding = 40; // Account for padding and margins
  return Math.floor((containerWidth - padding) / avgCharWidth);
};

export const optimizeForMobile = () => {
  // Disable pull-to-refresh on mobile
  document.addEventListener('touchstart', (e) => {
    if (e.touches.length > 1) {
      e.preventDefault();
    }
  }, { passive: false });

  document.addEventListener('touchend', (e) => {
    if (e.touches.length > 0) {
      e.preventDefault();
    }
  }, { passive: false });

  // Optimize viewport for mobile
  const viewport = document.querySelector('meta[name=viewport]');
  if (viewport && isMobileDevice()) {
    viewport.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover');
  }
};

export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

export const throttle = (func, limit) => {
  let inThrottle;
  return function() {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

// Performance monitoring for mobile
export const measurePerformance = (name, fn) => {
  if (typeof performance !== 'undefined' && performance.mark) {
    performance.mark(`${name}-start`);
    const result = fn();
    performance.mark(`${name}-end`);
    performance.measure(name, `${name}-start`, `${name}-end`);
    
    const entries = performance.getEntriesByName(name);
    if (entries.length > 0) {
      console.log(`🏃‍♂️ [Performance] ${name}: ${entries[entries.length - 1].duration.toFixed(2)}ms`);
    }
    
    return result;
  }
  return fn();
};
