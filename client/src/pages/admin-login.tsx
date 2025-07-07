import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Lock, User } from "lucide-react";

export default function AdminLogin() {
  const [, setLocation] = useLocation();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Doğru kullanıcı adı ve şifre kontrolü
    if (username === "semih" && password === "semih1828") {
      // localStorage'a login bilgisini kaydet
      localStorage.setItem("admin_logged_in", "true");
      localStorage.setItem("admin_login_time", Date.now().toString());
      
      toast({
        title: "Giriş Başarılı",
        description: "Admin paneline yönlendiriliyorsunuz...",
        variant: "default",
      });
      
      // Admin paneline yönlendir
      setTimeout(() => {
        setLocation("/admin");
      }, 500);
    } else {
      toast({
        title: "Giriş Hatası",
        description: "Kullanıcı adı veya şifre hatalı.",
        variant: "destructive",
      });
    }
    
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-dark-bg flex items-center justify-center p-4 relative z-50">
      <Card className="w-full max-w-md bg-dark-card border-gray-700 relative z-50">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-white flex items-center justify-center gap-2">
            <Lock className="h-6 w-6 text-accent-green" />
            Admin Girişi
          </CardTitle>
          <CardDescription className="text-gray-400">
            Yönetici paneline erişmek için giriş yapın
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="username" className="text-white">
                Kullanıcı Adı
              </Label>
              <div className="relative">
                <User className="absolute left-3 top-4 h-4 w-4 text-gray-500" />
                <Input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="pl-10 pr-4 py-3 bg-gray-800 border-gray-600 text-white placeholder-gray-300 focus:border-accent-green h-12"
                  placeholder="Kullanıcı adını girin"
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password" className="text-white">
                Şifre
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-4 h-4 w-4 text-gray-500" />
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 pr-4 py-3 bg-gray-800 border-gray-600 text-white placeholder-gray-300 focus:border-accent-green h-12"
                  placeholder="Şifrenizi girin"
                  required
                />
              </div>
            </div>
            
            <div className="pt-6 relative z-50">
              <button
                type="submit"
                className="w-full h-12 bg-green-600 hover:bg-green-700 active:bg-green-800 text-white font-semibold rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-2xl hover:shadow-green-500/25 border-0 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-900 relative z-50"
                disabled={isLoading}
                style={{ position: 'relative', zIndex: 9999 }}
              >
                {isLoading ? "Giriş yapılıyor..." : "Giriş Yap"}
              </button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}