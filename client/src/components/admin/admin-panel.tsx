import { motion } from "framer-motion";
import { X, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ProjectForm } from "./project-form";
import { ProjectList } from "./project-list";

interface AdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AdminPanel({ isOpen, onClose }: AdminPanelProps) {
  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
    >
      <div className="min-h-screen p-8 overflow-y-auto">
        <div className="max-w-4xl mx-auto">
          <Card className="bg-dark-card border-gray-600 shadow-2xl">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-2xl font-bold text-dark-text flex items-center">
                  <Shield className="mr-2 text-accent-green" />
                  Admin Panel
                </CardTitle>
                <Button
                  variant="ghost"
                  onClick={onClose}
                  className="text-dark-muted hover:text-red-400"
                >
                  <X className="h-6 w-6" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <ProjectForm />
              <ProjectList />
            </CardContent>
          </Card>
        </div>
      </div>
    </motion.div>
  );
}
