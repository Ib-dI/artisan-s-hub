
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/context/authContext';

interface ProtectedRouteProps {
  allowedRoles?: ('customer' | 'artisan')[]; // Rôles autorisés pour cette route
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ allowedRoles }) => {
  const { user, isLoading } = useAuth(); // Récupère l'utilisateur et l'état de chargement du contexte

  // Pendant le chargement, ne rien rendre pour éviter un flash de contenu non autorisé
  if (isLoading) {
    return <div className="flex justify-center items-center min-h-[calc(100vh-64px)] bg-background text-foreground">Chargement...</div>;
  }

  // Si l'utilisateur n'est pas connecté, redirige vers la page de connexion
  if (!user) {
    return <Navigate to="/login" replace />; // 'replace' évite d'ajouter la page protégée à l'historique
  }

  // Si des rôles spécifiques sont définis et que le rôle de l'utilisateur n'en fait pas partie, redirige
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Tu peux rediriger vers une page "Accès Refusé" ou la page d'accueil
    return <Navigate to="/" replace />;
  }

  // Si l'utilisateur est connecté et a le bon rôle, rend le composant enfant (la page protégée)
  return <Outlet />;
};

export default ProtectedRoute;