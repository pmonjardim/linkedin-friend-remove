import { useAuth } from '@/hooks/useAuth';
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  Download, 
  BarChart3, 
  Settings, 
  LogOut, 
  Crown,
  TrendingUp,
  Shield,
  Zap,
  Upload
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface UserPlan {
  plan_name: string;
  max_connections: number;
  ai_analysis_enabled: boolean;
  priority_support: boolean;
  status: string;
}

interface Connection {
  id: string;
  linkedin_name: string;
  linkedin_title: string;
  linkedin_company: string;
  ai_relevance_score: number;
  is_removed: boolean;
  created_at: string;
}

const Dashboard = () => {
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  const [userPlan, setUserPlan] = useState<UserPlan | null>(null);
  const [connections, setConnections] = useState<Connection[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchUserPlan();
      fetchConnections();
    }
  }, [user]);

  const fetchUserPlan = async () => {
    try {
      const { data, error } = await supabase
        .rpc('get_user_plan', { user_id_param: user?.id });
      
      if (error) throw error;
      
      if (data && data.length > 0) {
        setUserPlan(data[0]);
      }
    } catch (error) {
      console.error('Error fetching user plan:', error);
    }
  };

  const fetchConnections = async () => {
    try {
      const { data, error } = await supabase
        .from('connections')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      setConnections(data || []);
    } catch (error) {
      console.error('Error fetching connections:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    toast({
      title: "Logout realizado",
      description: "Você foi desconectado com sucesso"
    });
  };

  const handleDownloadPlugin = async () => {
    // Import the existing download function from Index page
    const { default: JSZip } = await import('jszip');
    
    const files = [
      { 
        name: 'manifest.json', 
        content: JSON.stringify({
          "manifest_version": 3,
          "name": "Atlândida LinkedIn Manager",
          "version": "3.0.0",
          "description": "Gerencie suas conexões LinkedIn com IA - Conectado à plataforma Atlândida",
          "permissions": ["activeTab", "scripting", "storage"],
          "host_permissions": ["https://*.linkedin.com/*"],
          "action": {
            "default_popup": "popup.html",
            "default_title": "Atlândida LinkedIn Manager"
          },
          "content_scripts": [{
            "matches": ["https://*.linkedin.com/*"],
            "js": ["content-secure.js"]
          }],
          "icons": {
            "16": "icon16.png",
            "48": "icon48.png", 
            "128": "icon128.png"
          }
        }, null, 2) 
      }
    ];

    const zip = new JSZip();
    files.forEach(file => {
      zip.file(file.name, file.content);
    });

    const zipBlob = await zip.generateAsync({ type: 'blob' });
    const url = URL.createObjectURL(zipBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'atlantida-linkedin-extension.zip';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Plugin baixado!",
      description: "Plugin Atlândida baixado com sucesso"
    });
  };

  const activeConnections = connections.filter(c => !c.is_removed);
  const removedConnections = connections.filter(c => c.is_removed);
  const avgRelevanceScore = activeConnections.length > 0 
    ? Math.round(activeConnections.reduce((sum, c) => sum + (c.ai_relevance_score || 0), 0) / activeConnections.length)
    : 0;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-hero flex items-center justify-center">
        <div className="text-white text-lg">Carregando dashboard...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-hero">
      <div className="container mx-auto p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">Dashboard Atlândida</h1>
            <p className="text-white/80">Bem-vindo, {user?.email}</p>
          </div>
          <div className="flex items-center gap-4">
            {userPlan && (
              <Badge 
                variant={userPlan.plan_name === 'Pro' ? 'default' : 'secondary'}
                className="flex items-center gap-1"
              >
                {userPlan.plan_name === 'Pro' && <Crown className="h-3 w-3" />}
                Plano {userPlan.plan_name}
              </Badge>
            )}
            <Button 
              variant="secondary" 
              onClick={handleSignOut}
              className="flex items-center gap-2"
            >
              <LogOut className="h-4 w-4" />
              Sair
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white/95 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Conexões Ativas</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{activeConnections.length}</div>
              <p className="text-xs text-muted-foreground">
                de {userPlan?.max_connections === -1 ? '∞' : userPlan?.max_connections} possíveis
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/95 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Removidas</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-destructive">{removedConnections.length}</div>
              <p className="text-xs text-muted-foreground">conexões otimizadas</p>
            </CardContent>
          </Card>

          <Card className="bg-white/95 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Score Médio IA</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-accent">{avgRelevanceScore}%</div>
              <p className="text-xs text-muted-foreground">relevância média</p>
            </CardContent>
          </Card>

          <Card className="bg-white/95 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">IA Ativa</CardTitle>
              <Zap className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {userPlan?.ai_analysis_enabled ? (
                  <span className="text-green-600">SIM</span>
                ) : (
                  <span className="text-red-600">NÃO</span>
                )}
              </div>
              <p className="text-xs text-muted-foreground">análise inteligente</p>
            </CardContent>
          </Card>
        </div>

        {/* Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-white/95 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Download className="h-5 w-5" />
                Plugin Chrome
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Baixe o plugin oficial conectado à sua conta
              </p>
              <Button onClick={handleDownloadPlugin} className="w-full">
                Baixar Plugin
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-white/95 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="h-5 w-5" />
                Importar Dados
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Importe suas conexões LinkedIn existentes
              </p>
              <Button variant="outline" className="w-full" disabled>
                Em breve
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-white/95 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Configurações
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Gerencie sua conta e preferências
              </p>
              <Button variant="outline" className="w-full" disabled>
                Configurar
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Recent Connections */}
        <Card className="bg-white/95 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Conexões Recentes</CardTitle>
          </CardHeader>
          <CardContent>
            {activeConnections.length === 0 ? (
              <div className="text-center py-8">
                <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">
                  Nenhuma conexão encontrada. Use o plugin para começar!
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {activeConnections.slice(0, 5).map((connection) => (
                  <div key={connection.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <h4 className="font-medium">{connection.linkedin_name}</h4>
                      <p className="text-sm text-muted-foreground">
                        {connection.linkedin_title} {connection.linkedin_company && `at ${connection.linkedin_company}`}
                      </p>
                    </div>
                    {connection.ai_relevance_score && (
                      <Badge variant={connection.ai_relevance_score > 70 ? 'default' : 'secondary'}>
                        {connection.ai_relevance_score}% relevante
                      </Badge>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-white/60 text-sm">
            © 2025 Atlândida All Rights Reserved. Paulo Américo Monjardim (
            <a 
              href="https://linkedin.com/in/paulomonjardim" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-accent hover:underline font-medium"
            >
              PAIM
            </a>
            )
          </p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;