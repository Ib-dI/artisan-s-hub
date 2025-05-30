// frontend/src/components/Navbar.tsx
import { Button } from "@/components/ui/button"; // Bouton de Shadcn/ui
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import ModeToggle from "./ModeToggle"; // Le composant de bascule du mode sombre
import { useAuth } from "@/context/authContext";

const Navbar: React.FC = () => {
	// Plus tard, nous ajouterons ici l'état de connexion de l'utilisateur

	const { user, logout } = useAuth();
	const navigate = useNavigate();
	const handleLogout = () => {
		logout();
    navigate("/")
	};
	const isAuthenticated = false; // Placeholder
	const userRole = "artisan" as const; // Placeholder

	return (
		<nav className="bg-background text-foreground shadow-sm py-4 px-6 flex justify-between items-center font-geist">
			{/* Logo / Nom de l'application */}
			<Link
				to="/"
				className="text-2xl font-bold text-primary hover:text-green-800 transition-colors duration-200"
			>
				<span className="font-surgena">Artisan's Hub</span>
			</Link>

			{/* Liens de navigation */}
			<div className="flex items-center space-x-6">
				<Link
					to="/products"
					className="text-foreground hover:text-primary transition-colors duration-200"
				>
					Produits
				</Link>
				<Link
					to="/artisans"
					className="text-foreground hover:text-primary transition-colors duration-200"
				>
					Artisans
				</Link>
				{/* Liens conditionnels basés sur l'authentification et le rôle */}
				{isAuthenticated ? (
					<>
						{userRole === "artisan" && (
							<Link
								to="/dashboard"
								className="text-foreground hover:text-primary transition-colors duration-200"
							>
								Mon Espace Artisan
							</Link>
						)}
						<Button
            onClick={handleLogout}
							variant="ghost"
							className="text-foreground hover:text-primary"
						>
							Déconnexion
						</Button>
						<Link
							to="/profile"
							className="text-foreground hover:text-primary transition-colors duration-200"
						>
							Profil
						</Link>
					</>
				) : (
					<>
						<Link
							to="/login"
							className="text-foreground hover:text-primary transition-colors duration-200"
						>
							<Button variant="ghost">Connexion</Button>
						</Link>
						<Link
							to="/register"
							className="text-primary hover:text-primary-foreground transition-colors duration-200"
						>
							<Button>Inscription</Button>
						</Link>
					</>
				)}
				<ModeToggle /> {/* Le bouton de bascule du mode sombre */}
			</div>
		</nav>
	);
};

export default Navbar;
