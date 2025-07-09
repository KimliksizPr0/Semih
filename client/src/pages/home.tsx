import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ProjectGrid } from "@/components/project/project-grid";
import { SearchFilters } from "@/components/project/search-filters";
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

export default function Home() {
  const { data: projects = [], isLoading } = useProjects();
  const [filters, setFilters] = useState<Filters>({
    search: "",
    category: "",
    status: "",
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

  const stats = useMemo(() => {
    const totalProjects = projects.length;
    const activeTools = projects.filter(p => p.offline).length;
    return { totalProjects, activeTools };
  }, [projects]);

  return (
    <motion.div
      initial="initial"
      animate="in"
      exit="out"
      variants={pageVariants}
      transition={pageTransition}
    >
      <div className="min-h-screen bg-gradient-to-br from-[#111111] via-[#1a1a1a] to-[#111111]">
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
          {/* Welcome Section */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-500 to-purple-600 text-transparent bg-clip-text hover-effect-target">
              Proje Portalına Hoş Geldin
            </h1>
            <p className="text-lg text-dark-muted max-w-2xl mx-auto">
              En popüler 0yun ve uygulamalara zahmetsizce ulaşabileceğin güvenli bir platform. Eğlence, üretkenlik, kişiselleştirme ve keşif için ihtiyacın olan her şey tek bir yerde. Güncel içerikler, kullanıcı dostu arayüz ile dijital deneyimini bir üst seviyeye taşı. 
              
            </p>
            <div className="mt-6 flex items-center justify-center space-x-4">
              <Card id="total-projects-card" className="bg-dark-card data-hover-target">
                <CardContent className="px-4 py-2">
                  <span className="text-sm text-dark-muted">Toplam Proje:</span>
                  <span className="text-accent-green font-semibold ml-2">{stats.totalProjects}</span>
                </CardContent>
              </Card>
              <Card id="active-tools-card" className="bg-dark-card data-hover-target">
                <CardContent className="px-4 py-2">
                  <span className="text-sm text-dark-muted">Aktif Araçlar:</span>
                  <span className="text-accent-blue font-semibold ml-2">{stats.activeTools}</span>
                </CardContent>
              </Card>
            </div>
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
                <p className="text-dark-muted">Projeler yükleniyor...</p>
              </div>
            ) : (
              <ProjectGrid projects={filteredProjects} />
            )}
          </motion.section>
        </main>
      </div>
    </motion.div>
  );
}
