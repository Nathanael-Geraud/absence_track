import MainLayout from "@/components/layout/main-layout";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export default function HelpPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Recherche effectuée",
      description: `Recherche pour: "${searchQuery}"`,
    });
  };

  const handleContactSupport = () => {
    toast({
      title: "Support contacté",
      description: "Un membre de notre équipe vous contactera prochainement.",
    });
  };

  const faqItems = [
    {
      question: "Comment ajouter une nouvelle absence ?",
      answer:
        "Pour ajouter une nouvelle absence, rendez-vous sur la page 'Gestion des absences' et cliquez sur le bouton 'Nouvelle absence'. Remplissez ensuite le formulaire avec les informations de l'élève, la date, l'heure et le motif de l'absence, puis cliquez sur 'Enregistrer'.",
    },
    {
      question: "Comment sont notifiés les parents ?",
      answer:
        "Les parents sont automatiquement notifiés par SMS lorsqu'une absence est enregistrée pour leur enfant. Le message contient le nom de l'élève, la date, l'heure et la matière concernée par l'absence.",
    },
    {
      question: "Comment ajouter un nouvel élève ?",
      answer:
        "Pour ajouter un nouvel élève, accédez à la page 'Élèves' et cliquez sur le bouton 'Nouvel élève'. Remplissez le formulaire avec les informations de l'élève, y compris son nom, prénom, classe et les coordonnées des parents, puis cliquez sur 'Enregistrer'.",
    },
    {
      question: "Comment modifier une absence déjà enregistrée ?",
      answer:
        "Pour modifier une absence existante, accédez à la page 'Gestion des absences', trouvez l'absence concernée dans la liste et cliquez sur l'icône de modification (crayon). Vous pourrez alors mettre à jour les informations nécessaires.",
    },
    {
      question: "Comment générer un rapport d'absences ?",
      answer:
        "Pour générer un rapport d'absences, rendez-vous sur la page 'Rapports' et sélectionnez les critères souhaités (période, classe, élève, etc.). Cliquez ensuite sur 'Générer un rapport' pour créer le document que vous pourrez ensuite imprimer ou télécharger.",
    },
  ];

  return (
    <MainLayout>
      <div className="container mx-auto p-4">
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-2">Centre d'aide</h1>
          <p className="text-neutral-600">
            Trouvez des réponses à vos questions sur l'utilisation de
            l'application GestiAbsences
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Foire aux questions</CardTitle>
                <CardDescription>
                  Les questions les plus fréquentes sur l'utilisation de
                  l'application
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSearch} className="mb-6">
                  <div className="flex gap-2">
                    <Input
                      type="text"
                      placeholder="Rechercher une question..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="flex-1"
                    />
                    <Button type="submit">Rechercher</Button>
                  </div>
                </form>

                <Accordion type="single" collapsible className="w-full">
                  {faqItems.map((item, index) => (
                    <AccordionItem key={index} value={`item-${index}`}>
                      <AccordionTrigger>{item.question}</AccordionTrigger>
                      <AccordionContent>{item.answer}</AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
            </Card>
          </div>

          <div>
            <Card>
              <CardHeader>
                <CardTitle>Besoin d'aide ?</CardTitle>
                <CardDescription>
                  Contactez notre équipe de support
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-sm text-neutral-600">
                    Notre équipe est disponible pour vous aider à résoudre tous
                    vos problèmes liés à l'utilisation de l'application.
                  </p>

                  <div className="p-4 bg-neutral-100 rounded-lg">
                    <p className="font-medium">Email de support</p>
                    <p className="text-neutral-600">support@gestiabsences.fr</p>
                  </div>

                  <div className="p-4 bg-neutral-100 rounded-lg">
                    <p className="font-medium">Téléphone</p>
                    <p className="text-neutral-600">01 23 45 67 89</p>
                    <p className="text-xs text-neutral-500">
                      Du lundi au vendredi, 9h-17h
                    </p>
                  </div>

                  <Button
                    onClick={handleContactSupport}
                    className="w-full"
                    variant="outline"
                  >
                    Contacter le support
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="mt-4">
              <CardHeader>
                <CardTitle>Ressources</CardTitle>
                <CardDescription>
                  Documentation et tutoriels
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li>
                    <a
                      href="#"
                      className="text-primary hover:underline flex items-center"
                    >
                      <span className="material-icons mr-2 text-sm">
                        article
                      </span>
                      Guide d'utilisation complet
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="text-primary hover:underline flex items-center"
                    >
                      <span className="material-icons mr-2 text-sm">movie</span>
                      Tutoriels vidéo
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="text-primary hover:underline flex items-center"
                    >
                      <span className="material-icons mr-2 text-sm">
                        update
                      </span>
                      Notes de version
                    </a>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}