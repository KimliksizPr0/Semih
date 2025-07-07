import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCreateProject } from "@/hooks/use-projects";
import { useToast } from "@/hooks/use-toast";
import type { InsertProject } from "@/lib/types";

export function ProjectForm() {
  const [formData, setFormData] = useState<InsertProject>({
    name: "",
    description: "",
    category: "productivity",
    icon: "🎮",
    link: "#",
    offline: false,
    patchLink: "",
  });

  const createProject = useCreateProject();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.description.trim()) {
      toast({
        title: "Hata",
        description: "Proje adı ve açıklama gerekli!",
        variant: "destructive",
      });
      return;
    }

    try {
      await createProject.mutateAsync(formData);
      setFormData({
        name: "",
        description: "",
        category: "productivity",
        icon: "🎮",
        link: "#",
        offline: false,
        patchLink: "",
      });
      toast({
        title: "Başarılı",
        description: "Proje başarıyla eklendi!",
      });
    } catch (error) {
      toast({
        title: "Hata",
        description: "Proje eklenemedi!",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="border-gray-600">
      <CardHeader>
        <CardTitle className="text-dark-text">Yeni Proje Ekle</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name" className="text-dark-text">Proje Adı</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="bg-gray-800 border-gray-600 text-white placeholder-gray-300"
                placeholder="Proje Adı"
              />
            </div>
            <div>
              <Label htmlFor="category" className="text-dark-text">Kategori</Label>
              <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Uygulamalar">Uygulamalar</SelectItem>
                  <SelectItem value="0yunlar">0yunlar</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div>
            <Label htmlFor="description" className="text-dark-text">Proje Açıklaması</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="bg-gray-800 border-gray-600 text-white placeholder-gray-300"
              placeholder="Proje Açıklaması"
              rows={3}
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="link" className="text-dark-text">Proje Linki</Label>
              <Input
                id="link"
                type="url"
                value={formData.link}
                onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                className="bg-gray-800 border-gray-600 text-white placeholder-gray-300"
                placeholder="Proje Linki"
              />
            </div>
            <div>
              <Label htmlFor="patchLink" className="text-dark-text">Yama Linki (Opsiyonel)</Label>
              <Input
                id="patchLink"
                type="url"
                value={formData.patchLink || ""}
                onChange={(e) => setFormData({ ...formData, patchLink: e.target.value })}
                className="bg-gray-800 border-gray-600 text-white placeholder-gray-300"
                placeholder="Yama Linki"
              />
            </div>
          </div>
          <div>
            <Label htmlFor="icon" className="text-dark-text">İkon (Emoji veya Font Awesome)</Label>
            <Input
              id="icon"
              value={formData.icon}
              onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
              className="bg-gray-800 border-gray-600 text-white placeholder-gray-300"
              placeholder="🎮"
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="offline"
                checked={formData.offline}
                onCheckedChange={(checked) => setFormData({ ...formData, offline: checked as boolean })}
              />
              <Label htmlFor="offline" className="text-dark-text">Offline Çalışır</Label>
            </div>
            <Button
              type="submit"
              disabled={createProject.isPending}
              className="bg-accent-green hover:bg-green-600 text-white"
            >
              {createProject.isPending ? "Ekleniyor..." : "Proje Ekle"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}