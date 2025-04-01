import MainLayout from "@/components/layout/main-layout";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function ReportsPage() {
  const { toast } = useToast();

  // Données de démonstration pour les rapports
  const absencesByMonth = [
    { name: 'Jan', absences: 45 },
    { name: 'Fév', absences: 38 },
    { name: 'Mar', absences: 52 },
    { name: 'Avr', absences: 42 },
    { name: 'Mai', absences: 48 },
    { name: 'Juin', absences: 50 },
    { name: 'Juil', absences: 25 },
    { name: 'Août', absences: 0 },
    { name: 'Sep', absences: 30 },
    { name: 'Oct', absences: 43 },
    { name: 'Nov', absences: 47 },
    { name: 'Déc', absences: 40 },
  ];

  const absencesByClass = [
    { name: '6ème A', absences: 32 },
    { name: '6ème B', absences: 37 },
    { name: '5ème A', absences: 45 },
    { name: '5ème B', absences: 29 },
    { name: '4ème A', absences: 52 },
    { name: '4ème B', absences: 48 },
    { name: '3ème A', absences: 58 },
    { name: '3ème B', absences: 43 },
  ];

  const handleGenerateReport = () => {
    toast({
      title: "Génération du rapport",
      description: "Le rapport sera disponible au téléchargement dans quelques instants.",
    });
  };

  const handleExportData = () => {
    toast({
      title: "Export des données",
      description: "Les données ont été exportées au format CSV.",
    });
  };

  return (
    <MainLayout>
      <div className="container mx-auto p-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Rapports</h1>
          <div className="space-x-2">
            <Button onClick={handleGenerateReport}>Générer un rapport complet</Button>
            <Button variant="outline" onClick={handleExportData}>Exporter les données</Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <Card>
            <CardHeader>
              <CardTitle>Absences par mois</CardTitle>
              <CardDescription>
                Nombre d'absences enregistrées par mois pour l'année scolaire en cours
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={absencesByMonth}
                    margin={{
                      top: 5,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="absences" fill="#8884d8" name="Nombre d'absences" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Absences par classe</CardTitle>
              <CardDescription>
                Répartition des absences par classe pour l'année scolaire en cours
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={absencesByClass}
                    margin={{
                      top: 5,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="absences" fill="#82ca9d" name="Nombre d'absences" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Statistiques globales</CardTitle>
            <CardDescription>
              Aperçu des statistiques d'absence pour l'année scolaire
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-neutral-100 p-4 rounded-lg">
                <p className="text-neutral-500 text-sm">Total des absences</p>
                <p className="text-2xl font-bold">543</p>
                <p className="text-sm text-green-600">+2.5% vs année précédente</p>
              </div>
              <div className="bg-neutral-100 p-4 rounded-lg">
                <p className="text-neutral-500 text-sm">Taux d'absentéisme</p>
                <p className="text-2xl font-bold">4.8%</p>
                <p className="text-sm text-red-600">+0.3% vs année précédente</p>
              </div>
              <div className="bg-neutral-100 p-4 rounded-lg">
                <p className="text-neutral-500 text-sm">Absences non justifiées</p>
                <p className="text-2xl font-bold">127</p>
                <p className="text-sm text-green-600">-5.1% vs année précédente</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}