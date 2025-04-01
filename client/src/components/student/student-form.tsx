import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Class, insertStudentSchema, StudentWithClass } from "@shared/schema";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { apiRequest } from "@/lib/queryClient";

const studentFormSchema = insertStudentSchema.extend({
  class_id: z.coerce.number().min(1, "La classe est requise"),
  status: z.enum(["actif", "inactif"]),
  parent_phone: z.string().min(10, "Le numéro de téléphone doit contenir au moins 10 chiffres")
    .regex(/^[+]?[0-9\s]{10,15}$/, "Numéro de téléphone invalide"),
  parent_email: z.string().email("Email invalide"),
});

type StudentFormData = z.infer<typeof studentFormSchema>;

interface StudentFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  student?: StudentWithClass;
}

export default function StudentForm({ open, onOpenChange, student }: StudentFormProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const isEditMode = !!student;

  const form = useForm<StudentFormData>({
    resolver: zodResolver(studentFormSchema),
    defaultValues: student ? {
      firstname: student.firstname,
      lastname: student.lastname,
      class_id: student.class_id,
      parent_name: student.parent_name,
      parent_email: student.parent_email,
      parent_phone: student.parent_phone,
      status: student.status as "actif" | "inactif"
    } : {
      firstname: "",
      lastname: "",
      class_id: 0,
      parent_name: "",
      parent_email: "",
      parent_phone: "",
      status: "actif"
    }
  });

  const { data: classes } = useQuery<Class[]>({
    queryKey: ["/api/classes"],
  });

  const createStudentMutation = useMutation({
    mutationFn: async (data: StudentFormData) => {
      const response = await apiRequest("POST", "/api/students", data);
      return await response.json();
    },
    onSuccess: () => {
      toast({
        title: "Élève créé",
        description: "L'élève a été créé avec succès.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/students"] });
      onOpenChange(false);
      form.reset();
    },
    onError: (error: Error) => {
      toast({
        title: "Erreur",
        description: `Une erreur est survenue : ${error.message}`,
        variant: "destructive",
      });
    }
  });

  const updateStudentMutation = useMutation({
    mutationFn: async (data: StudentFormData) => {
      const response = await apiRequest("PATCH", `/api/students/${student?.id}`, data);
      return await response.json();
    },
    onSuccess: () => {
      toast({
        title: "Élève modifié",
        description: "L'élève a été modifié avec succès.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/students"] });
      onOpenChange(false);
    },
    onError: (error: Error) => {
      toast({
        title: "Erreur",
        description: `Une erreur est survenue : ${error.message}`,
        variant: "destructive",
      });
    }
  });

  const onSubmit = (data: StudentFormData) => {
    if (isEditMode) {
      updateStudentMutation.mutate(data);
    } else {
      createStudentMutation.mutate(data);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{isEditMode ? "Modifier l'élève" : "Ajouter un élève"}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="firstname"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Prénom*</FormLabel>
                    <FormControl>
                      <Input placeholder="Prénom de l'élève" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="lastname"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nom*</FormLabel>
                    <FormControl>
                      <Input placeholder="Nom de l'élève" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="class_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Classe*</FormLabel>
                  <Select 
                    onValueChange={(value) => field.onChange(parseInt(value))} 
                    value={field.value?.toString() || ""}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner une classe" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {classes?.map((cls) => (
                        <SelectItem key={cls.id} value={cls.id.toString()}>
                          {cls.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="parent_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nom du parent*</FormLabel>
                    <FormControl>
                      <Input placeholder="Nom du parent" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="parent_phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Téléphone du parent*</FormLabel>
                    <FormControl>
                      <Input placeholder="06 12 34 56 78" {...field} />
                    </FormControl>
                    <FormDescription>
                      Utilisé pour les notifications SMS d'absence
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="parent_email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email du parent*</FormLabel>
                  <FormControl>
                    <Input placeholder="email@exemple.com" type="email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">
                      Statut actif
                    </FormLabel>
                    <FormDescription>
                      Un élève inactif n'apparaît plus dans les listes d'absences
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value === "actif"}
                      onCheckedChange={(checked) => field.onChange(checked ? "actif" : "inactif")}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <div className="flex justify-end space-x-2">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => onOpenChange(false)}
              >
                Annuler
              </Button>
              <Button type="submit" disabled={createStudentMutation.isPending || updateStudentMutation.isPending}>
                {(createStudentMutation.isPending || updateStudentMutation.isPending) ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {isEditMode ? "Modification..." : "Création..."}
                  </>
                ) : (
                  isEditMode ? "Modifier" : "Créer"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}