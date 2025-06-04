// frontend/src/pages/ProductsPage.tsx
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'; // Importez les composants Select
import { Skeleton } from '@/components/ui/skeleton'; // Pour un état de chargement visuel
import type { CartItem } from '@/context/cartContext';
import { useCart } from '@/context/cartContext';
import api from '@/lib/api'; // Votre instance Axios
import { AxiosError } from 'axios';
import { Search } from 'lucide-react'; // Icône de recherche
import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';

// Mettre à jour l'interface Product pour correspondre au backend et à l'usage ici
interface Product {
_id: string;
name: string;
description: string;
price: number;
category: string;
imageUrl: string;
quantity: number; // Stock disponible
artisan: {
  _id: string;
  username: string;
  companyName?: string;
};
}

const ProductsPage: React.FC = () => {
const { addToCart } = useCart();
const [products, setProducts] = useState<Product[]>([]);
const [loading, setLoading] = useState<boolean>(true);
const [error, setError] = useState<string | null>(null);
const [keyword, setKeyword] = useState<string>('');
const [category, setCategory] = useState<string>('all');
const [searchParams, setSearchParams] = useSearchParams();
const artisanId = searchParams.get('artisanId');
const [artisanName, setArtisanName] = useState<string>('');

// Liste des catégories disponibles
const categories = ['Bijoux', 'Vêtements', 'Décoration', 'Mobilier', 'Alimentation', 'Beauté', 'Autres'];

useEffect(() => {
  const fetchArtisanName = async () => {
    if (artisanId) {
      try {
        const { data } = await api.get(`/auth/users/${artisanId}`);
        setArtisanName(data.companyName || data.username);
      } catch (err) {
        console.error("Erreur lors du chargement du nom de l'artisan:", err);
      }
    }
  };
  fetchArtisanName();
}, [artisanId]);

useEffect(() => {
  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const queryParams = new URLSearchParams();
      if (keyword) {
        queryParams.append('keyword', keyword);
      }
      if (category && category !== 'all') {
        queryParams.append('category', category);
      }
      if (artisanId) {
        queryParams.append('artisanId', artisanId);
      }

      const response = await api.get<Product[]>(`/products?${queryParams.toString()}`);
      setProducts(response.data);
    } catch (err) {
      console.error("Erreur lors du chargement des produits:", err);
      if (err instanceof AxiosError && err.response) {
          setError(err.response.data?.message || "Échec du chargement des produits.");
      } else {
          setError("Échec du chargement des produits (erreur inconnue).");
      }
    } finally {
      setLoading(false);
    }
  };

  fetchProducts();
}, [keyword, category, artisanId]); // Ajout de artisanId comme dépendance

const handleAddToCart = (product: Product) => {
  if (product.quantity <= 0) {
      toast.error(`${product.name} est en rupture de stock.`);
      return;
  }

  const itemToAdd: CartItem = {
    _id: product._id,
    name: product.name,
    imageUrl: product.imageUrl,
    price: product.price,
    quantity: 1,
    countInStock: product.quantity,
  };

  addToCart(itemToAdd);
  toast.success(`${product.name} a été ajouté au panier !`);
};

const handleSearch = (e: React.FormEvent) => {
  e.preventDefault();
  // La recherche se déclenche automatiquement via useEffect quand `keyword` change
  // Pas besoin de refetch ici, juste s'assurer que le keyword est mis à jour
};

return (
  <div className="container mx-auto p-4 font-inter">
    <h1 className="text-3xl font-geist font-bold mb-6 text-center text-primary">
      {artisanId ? `Produits de ${artisanName}` : 'Nos Produits Artisanaux'}
    </h1>

    {/* Barre de recherche et filtres */}
    <div className="flex flex-col md:flex-row gap-4 mb-8">
      <form onSubmit={handleSearch} className="flex-grow flex items-center space-x-2">
        <Input
          type="text"
          placeholder="Rechercher des produits..."
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          className="flex-grow font-inter"
        />
        <Button type="submit" size="icon" className="font-inter">
          <Search className="h-4 w-4" />
        </Button>
      </form>

      <Select value={category} onValueChange={setCategory}>
        <SelectTrigger className="w-full md:w-[180px] font-inter">
          <SelectValue placeholder="Toutes les catégories" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all" className="font-inter">Toutes les catégories</SelectItem>
          {categories.map((cat) => (
            <SelectItem key={cat} value={cat} className="font-inter">{cat}</SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Button 
        onClick={() => { 
          setKeyword(''); 
          setCategory('all');
          if (artisanId) {
            setSearchParams({});
          }
        }}
        className="font-inter"
      >
        Réinitialiser les filtres
      </Button>
    </div>

    {loading ? (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, index) => (
          <Card key={index} className="flex flex-col space-y-3">
            <Skeleton className="h-[200px] w-full rounded-t-lg" />
            <div className="p-4 space-y-2">
              <Skeleton className="h-4 w-[200px]" />
              <Skeleton className="h-4 w-[250px]" />
              <Skeleton className="h-4 w-[150px]" />
            </div>
          </Card>
        ))}
      </div>
    ) : error ? (
      <p className="text-red-500 text-center text-lg font-inter">{error}</p>
    ) : products.length === 0 ? (
      <p className="text-center text-lg text-muted-foreground font-inter">Aucun produit trouvé pour votre recherche.</p>
    ) : (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map((product) => (
          <Card key={product._id} className="overflow-hidden flex flex-col h-full">
            <img src={product.imageUrl || 'https://via.placeholder.com/300'} alt={product.name} className="w-full h-48 object-cover" />
            <CardHeader className="flex-grow">
              <CardTitle className="text-xl font-geist">{product.name}</CardTitle>
              <CardDescription className="text-sm text-muted-foreground font-inter">
                Par {product.artisan?.companyName || product.artisan?.username || 'Artisan inconnu'}
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <p className="text-lg font-geist font-semibold mb-2">{product.price.toFixed(2)} €</p>
              <p className="text-sm text-muted-foreground line-clamp-2 font-inter">{product.description}</p>
              {product.quantity > 0 ? (
                <Button className="mt-4 w-full font-inter" onClick={() => handleAddToCart(product)}>
                  Ajouter au panier
                </Button>
              ) : (
                <Button className="mt-4 w-full font-inter" disabled>
                  En rupture de stock
                </Button>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    )}
  </div>
);
};

export default ProductsPage;