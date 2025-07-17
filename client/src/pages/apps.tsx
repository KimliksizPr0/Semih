import { useState, useMemo } from "react";
import { motion } from "framer-motion";

import { SearchFilters } from "@/components/project/search-filters";
import { ProjectGrid } from "@/components/project/project-grid";
import { LoadingScreen } from "@/components/layout/loading-screen";
import { useProjects } from "@/hooks/use-projects";
import type { Filters } from "@/lib/types";

const pageVariants = {
  initial: {
    opacity: 0,
  },
  in: {
    opacity: 1,
  },
  out: {
    opacity: 0,
  },
};

const pageTransition = {
  type: "tween",
  ease: "anticipate",
  duration: 0.5,
};

export default function Apps() {
  const { data: projects, isLoading } = useProjects();
  const [filters, setFilters] = useState<Filters>({
    search: "",
    category: "Apps",
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
    <motion.div
      initial="initial"
      animate="in"
      exit="out"
      variants={pageVariants}
      transition={pageTransition}
    >
      <div className="min-h-screen bg-dark-bg relative z-10">
        <div className="container mx-auto px-4 py-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-8 relative z-10"
        >
          <div className="text-center relative z-20">
            <h1 className="text-4xl font-bold text-dark-text mb-4 relative z-20 hover-effect-target" style={{ position: 'relative', zIndex: 1000 }}>Apps</h1>
            <p className="text-dark-muted text-lg max-w-2xl mx-auto relative z-20" style={{ position: 'relative', zIndex: 1000 }}>
              A collection of fun apps and interactive applications.
            </p>
          </div>

          <div className="relative z-20">
            <SearchFilters
              filters={filters}
              onFiltersChange={setFilters}
            />
          </div>

          <div className="text-center relative z-20">
            <p className="text-dark-muted relative z-20" style={{ position: 'relative', zIndex: 1000 }}>
              {filteredProjects.length} apps found
            </p>
          </div>

          <div className="relative z-20">
            <ProjectGrid projects={filteredProjects} />
          </div>
        </motion.div>
        </div>
      </div>
    </motion.div>
  );
}