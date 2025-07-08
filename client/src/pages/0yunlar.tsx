import { useState, useMemo } from "react";
import { motion } from "framer-motion";

import { SearchFilters } from "@/components/project/search-filters";
import { ProjectGrid } from "@/components/project/project-grid";
import { LoadingScreen } from "@/components/layout/loading-screen";
import { useProjects } from "@/hooks/use-projects";
import type { Filters } from "@/lib/types";

export default function Oyunlar() {
  const { data: projects, isLoading } = useProjects();
  const [filters, setFilters] = useState<Filters>({
    search: "",
    category: "0yunlar",
    status: "all",
  });

  const filteredProjects = useMemo(() => {
    if (!projects) return [];

    return projects.filter((project) => {
      const matchesSearch = project.name.toLowerCase().includes(filters.search.toLowerCase()) ||
                          project.description.toLowerCase().includes(filters.search.toLowerCase());
      
      const matchesCategory = filters.category === "all" || 
                            filters.category === "" || 
                            project.category === filters.category;
      
      const matchesStatus = filters.status === "all" || 
                          filters.status === "" ||
                          (filters.status === "online" && !project.offline) ||
                          (filters.status === "offline" && project.offline);

      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [projects, filters]);

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <div className="min-h-screen bg-dark-bg relative z-10">
      <div className="container mx-auto px-4 py-8 relative z-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="space-y-8 relative z-10"
      >
        <div className="text-center relative z-20">
          <h1 className="text-4xl font-bold text-white mb-4 relative z-20 hover-effect-target" style={{ position: 'relative', zIndex: 1000 }}>0yunlar</h1>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto relative z-20" style={{ position: 'relative', zIndex: 1000 }}>
            Eğlenceli 0yunlar ve interaktif uygulamalar koleksiyonu
          </p>
        </div>

        <div className="relative z-20">
          <SearchFilters
            filters={filters}
            onFiltersChange={setFilters}
          />
        </div>

        <div className="text-center relative z-20">
          <p className="text-gray-300 relative z-20" style={{ position: 'relative', zIndex: 1000 }}>
            {filteredProjects.length} 0yun bulundu
          </p>
        </div>

        <div className="relative z-20">
          <ProjectGrid projects={filteredProjects} />
        </div>
      </motion.div>
      </div>
    </div>
  );
}