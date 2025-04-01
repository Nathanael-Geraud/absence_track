import { useQuery } from "@tanstack/react-query";
import { AbsenceWithDetails, StudentWithClass } from "@shared/schema";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface StudentAbsenceHistoryProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  student: StudentWithClass;
}

export default function StudentAbsenceHistory({ open, onOpenChange, student }: StudentAbsenceHistoryProps) {
  const { data: absences, isLoading } = useQuery<AbsenceWithDetails[]>({
    queryKey: [`/api/students/${student.id}/absences`],
    enabled: open,
  });
  
  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, "EEEE d MMMM yyyy", { locale: fr });
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[650px]">
        <DialogHeader>
          <DialogTitle>Historique des absences</DialogTitle>
        </DialogHeader>
        
        <div className="flex items-center mt-2 mb-6">
          <Avatar className="h-10 w-10 mr-3 bg-neutral-200">
            <AvatarFallback>
              {getInitials(student.firstname, student.lastname)}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium">
              {student.firstname} {student.lastname}
            </p>
            <p className="text-sm text-neutral-500">Classe: {student.class.name}</p>
          </div>
        </div>
        
        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
          </div>
        ) : absences && absences.length > 0 ? (
          <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
            {absences.map((absence) => (
              <div 
                key={absence.id} 
                className="border rounded-md p-4 bg-white hover:bg-neutral-50 transition-colors"
              >
                <div className="flex justify-between items-start mb-2">
                  <p className="font-medium">
                    {formatDate(absence.date)}
                  </p>
                  <Badge variant="outline" className={absence.notified ? "bg-green-100 text-green-700" : ""}>
                    {absence.notified ? "Parent notifié" : "Non notifié"}
                  </Badge>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-neutral-500">Horaires</p>
                    <p>{absence.start_time} - {absence.end_time}</p>
                  </div>
                  <div>
                    <p className="text-sm text-neutral-500">Matière</p>
                    <p>{absence.subject.name}</p>
                  </div>
                </div>
                
                {absence.reason && (
                  <div className="mt-3">
                    <p className="text-sm text-neutral-500">Motif</p>
                    <p className="text-sm">{absence.reason}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center p-8 text-neutral-500">
            <p>Aucune absence enregistrée pour cet élève.</p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}