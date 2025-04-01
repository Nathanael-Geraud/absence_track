import MainLayout from "@/components/layout/main-layout";
import { useQuery } from "@tanstack/react-query";
import { AbsenceWithDetails, Class, Subject } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus, Search } from "lucide-react";
import { useState } from "react";
import AbsenceForm from "@/components/absence/absence-form";
import AbsenceTable from "@/components/absence/absence-table";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

export default function AbsencesPage() {
  const [showAbsenceForm, setShowAbsenceForm] = useState(false);
  const [filters, setFilters] = useState({
    class_id: "",
    date: "",
    subject_id: "",
  });
  
  const { data: absences, isLoading: absencesLoading } = useQuery<AbsenceWithDetails[]>({
    queryKey: ["/api/absences", filters],
  });
  
  const { data: classes } = useQuery<Class[]>({
    queryKey: ["/api/classes"],
  });
  
  const { data: subjects } = useQuery<Subject[]>({
    queryKey: ["/api/subjects"],
  });
  
  const handleFilterChange = (field: string, value: string) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };
  
  const applyFilters = () => {
    // The filters are already applied via the dependency in the useQuery hook
  };
  
  return (
    <MainLayout>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-neutral-800">Gestion des absences</h2>
          <p className="text-neutral-600">Enregistrez et gérez les absences des élèves.</p>
        </div>
        <Button onClick={() => setShowAbsenceForm(true)} className="mt-4 md:mt-0">
          <Plus className="h-4 w-4 mr-2" />
          Nouvelle absence
        </Button>
      </div>
      
      {/* Filters */}
      <Card className="mb-6 p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <Label htmlFor="filter-class" className="mb-1">Classe</Label>
            <Select value={filters.class_id} onValueChange={(val) => handleFilterChange("class_id", val)}>
              <SelectTrigger id="filter-class">
                <SelectValue placeholder="Toutes les classes" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes les classes</SelectItem>
                {classes?.map(cls => (
                  <SelectItem key={cls.id} value={cls.id.toString()}>{cls.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="filter-date" className="mb-1">Date</Label>
            <Input 
              type="date" 
              id="filter-date" 
              value={filters.date} 
              onChange={(e) => handleFilterChange("date", e.target.value)} 
            />
          </div>
          
          <div>
            <Label htmlFor="filter-subject" className="mb-1">Matière</Label>
            <Select value={filters.subject_id} onValueChange={(val) => handleFilterChange("subject_id", val)}>
              <SelectTrigger id="filter-subject">
                <SelectValue placeholder="Toutes les matières" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes les matières</SelectItem>
                {subjects?.map(subject => (
                  <SelectItem key={subject.id} value={subject.id.toString()}>{subject.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex items-end">
            <Button onClick={applyFilters} className="w-full">
              <Search className="h-4 w-4 mr-2" />
              Appliquer les filtres
            </Button>
          </div>
        </div>
      </Card>
      
      {/* Absences List */}
      <Card>
        {absencesLoading ? (
          <div className="p-6">
            <div className="space-y-4">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          </div>
        ) : (
          <AbsenceTable absences={absences || []} showActions />
        )}
      </Card>
      
      {/* Absence Form Modal */}
      <AbsenceForm 
        open={showAbsenceForm} 
        onOpenChange={setShowAbsenceForm}
      />
    </MainLayout>
  );
}
