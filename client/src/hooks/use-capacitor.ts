import { useState, useEffect } from "react";

export function useIsNativeApp() {
  const [isNative, setIsNative] = useState(false);

  useEffect(() => {
    const checkNative = () => {
      const isCapacitor = !!(window as any).Capacitor?.isNativePlatform?.();
      const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
      const isIosStandalone = (navigator as any).standalone === true;
      
      setIsNative(isCapacitor || isStandalone || isIosStandalone);
    };
    
    checkNative();
  }, []);

  return isNative;
}

export function isNativeApp(): boolean {
  if (typeof window === 'undefined') return false;
  
  const isCapacitor = !!(window as any).Capacitor?.isNativePlatform?.();
  const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
  const isIosStandalone = (navigator as any).standalone === true;
  
  return isCapacitor || isStandalone || isIosStandalone;
}
