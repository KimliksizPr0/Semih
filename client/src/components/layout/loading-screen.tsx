import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export function LoadingScreen() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  if (!isLoading) return null;

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-dark-bg"
    >
      <div className="text-center">
        <div className="loading-spinner mx-auto mb-4"></div>
        <p className="text-dark-muted">Yükleniyor...</p>
      </div>
    </motion.div>
  );
}
