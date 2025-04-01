import { StudentWithClass } from "@shared/schema";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Edit } from "lucide-react";
import { useState } from "react";
import StudentForm from "./student-form";

interface StudentDetailsProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  student: StudentWithClass;
}

export default function StudentDetails({ open, onOpenChange, student }: StudentDetailsProps) {
  const [showEditForm, setShowEditForm] = useState(false);
  
  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };
  
  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <div className="flex justify-between items-center">
              <DialogTitle>Détails de l'élève</DialogTitle>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => {
                  setShowEditForm(true);
                  onOpenChange(false);
                }}
              >
                <Edit className="h-4 w-4 mr-2" />
                Modifier
              </Button>
            </div>
          </DialogHeader>
          
          <div className="mt-4">
            <div className="flex flex-col sm:flex-row gap-4 items-center sm:items-start">
              <Avatar className="h-20 w-20 bg-neutral-200">
                <AvatarFallback className="text-lg">
                  {getInitials(student.firstname, student.lastname)}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-grow text-center sm:text-left">
                <h3 className="text-xl font-semibold">
                  {student.firstname} {student.lastname}
                </h3>
                <p className="text-neutral-500">ID: STD-{String(student.id).padStart(5, '0')}</p>
                <div className="flex items-center justify-center sm:justify-start mt-2">
                  <Badge variant={student.status === "actif" ? "outline" : "destructive"} className={student.status === "actif" ? "bg-green-100 text-green-700" : ""}>
                    {student.status === "actif" ? "Actif" : "Inactif"}
                  </Badge>
                </div>
              </div>
            </div>
            
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <h4 className="text-sm font-medium text-neutral-500 mb-2">Informations scolaires</h4>
                <div className="bg-neutral-50 p-4 rounded-md">
                  <div className="mb-3">
                    <p className="text-sm font-medium">Classe</p>
                    <p>{student.class.name}</p>
                  </div>
                  <div className="mb-3">
                    <p className="text-sm font-medium">Total des absences</p>
                    <p>{student.absences_count}</p>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-neutral-500 mb-2">Informations de contact</h4>
                <div className="bg-neutral-50 p-4 rounded-md">
                  <div className="mb-3">
                    <p className="text-sm font-medium">Nom du parent</p>
                    <p>{student.parent_name}</p>
                  </div>
                  <div className="mb-3">
                    <p className="text-sm font-medium">Téléphone</p>
                    <p>{student.parent_phone}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Email</p>
                    <p className="break-all">{student.parent_email}</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-6">
              <h4 className="text-sm font-medium text-neutral-500 mb-2">Absences récentes</h4>
              {student.absences_count > 0 ? (
                <p className="italic text-neutral-600">
                  Cliquez sur "Historique des absences" pour voir le détail des absences.
                </p>
              ) : (
                <p className="italic text-neutral-600">Aucune absence enregistrée.</p>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
      
      {showEditForm && (
        <StudentForm
          open={showEditForm}
          onOpenChange={(open) => {
            setShowEditForm(open);
            if (!open) {
              onOpenChange(true);
            }
          }}
          student={student}
        />
      )}
    </>
  );
}