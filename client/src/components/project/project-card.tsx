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
    return category;
  };

  const cardStyle = {
    backgroundImage: `url(${project.imageUrl})`,
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="relative rounded-xl shadow-lg card-hover group data-hover-target overflow-hidden bg-cover bg-center"
      style={cardStyle}
      onClick={() => window.open(project.link, '_blank')}
    >
      <div className="absolute inset-0 bg-black/50"></div>
      <div className="relative z-10 p-6 flex flex-col h-full">
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
              onClick={(e) => {
                e.stopPropagation(); // Kartın tıklanmasını engelle
                toggleFavorite(project.id);
              }}
              className={`text-white hover:text-red-400 transition-colors rounded-full ${
                isFavorite(project.id) ? "text-red-400" : ""
              }`}
            >
              <Heart className={`h-4 w-4 ${isFavorite(project.id) ? "fill-current" : ""}`} />
            </Button>
          </div>
        </div>
        
        <div className="flex-grow">
          <h3 className="text-lg font-bold text-white mb-2" style={{ textShadow: '1px 1px 3px rgba(0,0,0,0.7)' }}>{project.name}</h3>
          <p className="text-gray-200 text-sm mb-4" style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.8)' }}>{project.description}</p>
        </div>
        
        <div className="flex items-center justify-between mt-auto">
          <Badge variant="outline" className="text-xs text-white border-white/50">
            {getCategoryName(project.category)}
          </Badge>
          <Button
            size="sm"
            className="bg-accent-green text-white group-hover:bg-green-600 transition-colors"
            onClick={(e) => e.stopPropagation()} // Linke gitmeyi engelle
          >
            <ExternalLink className="h-3 w-3 mr-1" />
            Projeyi Aç
          </Button>
        </div>
      </div>
    </motion.div>
  );
}