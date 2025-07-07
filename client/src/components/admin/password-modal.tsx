import { useState } from "react";
import { motion } from "framer-motion";
import { Shield, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface PasswordModalProps {
  isOpen: boolean;
  onSubmit: (password: string) => boolean;
  onClose: () => void;
}

export function PasswordModal({ isOpen, onSubmit, onClose }: PasswordModalProps) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const success = onSubmit(password);
    if (success) {
      setPassword("");
      setError("");
    } else {
      setError("Hatalı şifre!");
    }
  };

  const handleClose = () => {
    setPassword("");
    setError("");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="bg-dark-card border-gray-600 max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.3 }}
              className="w-16 h-16 bg-accent-green rounded-full flex items-center justify-center mx-auto mb-4 pulse-ring"
            >
              <Shield className="text-white h-8 w-8" />
            </motion.div>
            <h3 className="text-xl font-bold text-dark-text mb-2">Güvenlik Doğrulaması</h3>
            <p className="text-dark-muted mb-6">Admin paneline erişim için şifrenizi girin</p>
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-dark-muted h-4 w-4" />
            <Input
              type="password"
              placeholder="Şifre"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="pl-10 bg-dark-bg border-gray-600 text-dark-text focus:ring-accent-green focus:border-accent-green"
              autoFocus
            />
          </div>
          
          {error && (
            <p className="text-red-400 text-sm text-center">{error}</p>
          )}
          
          <div className="flex space-x-3">
            <Button type="button" variant="outline" onClick={handleClose} className="flex-1">
              İptal
            </Button>
            <Button type="submit" className="flex-1 bg-accent-green hover:bg-green-600">
              Giriş
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
