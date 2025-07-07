import { useState, useEffect } from "react";

export function useAdmin() {
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [mobileAdminTapCount, setMobileAdminTapCount] = useState(0);

  // Test için window'a admin fonksiyonu ekleyelim
  useEffect(() => {
    (window as any).openAdmin = () => {
      console.log('Admin panel test açılışı');
      setIsPasswordModalOpen(true);
    };
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.altKey && e.key === 's') {
        e.preventDefault();
        console.log('Admin shortcut triggered'); // Debug için
        setIsPasswordModalOpen(true);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleLogoClick = () => {
    setMobileAdminTapCount(prev => {
      const newCount = prev + 1;
      console.log('Tap count:', newCount); // Debug için
      if (newCount === 3) {
        setIsPasswordModalOpen(true);
        return 0; // Reset
      }
      return newCount;
    });
    
    setTimeout(() => {
      setMobileAdminTapCount(0);
    }, 2000); // Daha uzun süre
  };

  const handlePasswordSubmit = (password: string) => {
    if (password === 'admin123') {
      setIsPasswordModalOpen(false);
      setIsAdminOpen(true);
      return true;
    }
    return false;
  };

  const closePasswordModal = () => {
    setIsPasswordModalOpen(false);
  };

  const closeAdminPanel = () => {
    setIsAdminOpen(false);
  };

  return {
    isAdminOpen,
    isPasswordModalOpen,
    handleLogoClick,
    handlePasswordSubmit,
    closePasswordModal,
    closeAdminPanel,
  };
}
