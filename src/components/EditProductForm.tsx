// frontend/src/components/EditProductForm.tsx
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import api from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

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

// Schéma de validation pour la modification de produit (identique à l'ajout)
const productFormSchema = z.object({
  name: z.string().min(3, { message: "Le nom du produit doit contenir au moins 3 caractères." }),
  description: z.string().min(10, { message: "La description est trop courte." }),
  price: z.preprocess(
    (val) => Number(val),
    z.number().positive({ message: "Le prix doit être un nombre positif." })
  ),
  category: z.string().min(1, { message: "La catégorie est requise." }),
  imageUrl: z.string().url({ message: "L'URL de l'image est invalide." }).optional().or(z.literal('')),
  quantity: z.preprocess(
    (val) => Number(val),
    z.number().int().min(0, { message: "La quantité doit être un nombre entier positif ou nul." })
  ),
});

interface EditProductFormProps {
  product: Product; // Le produit à modifier
  onProductUpdated: () => void; // Callback quand un produit est modifié
}

const EditProductForm: React.FC<EditProductFormProps> = ({ product, onProductUpdated }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<z.infer<typeof productFormSchema>>({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      name: product.name,
      description: product.description,
      price: product.price,
      category: product.category,
      imageUrl: product.imageUrl || '', // Gère le cas où imageUrl est null
      quantity: product.quantity,
    },
  });

  // Met à jour les valeurs par défaut du formulaire si le produit change (utile si la modale reste ouverte)
  useEffect(() => {
    form.reset({
      name: product.name,
      description: product.description,
      price: product.price,
      category: product.category,
      imageUrl: product.imageUrl || '',
      quantity: product.quantity,
    });
  }, [product, form]);


  const onSubmit = async (values: z.infer<typeof productFormSchema>) => {
    setIsLoading(true);
    setError(null);
    try {
      await api.put(`/products/${product._id}`, values); // Envoie les données au backend
      onProductUpdated(); // Déclenche le callback pour fermer la modale et recharger
    } catch (err: unknown) {
      console.error("Erreur lors de la mise à jour du produit:", err);
      if (typeof err === "object" && err !== null && "response" in err && typeof (err as any).response === "object") {
        setError((err as { response?: { data?: { message?: string } } }).response?.data?.message || "Échec de la mise à jour du produit.");
      } else {
        setError("Échec de la mise à jour du produit.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-inter">Nom du produit</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-inter">Description</FormLabel>
              <FormControl>
                <Textarea {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="price"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-inter">Prix (€)</FormLabel>
              <FormControl>
                <Input type="number" step="0.01" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-inter">Catégorie</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionnez une catégorie" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="jewelry">Bijoux</SelectItem>
                  <SelectItem value="pottery">Poterie</SelectItem>
                  <SelectItem value="textile">Textile</SelectItem>
                  <SelectItem value="woodwork">Bois</SelectItem>
                  <SelectItem value="painting">Peinture</SelectItem>
                  <SelectItem value="other">Autre</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="imageUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-inter">URL de l'image (Optionnel)</FormLabel>
              <FormControl>
                <Input {...field} placeholder="https://exemple.com/image.jpg" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="quantity"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-inter">Quantité en stock</FormLabel>
              <FormControl>
                <Input type="number" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {error && <p className="text-red-500 text-sm font-inter">{error}</p>}
        <Button type="submit" className="w-full font-geist" disabled={isLoading}>
          {isLoading ? "Mise à jour..." : "Modifier le produit"}
        </Button>
      </form>
    </Form>
  );
};

export default EditProductForm;