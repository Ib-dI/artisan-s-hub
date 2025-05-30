// frontend/src/DashboardPage.tsx
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'; // Composants Table
import { useAuth } from '@/context/authContext';
import api from '@/lib/api'; // Pour les appels API
import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'; // Composants Dialog
import { Edit, PlusCircle, Trash2 } from 'lucide-react'; // Icônes

// Importe les formulaires pour ajouter/modifier
import { AxiosError } from 'axios';
import AddProductForm from './components/AddProductForm';
import EditProductForm from './components/EditProductForm';

// Interface pour un produit (doit correspondre à ton modèle backend)
interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  imageUrl: string;
  quantity: number;
  artisan: string; // ID de l'artisan
  createdAt: string;
  updatedAt: string;
}

const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState<boolean>(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState<boolean>(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Vérification du rôle de l'utilisateur
  useEffect(() => {
    if (user && user.role !== 'artisan') {
      navigate('/');
    }
  }, [user, navigate]);

  // Fonction pour charger les produits de l'artisan
  const fetchProducts = useCallback(async () => {
    if (!user || user.role !== 'artisan') {
      setError("Accès non autorisé.");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const response = await api.get('/products/artisan');
      setProducts(response.data);
    } catch (err) {
      if (err instanceof AxiosError) {
        console.error("Erreur lors du chargement des produits:", err);
        if (err.response?.status === 403) {
          setError("Vous n'avez pas les permissions nécessaires pour accéder à cette page.");
          navigate('/');
        } else {
          setError(err.response?.data?.message || "Échec du chargement des produits.");
        }
      }
    } finally {
      setLoading(false);
    }
  }, [user, navigate]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Fonctions de gestion des actions (ajouter, modifier, supprimer)
  const handleProductAdded = () => {
    setIsAddDialogOpen(false); // Ferme la boîte de dialogue
    fetchProducts(); // Recharge la liste des produits
  };

  const handleEditProduct = (product: Product) => {
    setSelectedProduct(product);
    setIsEditDialogOpen(true);
  };

  const handleProductUpdated = () => {
    setIsEditDialogOpen(false);
    setSelectedProduct(null);
    fetchProducts(); // Recharge la liste
  };

  const handleDeleteProduct = async (productId: string) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce produit ?")) {
      try {
        await api.delete(`/products/${productId}`); // Endpoint de suppression
        fetchProducts(); // Recharge la liste
      } catch (err: unknown) {
        if (err instanceof AxiosError) {
          console.error("Erreur lors de la suppression du produit:", err);
          setError(err.response?.data?.message || "Échec de la suppression du produit.");
        }
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-64px)]">
        <p>Chargement...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-64px)]">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>Mes Produits</CardTitle>
          <CardDescription>Gérez vos produits ici</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-end mb-4">
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Ajouter un produit
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Ajouter un nouveau produit</DialogTitle>
                </DialogHeader>
                <AddProductForm onProductAdded={handleProductAdded} />
              </DialogContent>
            </Dialog>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nom</TableHead>
                <TableHead>Prix</TableHead>
                <TableHead>Catégorie</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((product) => (
                <TableRow key={product._id}>
                  <TableCell>{product.name}</TableCell>
                  <TableCell>{product.price}€</TableCell>
                  <TableCell>{product.category}</TableCell>
                  <TableCell>{product.quantity}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEditProduct(product)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteProduct(product._id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Modifier le produit</DialogTitle>
          </DialogHeader>
          {selectedProduct && (
            <EditProductForm
              product={selectedProduct}
              onProductUpdated={handleProductUpdated}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DashboardPage;