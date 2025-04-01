import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Menu, ChevronDown } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface HeaderProps {
  onMenuClick: () => void;
}

export default function Header({ onMenuClick }: HeaderProps) {
  const { user, logoutMutation } = useAuth();
  const [currentDate] = useState(formatCurrentDate());
  
  function formatCurrentDate() {
    const date = new Date();
    const options: Intl.DateTimeFormatOptions = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    const formattedDate = date.toLocaleDateString('fr-FR', options);
    return formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);
  }
  
  function getInitials(name: string) {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  }
  
  const handleLogout = () => {
    logoutMutation.mutate();
  };
  
  return (
    <header className="bg-primary text-white shadow-md z-10">
      <div className="container mx-auto px-4 flex items-center justify-between h-16">
        <div className="flex items-center">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={onMenuClick} 
            className="mr-4 lg:hidden text-white hover:bg-primary-foreground/20"
          >
            <Menu className="h-6 w-6" />
          </Button>
          <Link href="/" className="text-xl font-bold no-underline text-white hover:text-white/90">
            GestiAbsences
          </Link>
        </div>
        
        <div className="flex items-center">
          <div className="hidden md:block mr-4">
            <span className="text-sm">{currentDate}</span>
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center space-x-2 hover:bg-primary-foreground/20">
                <Avatar className="h-8 w-8 bg-white text-primary">
                  <AvatarFallback>{user ? getInitials(user.fullname) : "UT"}</AvatarFallback>
                </Avatar>
                <span className="hidden md:inline">{user?.fullname || "Utilisateur"}</span>
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <Link href="/profile">
                <DropdownMenuItem asChild>
                  <div className="w-full cursor-pointer">Mon profil</div>
                </DropdownMenuItem>
              </Link>
              <Link href="/settings">
                <DropdownMenuItem asChild>
                  <div className="w-full cursor-pointer">Paramètres</div>
                </DropdownMenuItem>
              </Link>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>
                Déconnexion
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
