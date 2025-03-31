import { AbsenceWithDetails } from "@shared/schema";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { Edit, Eye } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface AbsenceTableProps {
  absences: AbsenceWithDetails[];
  showActions?: boolean;
}

export default function AbsenceTable({ absences, showActions = false }: AbsenceTableProps) {
  const formatTime = (timeStr: string) => {
    return timeStr.substring(0, 5);
  };
  
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (dateStr === today.toISOString().split('T')[0]) {
      return "Aujourd'hui";
    } else if (dateStr === yesterday.toISOString().split('T')[0]) {
      return "Hier";
    } else {
      return date.toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    }
  };
  
  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };
  
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Élève</TableHead>
            <TableHead>Classe</TableHead>
            <TableHead>Date</TableHead>
            {showActions && <TableHead>Heure</TableHead>}
            <TableHead>Cours</TableHead>
            <TableHead>Notification</TableHead>
            {showActions && <TableHead className="text-right">Actions</TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {absences.length === 0 ? (
            <TableRow>
              <TableCell colSpan={showActions ? 7 : 5} className="text-center py-6 text-muted-foreground">
                Aucune absence à afficher
              </TableCell>
            </TableRow>
          ) : (
            absences.map((absence) => (
              <TableRow key={absence.id}>
                <TableCell>
                  <div className="flex items-center">
                    <Avatar className="h-8 w-8 mr-2 bg-neutral-200">
                      <AvatarFallback>{getInitials(absence.student.firstname, absence.student.lastname)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">
                        {absence.student.firstname} {absence.student.lastname}
                      </div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>{absence.class.name}</TableCell>
                <TableCell>
                  {formatDate(absence.date)}
                  {!showActions && `, ${formatTime(absence.start_time)}`}
                </TableCell>
                {showActions && (
                  <TableCell>
                    {formatTime(absence.start_time)} - {formatTime(absence.end_time)}
                  </TableCell>
                )}
                <TableCell>{absence.subject.name}</TableCell>
                <TableCell>
                  <Badge variant={absence.notified ? "success" : "outline"}>
                    {absence.notified ? "Notifié" : "Non notifié"}
                  </Badge>
                </TableCell>
                {showActions && (
                  <TableCell className="text-right">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="ghost" size="icon" className="mr-1">
                            <Edit className="h-4 w-4 text-primary" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Modifier</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <Eye className="h-4 w-4 text-muted-foreground" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Détails</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </TableCell>
                )}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
      
      {absences.length > 0 && showActions && (
        <div className="px-6 py-3 bg-neutral-50 border-t border-neutral-200 flex items-center justify-between">
          <div className="text-sm text-neutral-700">
            Affichage de <span className="font-medium">1</span> à{" "}
            <span className="font-medium">{absences.length}</span> sur{" "}
            <span className="font-medium">{absences.length}</span> absences
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm" disabled>
              Précédent
            </Button>
            <Button variant="outline" size="sm" disabled>
              Suivant
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
