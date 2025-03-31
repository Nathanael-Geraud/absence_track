import { StudentWithClass } from "@shared/schema";
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
import { Edit, Eye, History } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface StudentTableProps {
  students: StudentWithClass[];
}

export default function StudentTable({ students }: StudentTableProps) {
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
            <TableHead>Contact parent</TableHead>
            <TableHead>Absences (mois)</TableHead>
            <TableHead>Statut</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {students.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                Aucun élève à afficher
              </TableCell>
            </TableRow>
          ) : (
            students.map((student) => (
              <TableRow key={student.id}>
                <TableCell>
                  <div className="flex items-center">
                    <Avatar className="h-10 w-10 mr-4 bg-neutral-200">
                      <AvatarFallback>{getInitials(student.firstname, student.lastname)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">
                        {student.firstname} {student.lastname}
                      </div>
                      <div className="text-xs text-neutral-500">
                        ID: STD-{String(student.id).padStart(5, '0')}
                      </div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>{student.class.name}</TableCell>
                <TableCell>
                  <div className="text-sm">
                    {student.parent_name}
                    <div className="text-xs text-neutral-500">
                      {student.parent_email}
                    </div>
                    <div className="text-xs text-neutral-500">
                      {student.parent_phone}
                    </div>
                  </div>
                </TableCell>
                <TableCell>{student.absences_count}</TableCell>
                <TableCell>
                  <Badge 
                    variant={student.status === "actif" ? "success" : "destructive"}
                  >
                    {student.status === "actif" ? "Actif" : "Inactif"}
                  </Badge>
                </TableCell>
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
                        <Button variant="ghost" size="icon" className="mr-1">
                          <History className="h-4 w-4 text-muted-foreground" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Historique des absences</p>
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
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
      
      {students.length > 0 && (
        <div className="px-6 py-3 bg-neutral-50 border-t border-neutral-200 flex items-center justify-between">
          <div className="text-sm text-neutral-700">
            Affichage de <span className="font-medium">1</span> à{" "}
            <span className="font-medium">{students.length}</span> sur{" "}
            <span className="font-medium">{students.length}</span> élèves
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
