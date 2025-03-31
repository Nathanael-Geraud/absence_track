import MainLayout from "@/components/layout/main-layout";
import { useQuery } from "@tanstack/react-query";
import { AbsenceWithDetails } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import StatsCard from "@/components/dashboard/stats-card";
import { Loader2, Plus, TrendingDown, TrendingUp, Clock, CalendarClock } from "lucide-react";
import { useState } from "react";
import AbsenceForm from "@/components/absence/absence-form";
import AbsenceTable from "@/components/absence/absence-table";

export default function DashboardPage() {
  const [showAbsenceForm, setShowAbsenceForm] = useState(false);
  
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["/api/stats/dashboard"],
  });
  
  const { data: recentAbsences, isLoading: absencesLoading } = useQuery<AbsenceWithDetails[]>({
    queryKey: ["/api/absences/recent"],
  });
  
  return (
    <MainLayout>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-neutral-800">Tableau de bord</h2>
        <p className="text-neutral-600">Bienvenue. Voici un aperçu des absences récentes.</p>
      </div>
      
      {/* Dashboard Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {statsLoading ? (
          <>
            <StatsCard loading />
            <StatsCard loading />
            <StatsCard loading />
          </>
        ) : (
          <>
            <StatsCard 
              title="Absences aujourd'hui"
              value={stats?.absences_today || 0}
              icon={<Clock className="h-5 w-5" />}
              iconColor="bg-primary/10 text-primary"
              trend={stats?.absences_today > 3 ? { value: "+" + (stats?.absences_today - 3), label: "par rapport à hier", direction: "up" } : { value: "-" + (3 - stats?.absences_today), label: "par rapport à hier", direction: "down" }}
            />
            
            <StatsCard 
              title="Cette semaine"
              value={stats?.absences_week || 0}
              icon={<CalendarClock className="h-5 w-5" />}
              iconColor="bg-secondary/10 text-secondary"
              trend={{ value: "-5", label: "par rapport à la semaine dernière", direction: "down" }}
            />
            
            <StatsCard 
              title="Notifications envoyées"
              value={stats?.notifications_sent || 0}
              icon={<span className="material-icons text-xl">notifications</span>}
              iconColor="bg-green-500/10 text-green-500"
              trend={{ value: "100%", label: "taux de livraison", direction: "down" }}
            />
          </>
        )}
      </div>
      
      {/* Recent Absences */}
      <Card className="mb-8">
        <div className="px-6 py-4 border-b">
          <h3 className="font-medium text-neutral-800">Absences récentes</h3>
        </div>
        
        {absencesLoading ? (
          <div className="p-6">
            <div className="space-y-4">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          </div>
        ) : (
          <>
            <AbsenceTable absences={recentAbsences || []} />
            <div className="px-6 py-3 bg-neutral-50 border-t text-right">
              <Button variant="link" className="text-primary" href="/absences">
                Voir toutes les absences →
              </Button>
            </div>
          </>
        )}
      </Card>
      
      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="font-medium text-neutral-800 mb-4">Signaler une absence</h3>
          <p className="text-sm text-neutral-600 mb-4">Enregistrez rapidement une absence d'élève.</p>
          <Button onClick={() => setShowAbsenceForm(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Nouvelle absence
          </Button>
        </Card>
        
        <Card className="p-6">
          <h3 className="font-medium text-neutral-800 mb-4">Cours du jour</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center px-3 py-2 bg-primary/5 rounded">
              <div>
                <p className="font-medium">Mathématiques</p>
                <p className="text-sm text-neutral-500">3ème A - Salle 103</p>
              </div>
              <span className="text-sm font-medium">08:30 - 10:00</span>
            </div>
            
            <div className="flex justify-between items-center px-3 py-2 bg-neutral-50 rounded">
              <div>
                <p className="font-medium">Français</p>
                <p className="text-sm text-neutral-500">4ème B - Salle 205</p>
              </div>
              <span className="text-sm font-medium">10:15 - 11:45</span>
            </div>
            
            <div className="flex justify-between items-center px-3 py-2 bg-neutral-50 rounded">
              <div>
                <p className="font-medium">Histoire-Géographie</p>
                <p className="text-sm text-neutral-500">5ème C - Salle 108</p>
              </div>
              <span className="text-sm font-medium">13:30 - 15:00</span>
            </div>
          </div>
        </Card>
      </div>
      
      {/* Absence Form Modal */}
      <AbsenceForm 
        open={showAbsenceForm} 
        onOpenChange={setShowAbsenceForm}
      />
    </MainLayout>
  );
}
