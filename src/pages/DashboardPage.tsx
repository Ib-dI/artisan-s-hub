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

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'; // Composants Dialog
import { Edit, PlusCircle, Trash2 } from 'lucide-react'; // Icônes

// Importe les formulaires pour ajouter/modifier
import { AxiosError } from 'axios';
import AddProductForm from '../components/AddProductForm';
import EditProductForm from '../components/EditProductForm';

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
  console.log('État de l\'utilisateur dans Dashboard:', user);
  console.log('Rôle de l\'utilisateur:', user?.role);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState<boolean>(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState<boolean>(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

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
    } catch (err: unknown) {
      if (err instanceof AxiosError) {
        console.error("Erreur lors du chargement des produits:", err);
        setError(err.response?.data?.message || "Échec du chargement des produits.");
      }
    } finally {
      setLoading(false);
    }
  }, [user]);

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

  if (!user || user.role !== 'artisan') {
    return (
      <div className="min-h-[calc(100vh-64px)] bg-background text-foreground flex justify-center items-center p-4 font-inter">
        <Card className="max-w-md w-full text-center">
          <CardHeader>
            <CardTitle className="text-2xl font-geist text-destructive">Accès Refusé</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription className="font-inter">
              Vous devez être connecté en tant qu'artisan pour accéder à ce tableau de bord.
            </CardDescription>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-64px)] bg-background text-foreground p-8 font-inter">
      <Card className="w-full">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div>
            <CardTitle className="text-3xl font-geist text-primary">Mon Espace Artisan</CardTitle>
            <CardDescription className="font-inter mt-2">
              Gérez vos produits, commandes et informations de profil.
            </CardDescription>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="font-inter">
                <PlusCircle className="mr-2 h-4 w-4" /> Ajouter un produit
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle className="font-geist text-primary">Ajouter un nouveau produit</DialogTitle>
                <CardDescription className="font-inter">
                  Remplissez les informations du nouveau produit.
                </CardDescription>
              </DialogHeader>
              <AddProductForm onProductAdded={handleProductAdded} />
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          {loading && (
            <div className="flex justify-center items-center h-40">
              <p className="font-inter">Chargement des produits...</p>
            </div>
          )}
          {error && <p className="text-red-500 font-inter text-center mt-4">{error}</p>}
          {!loading && !error && products.length === 0 && (
            <p className="text-center text-muted-foreground font-inter mt-4">Vous n'avez pas encore de produits. Ajoutez-en un !</p>
          )}
          {!loading && !error && products.length > 0 && (
            <div className="overflow-x-auto">
              <Table className="min-w-[700px] mt-4">
                <TableHeader>
                  <TableRow>
                    <TableHead className="font-geist">Image</TableHead>
                    <TableHead className="font-geist">Nom</TableHead>
                    <TableHead className="font-geist">Catégorie</TableHead>
                    <TableHead className="font-geist">Prix</TableHead>
                    <TableHead className="font-geist">Stock</TableHead>
                    <TableHead className="font-geist text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {products.map((product) => (
                    <TableRow key={product._id}>
                      <TableCell>
                        <img src={product.imageUrl || 'https://via.placeholder.com/50'} alt={product.name} className="w-12 h-12 object-cover rounded-md" />
                      </TableCell>
                      <TableCell className="font-inter font-medium">{product.name}</TableCell>
                      <TableCell className="font-inter">{product.category}</TableCell>
                      <TableCell className="font-geist">{product.price.toFixed(2)} €</TableCell>
                      <TableCell className="font-inter">{product.quantity}</TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEditProduct(product)}
                          className="mr-2 font-inter"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteProduct(product._id)}
                          className="font-inter"
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dialog pour l'édition */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="font-geist text-primary">Modifier le produit</DialogTitle>
            <CardDescription className="font-inter">
              Modifiez les informations du produit.
            </CardDescription>
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