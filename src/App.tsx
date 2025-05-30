import { Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar'; // Importe la Navbar
import ProtectedRoute from './components/ProtectedRoute';
import LoginPage from './LoginPage';
import RegisterPage from './RegisterPage';
import ProfilePage from './ProfilePage';

function HomePage() {
  return (
    <div className="min-h-[calc(100vh-64px)] bg-background text-foreground flex flex-col items-center justify-center p-4">
      <h1 className="font-geist font-bold text-primary mb-6 animate-pulse text-600 text-balance mx-auto max-w-[600px] text-center text-4xl  !leading-[1.0] tracking-tighter lg:max-w-[900px] md:text-6xl">
        Bienvenue sur Artisan's Hub.
      </h1>
      <p className="text-md md:text-xl px-2.5 font-inter text-foreground mb-8">
        Découvrez des créations uniques et faites main par des artisans passionnés. Chaque pièce raconte une histoire, 
        témoigne d'un savoir-faire ancestral et incarne l'authenticité de l'artisanat local. Des bijoux délicats aux 
        meubles d'exception, chaque création est le fruit d'une passion et d'un engagement pour l'excellence.
      </p>
      {/* Plus tard, ajoutera un carrousel de produits ou des sections de découverte */}
    </div>
  );
}

function ProductsPage() {
  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
      <h2 className="text-4xl font-geist">Liste des produits (à venir)</h2>
    </div>
  );
}

function ArtisansPage() {
  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
      <h2 className="text-4xl font-geist">Liste des artisans (à venir)</h2>
    </div>
  );
}



function DashboardPage() {
  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
      <h2 className="text-4xl font-geist">Mon Espace Artisan (à faire)</h2>
    </div>
  );
}



function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar /> {/* Inclut la barre de navigation en haut de toutes les pages */}
      <main className="flex-grow"> {/* Permet au contenu de prendre l'espace restant */}
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/artisans" element={<ArtisansPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          {/* Routes protégées - Nécessitent d'être connecté */}
          <Route element={<ProtectedRoute />}>
            <Route path="/profile" element={<ProfilePage />} />
            {/* Toutes les routes imbriquées ici nécessitent une connexion */}
          </Route>

          {/* Routes spécifiques aux artisans - Nécessitent le rôle 'artisan' */}
          <Route element={<ProtectedRoute allowedRoles={['artisan']} />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            {/* D'autres routes artisan-spécifiques iront ici */}
          </Route>

          {/* Route 404 (Optionnel, mais bonne pratique) */}
          <Route path="*" element={
            <div className="min-h-[calc(100vh-64px)] bg-background text-foreground flex flex-col items-center justify-center">
              <h1 className="text-6xl font-geist text-destructive">404</h1>
              <p className="text-xl font-inter">Page non trouvée</p>
            </div>
          } />

        </Routes>
      </main>
    </div>
  );
}

export default App;