import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useProjects, useDeleteProject } from "@/hooks/use-projects";
import { useToast } from "@/hooks/use-toast";
import { Trash2, Download } from "lucide-react";
import type { Project } from "@/lib/types";

export function ProjectList() {
  const { data: projects = [], isLoading } = useProjects();
  const deleteProject = useDeleteProject();
  const { toast } = useToast();

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

  return (
    <Card className="border-gray-600">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-dark-text">Proje Listesi</CardTitle>
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
        <ScrollArea className="h-64">
          {isLoading ? (
            <div className="text-center text-dark-muted">Yükleniyor...</div>
          ) : (
            <div className="space-y-2">
              {projects.map((project: Project) => (
                <div
                  key={project.id}
                  className="bg-dark-bg rounded-lg p-3 flex items-center justify-between"
                >
                  <div className="flex items-center space-x-3">
                    <i className={`${project.icon} text-accent-green`} />
                    <div>
                      <div className="text-dark-text font-medium">{project.name}</div>
                      <div className="text-dark-muted text-sm">{getCategoryName(project.category)}</div>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(project.id)}
                    className="text-red-400 hover:text-red-300"
                    disabled={deleteProject.isPending}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}