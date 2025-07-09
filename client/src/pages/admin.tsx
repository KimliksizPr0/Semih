import { motion } from "framer-motion";
import { useEffect } from "react";
import { useLocation } from "wouter";
import { Shield, Settings, Database, Plus, Trash2, Download, Edit, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { ProjectForm } from "@/components/admin/project-form";
import { useProjects, useDeleteProject } from "@/hooks/use-projects";
import { useToast } from "@/hooks/use-toast";
import type { Project } from "@/lib/types";

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

export default function Admin() {
  const [, setLocation] = useLocation();
  const { data: projects = [], isLoading } = useProjects();
  const deleteProject = useDeleteProject();
  const { toast } = useToast();

  // Giriş kontrolü
  useEffect(() => {
    const isLoggedIn = localStorage.getItem("admin_logged_in");
    const loginTime = localStorage.getItem("admin_login_time");
    
    // Giriş yapılmamışsa veya oturum süresi dolmuşsa login sayfasına yönlendir
    if (!isLoggedIn || !loginTime) {
      setLocation("/admin-login");
      return;
    }
    
    // 24 saat sonra oturum süresi dolsun
    const twentyFourHours = 24 * 60 * 60 * 1000;
    if (Date.now() - parseInt(loginTime) > twentyFourHours) {
      localStorage.removeItem("admin_logged_in");
      localStorage.removeItem("admin_login_time");
      setLocation("/admin-login");
      return;
    }
  }, [setLocation]);

  const handleDelete = async (id: number) => {
    if (confirm("Bu projeyi silmek istediğinizden emin misiniz?")) {
      try {
        await deleteProject.mutateAsync(id);
        toast({
          title: "Başarılı",
          description: "Proje silindi!",
        });
      } catch (error) {
        toast({
          title: "Hata",
          description: "Proje silinemedi!",
          variant: "destructive",
        });
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("admin_logged_in");
    localStorage.removeItem("admin_login_time");
    toast({
      title: "Çıkış yapıldı",
      description: "Admin panelinden çıkış yapıldı.",
    });
    setLocation("/");
  };

  const handleExport = () => {
    const dataStr = JSON.stringify(projects, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = 'projeler_yedek.json';
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const getCategoryName = (category: string) => {
    const categories = {
      productivity: 'Verimlilik',
      design: 'Tasarım',
      development: 'Geliştirme',
      tools: 'Araçlar'
    };
    return categories[category as keyof typeof categories] || category;
  };

  const stats = {
    totalProjects: projects.length,
    offlineProjects: projects.filter(p => p.offline).length,
    onlineProjects: projects.filter(p => !p.offline).length,
  };

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
          {/* Header */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-8"
          >
            <div className="flex items-center justify-center mb-4">
              <Shield className="h-8 w-8 text-accent-green mr-3" />
              <h1 className="text-4xl md:text-5xl font-bold text-dark-text">
                Admin Panel
              </h1>
            </div>
            <p className="text-lg text-dark-muted max-w-2xl mx-auto">
              Proje yönetimi ve sistem ayarları. Burada yeni projeler ekleyebilir, 
              mevcut projeleri düzenleyebilir ve sistem verilerini yönetebilirsiniz.
            </p>
          </motion.section>

          {/* Stats Cards */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
          >
            <Card className="bg-dark-card border-gray-600">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <Database className="h-8 w-8 text-accent-blue" />
                  <div>
                    <p className="text-sm text-dark-muted">Toplam Proje</p>
                    <p className="text-2xl font-bold text-accent-green">{stats.totalProjects}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-dark-card border-gray-600">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <Settings className="h-8 w-8 text-accent-green" />
                  <div>
                    <p className="text-sm text-dark-muted">Offline Araçlar</p>
                    <p className="text-2xl font-bold text-accent-blue">{stats.offlineProjects}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-dark-card border-gray-600">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <Plus className="h-8 w-8 text-purple-400" />
                  <div>
                    <p className="text-sm text-dark-muted">Online Araçlar</p>
                    <p className="text-2xl font-bold text-purple-400">{stats.onlineProjects}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.section>

          {/* Project Form */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-8"
          >
            <ProjectForm />
          </motion.section>

          {/* Project List */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Card className="bg-dark-card border-gray-600">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-dark-text flex items-center">
                    <Database className="h-5 w-5 mr-2" />
                    Proje Listesi
                  </CardTitle>
                  <Button
                    onClick={handleExport}
                    className="bg-accent-blue hover:bg-blue-600 text-white"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    JSON Dışa Aktar
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-96">
                  {isLoading ? (
                    <div className="text-center text-dark-muted py-8">
                      <div className="loading-spinner mx-auto mb-4"></div>
                      <p>Projeler yükleniyor...</p>
                    </div>
                  ) : projects.length === 0 ? (
                    <div className="text-center text-dark-muted py-8">
                      <Database className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>Henüz proje eklenmemiş</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {projects.map((project: Project) => (
                        <motion.div
                          key={project.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="bg-dark-bg rounded-lg p-4 border border-gray-700 hover:border-accent-green/50 transition-colors"
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex items-start space-x-3 flex-1">
                              <div className="w-10 h-10 bg-accent-green/20 rounded-lg flex items-center justify-center mt-1">
                                <i className={`${project.icon} text-accent-green`} />
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center space-x-2 mb-1">
                                  <h3 className="text-dark-text font-medium">{project.name}</h3>
                                  <Badge variant={project.offline ? "default" : "secondary"} className="text-xs">
                                    {project.offline ? "Offline" : "Online"}
                                  </Badge>
                                </div>
                                <p className="text-dark-muted text-sm mb-2">{project.description}</p>
                                <div className="flex items-center space-x-2">
                                  <Badge variant="outline" className="text-xs">
                                    {getCategoryName(project.category)}
                                  </Badge>
                                  {project.link !== "#" && (
                                    <Badge variant="outline" className="text-xs text-accent-blue">
                                      Bağlantı Var
                                    </Badge>
                                  )}
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-accent-blue hover:text-blue-300"
                                title="Düzenle"
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDelete(project.id)}
                                className="text-red-400 hover:text-red-300"
                                disabled={deleteProject.isPending}
                                title="Sil"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </ScrollArea>
              </CardContent>
            </Card>
          </motion.section>

          {/* Çıkış Butonu */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="text-center mt-8 mb-8"
          >
            <Button
              onClick={handleLogout}
              variant="outline"
              size="lg"
              className="border-red-600 text-red-600 hover:bg-red-600 hover:text-white"
            >
              <LogOut className="h-5 w-5 mr-2" />
              Admin Panelinden Çıkış Yap
            </Button>
          </motion.section>
        </main>
      </div>
    </motion.div>
  );
}
