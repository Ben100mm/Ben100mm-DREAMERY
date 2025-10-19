import React, { useState, useEffect, useCallback, useRef, useMemo, lazy, Suspense, forwardRef } from 'react';

// ============================================================================
// PERFORMANCE HOOKS
// ============================================================================

/**
 * Debounce hook for search and form inputs
 * @param value - The value to debounce
 * @param delay - Delay in milliseconds
 * @returns Debounced value
 */
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

/**
 * Hook for expensive calculations with memoization
 * @param calculation - Function to memoize
 * @param dependencies - Array of dependencies
 * @returns Memoized result
 */
export function useExpensiveCalculation<T>(
  calculation: () => T,
  dependencies: any[]
): T {
  return useMemo(() => {
    return calculation();
  }, dependencies);
}

/**
 * Intersection Observer hook for lazy loading
 * @param options - Intersection Observer options
 * @returns Object with ref and isIntersecting state
 */
export function useIntersectionObserver(
  options: IntersectionObserverInit = {}
): { ref: React.RefObject<HTMLElement | null>; isIntersecting: boolean } {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(([entry]) => {
      setIsIntersecting(entry.isIntersecting);
    }, options);

    observer.observe(element);

    return () => {
      observer.unobserve(element);
    };
  }, [options]);

  return { ref, isIntersecting };
}

/**
 * Virtual scrolling hook for large lists
 * @param items - Array of items to virtualize
 * @param itemHeight - Height of each item
 * @param containerHeight - Height of the container
 * @returns Object with virtualized items and scroll handlers
 */
export function useVirtualScroll<T>(
  items: T[],
  itemHeight: number,
  containerHeight: number
) {
  const [scrollTop, setScrollTop] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const visibleItemCount = Math.ceil(containerHeight / itemHeight);
  const startIndex = Math.floor(scrollTop / itemHeight);
  const endIndex = Math.min(startIndex + visibleItemCount + 1, items.length);

  const visibleItems = items.slice(startIndex, endIndex);
  const totalHeight = items.length * itemHeight;
  const offsetY = startIndex * itemHeight;

  const handleScroll = useCallback((event: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(event.currentTarget.scrollTop);
  }, []);

  return {
    visibleItems,
    totalHeight,
    offsetY,
    scrollTop,
    handleScroll,
    containerRef,
  };
}

// ============================================================================
// PERFORMANCE UTILITIES
// ============================================================================

/**
 * Throttle function for performance-critical operations
 * @param func - Function to throttle
 * @param limit - Time limit in milliseconds
 * @returns Throttled function
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): T {
  let inThrottle: boolean;
  return ((...args: any[]) => {
    if (!inThrottle) {
      func.apply(null, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  }) as T;
}

/**
 * Debounce function for search and form inputs
 * @param func - Function to debounce
 * @param wait - Wait time in milliseconds
 * @returns Debounced function
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): T {
  let timeout: NodeJS.Timeout;
  return ((...args: any[]) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(null, args), wait);
  }) as T;
}

/**
 * Memoize expensive calculations
 * @param fn - Function to memoize
 * @param deps - Dependencies array
 * @returns Memoized function
 */
export function memoize<T extends (...args: any[]) => any>(
  fn: T,
  deps: any[]
): T {
  const cache = new Map();
  const key = JSON.stringify(deps);
  
  if (cache.has(key)) {
    return cache.get(key);
  }
  
  const result = fn();
  cache.set(key, result);
  return result;
}

// ============================================================================
// PERFORMANCE MONITORING
// ============================================================================

/**
 * Performance measurement utility
 * @param name - Name of the measurement
 * @param fn - Function to measure
 * @returns Performance result
 */
export async function measurePerformance<T>(
  name: string,
  fn: () => T | Promise<T>
): Promise<{ result: T; duration: number }> {
  const start = performance.now();
  const result = await fn();
  const duration = performance.now() - start;
  
  // Log performance metrics
  console.log(`Performance [${name}]: ${duration.toFixed(2)}ms`);
  
  return { result, duration };
}

/**
 * Memory usage monitoring
 * @returns Memory usage information
 */
export function getMemoryUsage() {
  if ('memory' in performance) {
    const memory = (performance as any).memory;
    return {
      usedJSHeapSize: memory.usedJSHeapSize,
      totalJSHeapSize: memory.totalJSHeapSize,
      jsHeapSizeLimit: memory.jsHeapSizeLimit,
      usagePercentage: (memory.usedJSHeapSize / memory.jsHeapSizeLimit) * 100,
    };
  }
  return null;
}

/**
 * Frame rate monitoring
 * @param callback - Callback function for FPS updates
 * @returns Function to stop monitoring
 */
export function monitorFrameRate(callback: (fps: number) => void) {
  let frameCount = 0;
  let lastTime = performance.now();
  
  const countFrame = () => {
    frameCount++;
    const currentTime = performance.now();
    
    if (currentTime - lastTime >= 1000) {
      const fps = Math.round((frameCount * 1000) / (currentTime - lastTime));
      callback(fps);
      frameCount = 0;
      lastTime = currentTime;
    }
    
    requestAnimationFrame(countFrame);
  };
  
  const stopMonitoring = () => {
    // This will be handled by the requestAnimationFrame loop
  };
  
  requestAnimationFrame(countFrame);
  return stopMonitoring;
}

// ============================================================================
// LAZY LOADING UTILITIES
// ============================================================================

/**
 * Lazy load component with error boundary
 * @param importFn - Dynamic import function
 * @param fallback - Fallback component
 * @returns Lazy component
 */
export function createLazyComponent<T extends React.ComponentType<any>>(
  importFn: () => Promise<{ default: T }>,
  fallback: React.ReactNode = (<div>Loading...</div>)
): React.ComponentType<React.ComponentProps<T>> {
  const LazyComponent = lazy(importFn);
  
  return (props: React.ComponentProps<T>) => (
    <Suspense fallback={fallback}>
      <LazyComponent {...props} />
    </Suspense>
  );
}

/**
 * Preload component for better performance
 * @param importFn - Dynamic import function
 */
export function preloadComponent<T extends React.ComponentType<any>>(
  importFn: () => Promise<{ default: T }>
) {
  // Start loading the component in the background
  importFn();
}

// ============================================================================
// EXPORT ALL UTILITIES
// ============================================================================

export default {
  // Hooks
  useDebounce,
  useExpensiveCalculation,
  useIntersectionObserver,
  useVirtualScroll,
  
  // Utilities
  throttle,
  debounce,
  memoize,
  
  // Monitoring
  measurePerformance,
  getMemoryUsage,
  monitorFrameRate,
  
  // Lazy Loading
  createLazyComponent,
  preloadComponent,
};

// ============================================================================
// RE-EXPORT PERFORMANCE MONITORING CLASSES
// ============================================================================

// Export PerformanceMonitor for real-time monitoring
export { performanceMonitor, PerformanceMonitor } from './PerformanceMonitor';
export type { PerformanceMetric, PerformanceBudget, PerformanceReport } from './PerformanceMonitor';

// Export BundleSizeTracker for bundle analysis
export { bundleSizeTracker, BundleSizeTracker } from './BundleSizeTracker';
export type { BundleSizeData, RegressionAlert } from './BundleSizeTracker';

// Export PerformanceMetricsDashboard component
export { PerformanceMetricsDashboard } from '../components/PerformanceMetricsDashboard';
