import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { ProjectGrid } from "@/components/project/project-grid";
import { SearchFilters } from "@/components/project/search-filters";
import { useProjects } from "@/hooks/use-projects";
import type { Filters } from "@/lib/types";

export default function LocalTools() {
  const { data: projects = [], isLoading } = useProjects();
  const [filters, setFilters] = useState<Filters>({
    search: "",
    category: "",
    status: "offline", // Default to offline tools
  });

  const filteredProjects = useMemo(() => {
    return projects.filter(project => {
      const matchesSearch = project.name.toLowerCase().includes(filters.search.toLowerCase()) ||
                           project.description.toLowerCase().includes(filters.search.toLowerCase());
      const matchesCategory = !filters.category || filters.category === 'all' || project.category === filters.category;
      const matchesStatus = !filters.status || filters.status === 'all' || 
                           (filters.status === 'offline' && project.offline) ||
                           (filters.status === 'online' && !project.offline);

      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [projects, filters]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#111111] via-[#1a1a1a] to-[#111111]">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        {/* Header */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-dark-text">
            Yerel Araçlar
          </h1>
          <p className="text-lg text-dark-muted max-w-2xl mx-auto">
            İnternet bağlantısı gerektirmeyen offline araçlar ve yardımcı ekleri. 
            Her yerde kullanabileceğiniz güvenilir araçlar.
          </p>
        </motion.section>

        {/* Search and Filters */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-8"
        >
          <SearchFilters filters={filters} onFiltersChange={setFilters} />
        </motion.section>

        {/* Project Grid */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          {isLoading ? (
            <div className="text-center py-12">
              <div className="loading-spinner mx-auto mb-4"></div>
              <p className="text-dark-muted">Araçlar yükleniyor...</p>
            </div>
          ) : (
            <ProjectGrid projects={filteredProjects} />
          )}
        </motion.section>
      </main>
    </div>
  );
}
