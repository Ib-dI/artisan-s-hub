// frontend/src/pages/ProductsPage.tsx
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton'; // Pour un état de chargement visuel
import api from '@/lib/api'; // Votre instance Axios
import { AxiosError } from 'axios';
import React, { useEffect, useState } from 'react';
import { useCart } from '@/context/cartContext'; 
import { Button } from '@/components/ui/button';

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  imageUrl: string;
  quantity: number;
  artisan: { // Nous allons modifier le backend pour inclure l'artisan
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

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await api.get('/products'); // Endpoint pour tous les produits
        setProducts(response.data);
      } catch (err: unknown) {
        if (err instanceof AxiosError) {
          console.error("Erreur lors du chargement des produits:", err);
          setError(err.response?.data?.message || "Échec du chargement des produits.");
        } else {
          setError("Une erreur inattendue s'est produite.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []); // Le tableau de dépendances vide signifie que cela s'exécute une fois au montage

  // Fontion pour gérer l'ajout au panier
  const handleAddToCart = (product: Product) => {
    addToCart({
      _id: product._id,
      name: product.name,
      imageUrl: product.imageUrl,
      price: product.price,
      quantity: 1,
      countInStock: product.quantity,
    })
    alert(`${product.name} a été ajouté au panier !`)
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-geist font-bold mb-6 text-center">Nos Produits Artisanaux</h1>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, index) => ( // Affiche 6 squelettes pendant le chargement
            <Card key={index} className="flex flex-col space-y-3">
              <Skeleton className="h-[200px] w-full rounded-t-lg" />
              <div className="p-4 space-y-2">
                <Skeleton className="h-2 w-[200px]" />
                <Skeleton className="h-2 w-[250px]" />
                <Skeleton className="h-2 w-[150px]" />
              </div>
            </Card>
          ))}
        </div>
      ) : error ? (
        <p className="text-red-500 text-center text-lg">{error}</p>
      ) : products.length === 0 ? (
        <p className="text-center text-lg text-muted-foreground">Aucun produit disponible pour le moment.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <Card key={product._id} className="overflow-hidden font-inter flex flex-col h-full">
              <img src={product.imageUrl || 'https://via.placeholder.com/300'} alt={product.name} className="w-[275px] self-center rounded-xl h-48 object-cover" />
              <CardHeader className="flex-grow">
                <CardTitle className="text-xl">{product.name}</CardTitle>
                <CardDescription className="text-sm text-muted-foreground">
                  Par {product.artisan?.companyName || product.artisan?.username || 'Artisan inconnu'}
                </CardDescription>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <p className="text-lg font-semibold mb-2">{product.price.toFixed(2)} €</p>
                <p className="text-sm text-muted-foreground line-clamp-2">{product.description}</p>
                {/* Un bouton pour voir les détails du produit si vous implémentez une page de détails */}
                {/* <Button className="mt-4 w-full">Voir Détails</Button> */}
                {product.quantity > 0 ? (
                  <Button className='mt-4 w-full' onClick={() => handleAddToCart(product)}>
                    Ajouter au panier
                  </Button>
                ) : (
                  <Button className='mt-4 w-full' disabled>
                    En rupture de stock
                  </Button>
                )
                }
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductsPage;