import MainLayout from "@/components/layout/main-layout";
import { useQuery } from "@tanstack/react-query";
import { Class } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus, Users, BookOpen } from "lucide-react";
import { useState } from "react";

export default function ClassesPage() {
  const { data: classes, isLoading: classesLoading } = useQuery<Class[]>({
    queryKey: ["/api/classes"],
  });
  
  return (
    <MainLayout>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-neutral-800">Gestion des classes</h2>
          <p className="text-neutral-600">Consultez et gérez les classes et les groupes.</p>
        </div>
        <Button className="mt-4 md:mt-0">
          <Plus className="h-4 w-4 mr-2" />
          Nouvelle classe
        </Button>
      </div>
      
      {/* Classes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {classesLoading ? (
          <>
            <Skeleton className="h-48 w-full" />
            <Skeleton className="h-48 w-full" />
            <Skeleton className="h-48 w-full" />
          </>
        ) : (
          classes?.map(cls => (
            <Card key={cls.id}>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BookOpen className="h-5 w-5 mr-2 text-primary" />
                  {cls.name}
                </CardTitle>
                <CardDescription>Niveau: {cls.level}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center text-sm text-muted-foreground">
                  <Users className="h-4 w-4 mr-1" />
                  <span>15 élèves</span>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
                  <div className="bg-primary/5 p-2 rounded">
                    <p className="font-medium">Absences du mois</p>
                    <p className="text-lg font-bold">12</p>
                  </div>
                  <div className="bg-muted/30 p-2 rounded">
                    <p className="font-medium">Taux de présence</p>
                    <p className="text-lg font-bold">94%</p>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" size="sm" className="w-full">
                  Voir les détails
                </Button>
              </CardFooter>
            </Card>
          ))
        )}
      </div>
    </MainLayout>
  );
}
