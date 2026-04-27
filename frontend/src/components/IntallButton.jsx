import { useEffect, useState } from 'react';

const InstallButton = () => {
  const [installPrompt, setInstallPrompt] = useState(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [supportsPWA, setSupportsPWA] = useState(false);

  useEffect(() => {
    // Check if PWA is supported
    const checkPWA = () => {
      setSupportsPWA('serviceWorker' in navigator && 'beforeinstallprompt' in window);
    };

    // Register service worker
    const registerServiceWorker = async () => {
      if ('serviceWorker' in navigator) {
        try {
          const registration = await navigator.serviceWorker.register('/sw.js');
          console.log('Service Worker registered:', registration);
        } catch (error) {
          console.error('Service Worker registration failed:', error);
        }
      }
    };

    // Check if app is already installed
    const checkInstalled = () => {
      if (window.matchMedia('(display-mode: standalone)').matches) {
        setIsInstalled(true);
      }
    };

    const handleBeforeInstallPrompt = (e) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      // Save the event so it can be triggered later
      setInstallPrompt(e);
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setInstallPrompt(null);
      console.log('PWA was installed');
    };

    checkPWA();
    checkInstalled();
    registerServiceWorker();

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!installPrompt) return;
    
    try {
      // Show the native install prompt
      installPrompt.prompt();
      
      // Wait for the user to respond to the prompt
      const { outcome } = await installPrompt.userChoice;
      console.log(`User response to install prompt: ${outcome}`);
      
      // We've used the prompt, and can't use it again, discard it
      setInstallPrompt(null);
    } catch (error) {
      console.error('Install prompt failed:', error);
    }
  };

  // Don't show button if app is already installed, not supported, or no install prompt available
  if (isInstalled || !supportsPWA || !installPrompt) {
    return null;
  }

  return (
    <button onClick={handleInstallClick} className="btn btn-success">
      Install App
    </button>
  );
};

export default InstallButton
