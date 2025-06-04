// frontend/src/components/Navbar.tsx
import ModeToggle from '@/components/ModeToggle'; // <-- Importez ModeToggle ici !
import { Button, buttonVariants } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { useAuth } from '@/context/authContext';
import { useCart } from '@/context/cartContext';
import { Menu, ShoppingCart } from 'lucide-react';
import React from 'react';
import { Link } from 'react-router-dom';

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const { getTotalItems } = useCart();
  const [isSheetOpen, setIsSheetOpen] = React.useState(false);

  const handleLinkClick = () => {
    setIsSheetOpen(false);
  };

  const handleLogout = () => {
    logout();
    setIsSheetOpen(false);
  };

  return (
    <header className="bg-primary text-primary-foreground p-4 shadow-md font-inter">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold" onClick={handleLinkClick}><span className='font-surgena'>Artisans Hub</span></Link>

        {/* Menu Hamburger pour les petits écrans */}
        <div className="md:hidden flex items-center">
          {/* Icône Panier pour les petits écrans (avant le hamburger) */}
          <Link to="/cart" className="relative mr-4">
            <Button variant="ghost" size="icon" className="text-primary-foreground">
              <ShoppingCart className="h-6 w-6" />
              {getTotalItems() > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full h-5 w-5 flex items-center justify-center text-xs">
                  {getTotalItems()}
                </span>
              )}
            </Button>
          </Link>

          <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="text-primary-foreground">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Ouvrir le menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[250px] sm:w-[300px]">
              <SheetHeader className="flex flex-row justify-between items-center">
                <SheetTitle>Navigation</SheetTitle>
                <ModeToggle />
              </SheetHeader>
              <nav className="flex flex-col space-y-4 mt-8">
                <Link to="/products" className={buttonVariants({ variant: "ghost", className: "justify-start" })} onClick={handleLinkClick}>Produits</Link>
                <Link to="/artisans" className={buttonVariants({ variant: "ghost", className: "justify-start" })} onClick={handleLinkClick}>Artisans</Link>

                {user ? (
                  <>
                    {user.role === 'artisan' && (
                      <Link to="/dashboard" className={buttonVariants({ variant: "ghost", className: "justify-start" })} onClick={handleLinkClick}>Dashboard</Link>
                    )}
                    <Link to="/profile" className={buttonVariants({ variant: "ghost", className: "justify-start" })} onClick={handleLinkClick}>Profil</Link>
                    <Link to="/myorders" className={buttonVariants({ variant: "ghost", className: "justify-start" })} onClick={handleLinkClick}>Mes Commandes</Link>
                    <Button onClick={handleLogout} variant="ghost" className="justify-start">Déconnexion</Button>
                  </>
                ) : (
                  <>
                    <Link to="/login" className={buttonVariants({ variant: "ghost", className: "justify-start" })} onClick={handleLinkClick}>Connexion</Link>
                    <Link to="/register" className={buttonVariants({ variant: "ghost", className: "justify-start" })} onClick={handleLinkClick}>Inscription</Link>
                  </>
                )}
              </nav>
            </SheetContent>
          </Sheet>
        </div>

        {/* Navigation complète pour les grands écrans */}
        <nav className="hidden md:flex items-center space-x-4">
          <Link to="/products" className={buttonVariants({ variant: "ghost", className: "text-primary-foreground hover:underline" })}>Produits</Link>
          <Link to="/artisans" className={buttonVariants({ variant: "ghost", className: "text-primary-foreground hover:underline" })}>Artisans</Link>

          {user ? (
            <>
              {user.role === 'artisan' && (
                <Link to="/dashboard" className={buttonVariants({ variant: "ghost", className: "text-primary-foreground hover:underline" })}>Dashboard</Link>
              )}
              <Link to="/profile" className={buttonVariants({ variant: "ghost", className: "text-primary-foreground hover:underline" })}>Profil</Link>
              <Link to="/myorders" className={buttonVariants({ variant: "ghost", className: "text-primary-foreground hover:underline" })}>Mes Commandes</Link>
              <Button onClick={handleLogout} variant="ghost" className="text-primary-foreground">Déconnexion</Button>
            </>
          ) : (
            <>
              <Link to="/login" className={buttonVariants({ variant: "ghost", className: "text-primary-foreground hover:underline" })}>Connexion</Link>
              <Link to="/register" className={buttonVariants({ variant: "ghost", className: "text-primary-foreground hover:underline" })}>Inscription</Link>
            </>
          )}

          <Link to="/cart" className="relative">
            <Button variant="ghost" size="icon" className="text-primary-foreground">
              <ShoppingCart className="h-6 w-6" />
              {getTotalItems() > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full h-5 w-5 flex items-center justify-center text-xs">
                  {getTotalItems()}
                </span>
              )}
            </Button>
          </Link>
          
          <ModeToggle />
        </nav>
      </div>
    </header>
  );
};

export default Navbar;