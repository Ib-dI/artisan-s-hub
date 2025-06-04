// frontend/src/ProfilePage.tsx
// import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/context/authContext';

// Définition des types pour l'utilisateur (peut être partagée depuis authContext.tsx si besoin)
// interface User {
//   _id: string;
//   username: string;
//   email: string;
//   role: 'customer' | 'artisan';
//   token: string;
//   artisanDetails?: {
//     companyName: string;
//     description?: string;
//   };
// }

const ProfilePage: React.FC = () => {
  const { user } = useAuth(); // Récupère l'utilisateur du contexte

  if (!user) {
    // Cela ne devrait normalement pas arriver grâce à ProtectedRoute, mais c'est une bonne sécurité
    return (
      <div className="min-h-[calc(100vh-64px)] bg-background text-foreground flex justify-center items-center p-4 font-inter">
        <p className="font-inter">Veuillez vous connecter pour voir votre profil.</p>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-64px)] bg-background text-foreground flex justify-center items-center p-4 font-inter">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-geist text-primary">Mon Profil</CardTitle>
          <CardDescription className="font-inter">
            Informations de votre compte Artisan's Hub.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label className="block text-sm font-medium text-muted-foreground font-inter">Nom d'utilisateur</Label>
            <p className="text-lg font-geist">{user.username}</p>
          </div>
          <div>
            <Label className="block text-sm font-medium text-muted-foreground font-inter">Email</Label>
            <p className="text-lg font-geist">{user.email}</p>
          </div>
          <div>
            <Label className="block text-sm font-medium text-muted-foreground font-inter">Rôle</Label>
            <p className="text-lg font-geist capitalize">{user.role}</p> {/* 'capitalize' met la première lettre en majuscule */}
          </div>

          {user.role === 'artisan' && user.artisanDetails && (
            <div className="space-y-4 pt-4 border-t border-border mt-4">
              <h3 className="text-xl font-geist text-primary">Détails Artisan</h3>
              <div>
                <Label className="block text-sm font-medium text-muted-foreground font-inter">Nom de l'entreprise</Label>
                <p className="text-lg font-geist">{user.artisanDetails.companyName}</p>
              </div>
              {user.artisanDetails.description && (
                <div>
                  <Label className="block text-sm font-medium text-muted-foreground font-inter">Description</Label>
                  <p className="text-lg font-geist">{user.artisanDetails.description}</p>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfilePage;