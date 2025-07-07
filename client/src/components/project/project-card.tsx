import { motion } from "framer-motion";
import { Heart, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useFavorites } from "@/hooks/use-favorites";
import type { Project } from "@/lib/types";

interface ProjectCardProps {
  project: Project;
  index: number;
}

export function ProjectCard({ project, index }: ProjectCardProps) {
  const { isFavorite, toggleFavorite } = useFavorites();

  const getCategoryName = (category: string) => {
    return category; // Artık kategori adlarını olduğu gibi göster
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="bg-dark-card rounded-xl p-6 shadow-lg card-hover cursor-pointer group"
      onClick={() => window.open(project.link, '_blank')}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="w-12 h-12 bg-accent-green/20 rounded-lg flex items-center justify-center">
          {project.icon.startsWith('fa') ? (
            <i className={`${project.icon} text-accent-green text-xl`} />
          ) : (
            <span className="text-xl">{project.icon}</span>
          )}
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant={project.offline ? "default" : "secondary"}>
            {project.offline ? "Offline" : "Online"}
          </Badge>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => toggleFavorite(project.id)}
            className={`text-dark-muted hover:text-red-400 transition-colors ${
              isFavorite(project.id) ? "text-red-400" : ""
            }`}
          >
            <Heart className={`h-4 w-4 ${isFavorite(project.id) ? "fill-current" : ""}`} />
          </Button>
        </div>
      </div>
      
      <h3 className="text-lg font-semibold text-dark-text mb-2">{project.name}</h3>
      <p className="text-dark-muted text-sm mb-4">{project.description}</p>
      
      <div className="flex items-center justify-between">
        <Badge variant="outline" className="text-xs">
          {getCategoryName(project.category)}
        </Badge>
        <Button
          size="sm"
          className="bg-accent-green text-white group-hover:bg-green-600 transition-colors"
        >
          <ExternalLink className="h-3 w-3 mr-1" />
          Projeyi Aç
        </Button>
      </div>
    </motion.div>
  );
}
