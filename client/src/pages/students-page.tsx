import MainLayout from "@/components/layout/main-layout";
import { useQuery } from "@tanstack/react-query";
import { Class, StudentWithClass } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus, Search } from "lucide-react";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import StudentTable from "@/components/student/student-table";

export default function StudentsPage() {
  const [showStudentForm, setShowStudentForm] = useState(false);
  const [filters, setFilters] = useState({
    class_id: "",
    status: "",
    search: "",
  });
  
  const { data: students, isLoading: studentsLoading } = useQuery<StudentWithClass[]>({
    queryKey: ["/api/students", filters],
  });
  
  const { data: classes } = useQuery<Class[]>({
    queryKey: ["/api/classes"],
  });
  
  const handleFilterChange = (field: string, value: string) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };
  
  const filteredStudents = students?.filter(student => {
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      const fullName = `${student.firstname} ${student.lastname}`.toLowerCase();
      if (!fullName.includes(searchLower)) return false;
    }
    
    if (filters.class_id && student.class_id.toString() !== filters.class_id) {
      return false;
    }
    
    if (filters.status && student.status !== filters.status) {
      return false;
    }
    
    return true;
  });
  
  return (
    <MainLayout>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-neutral-800">Gestion des élèves</h2>
          <p className="text-neutral-600">Consultez et gérez les informations des élèves.</p>
        </div>
        <Button onClick={() => setShowStudentForm(true)} className="mt-4 md:mt-0">
          <Plus className="h-4 w-4 mr-2" />
          Nouvel élève
        </Button>
      </div>
      
      {/* Search and Filters */}
      <Card className="mb-6 p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-2">
            <Label htmlFor="search-student" className="mb-1">Rechercher un élève</Label>
            <div className="flex">
              <div className="relative flex-grow">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-muted-foreground" />
                </div>
                <Input 
                  type="text" 
                  id="search-student" 
                  placeholder="Nom, prénom, classe..." 
                  className="pl-10" 
                  value={filters.search}
                  onChange={(e) => handleFilterChange("search", e.target.value)}
                />
              </div>
              <Button className="ml-2">
                Rechercher
              </Button>
            </div>
          </div>
          
          <div>
            <Label htmlFor="filter-student-class" className="mb-1">Classe</Label>
            <Select value={filters.class_id} onValueChange={(val) => handleFilterChange("class_id", val)}>
              <SelectTrigger id="filter-student-class">
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
            <Label htmlFor="filter-status" className="mb-1">Statut</Label>
            <Select value={filters.status} onValueChange={(val) => handleFilterChange("status", val)}>
              <SelectTrigger id="filter-status">
                <SelectValue placeholder="Tous les statuts" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les statuts</SelectItem>
                <SelectItem value="actif">Actif</SelectItem>
                <SelectItem value="inactif">Inactif</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </Card>
      
      {/* Students List */}
      <Card>
        {studentsLoading ? (
          <div className="p-6">
            <div className="space-y-4">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          </div>
        ) : (
          <StudentTable students={filteredStudents || []} />
        )}
      </Card>
    </MainLayout>
  );
}
