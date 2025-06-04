// frontend/src/pages/ArtisansPage.tsx
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import api from '@/lib/api';
import { AxiosError } from 'axios';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

// Interface pour la structure des données d'un artisan telle que renvoyée par le backend
interface Artisan {
  _id: string;
  username: string;
  email: string;
  companyName?: string; // Optionnel
  bio?: string; // Optionnel, si vous l'ajoutez à votre modèle User
  profilePicture?: string; // Optionnel, si vous l'ajoutez à votre modèle User
}

const ArtisansPage: React.FC = () => {
  const [artisans, setArtisans] = useState<Artisan[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchArtisans = async () => {
      try {
        setLoading(true);
        setError(null);
        // L'appel API vers notre nouvelle route backend
        const { data } = await api.get<Artisan[]>('/auth/artisans');
        setArtisans(data);
      } catch (err) {
        console.error("Erreur lors du chargement des artisans:", err);
        if (err instanceof AxiosError && err.response) {
            setError(err.response.data?.message || "Échec du chargement des artisans.");
        } else {
            setError("Échec du chargement des artisans (erreur inconnue).");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchArtisans();
  }, []); // Le tableau de dépendances vide signifie que cela ne s'exécute qu'une fois au montage

  if (loading) {
    return (
      <div className="container mx-auto p-4 grid grid-cols-1 md:grid-cols-2  lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, index) => (
          <Card key={index} className="flex flex-col space-y-3">
            <Skeleton className="h-[150px] w-full rounded-t-lg" />
            <div className="p-4 space-y-2">
              <Skeleton className="h-5 w-[180px]" />
              <Skeleton className="h-4 w-[220px]" />
              <Skeleton className="h-4 w-[100px]" />
            </div>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen font-inter bg-background text-foreground flex items-center justify-center">
        <p className="text-destructive text-lg">Erreur: {error}</p>
        <Button asChild className="mt-4">
          <Link to="/">Retour à l'accueil</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 font-inter">
      <h1 className="text-3xl font-geist font-bold mb-6 text-center text-primary">Nos Artisans Créateurs</h1>

      {artisans.length === 0 ? (
        <p className="text-center text-lg text-muted-foreground font-inter">Aucun artisan n'est enregistré pour le moment. Revenez bientôt !</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {artisans.map((artisan) => (
            <Card key={artisan._id} className="overflow-hidden flex flex-col h-full items-center text-center p-4">
              {artisan.profilePicture ? (
                <img src={artisan.profilePicture} alt={artisan.companyName || artisan.username} className="w-24 h-24 rounded-full object-cover mb-4 shadow-md" />
              ) : (
                <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center mb-4 text-gray-500 text-3xl font-bold font-geist">
                    {artisan.username.charAt(0).toUpperCase()}
                </div>
              )}
              <CardHeader className="flex-grow w-full">
                <CardTitle className="text-xl font-geist">{artisan.companyName || artisan.username}</CardTitle>
                {artisan.companyName && (
                  <CardDescription className="text-sm text-muted-foreground font-inter">
                    (Artisan: {artisan.username})
                  </CardDescription>
                )}
                <CardDescription className="text-sm mt-2 line-clamp-3 font-inter">
                  {artisan.bio || 'Découvrez les créations uniques de cet artisan passionné.'}
                </CardDescription>
              </CardHeader>
              <CardContent className="p-4 pt-0 w-full">
                <p className="text-base text-muted-foreground mb-4 font-inter">{artisan.email}</p>
                <Button asChild className="w-full font-inter">
                    <Link to={`/products?artisanId=${artisan._id}`}>Voir ses produits</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default ArtisansPage;