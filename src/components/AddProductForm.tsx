// frontend/src/components/AddProductForm.tsx
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import api from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea'; // Pour la description
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'; // Pour la catégorie

// Schéma de validation pour l'ajout de produit
const productFormSchema = z.object({
  name: z.string().min(3, { message: "Le nom du produit doit contenir au moins 3 caractères." }),
  description: z.string().min(10, { message: "La description est trop courte." }),
  price: z.preprocess(
    (val) => Number(val),
    z.number().positive({ message: "Le prix doit être un nombre positif." })
  ),
  category: z.string().min(1, { message: "La catégorie est requise." }),
  imageUrl: z.string().url({ message: "L'URL de l'image est invalide." }).optional().or(z.literal('')), // Rendre optionnel mais valider si rempli
  quantity: z.preprocess(
    (val) => Number(val),
    z.number().int().min(0, { message: "La quantité doit être un nombre entier positif ou nul." })
  ),
});

interface AddProductFormProps {
  onProductAdded: () => void; // Callback quand un produit est ajouté
}

const AddProductForm: React.FC<AddProductFormProps> = ({ onProductAdded }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<z.infer<typeof productFormSchema>>({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      name: "",
      description: "",
      price: 0,
      category: "",
      imageUrl: "",
      quantity: 0,
    },
  });

  const onSubmit = async (values: z.infer<typeof productFormSchema>) => {
    setIsLoading(true);
    setError(null);
    try {
      await api.post('/products', values); // Envoie les données au backend
      onProductAdded(); // Déclenche le callback pour fermer la modale et recharger
      form.reset(); // Réinitialise le formulaire
    } catch (err: any) {
      console.error("Erreur lors de l'ajout du produit:", err);
      setError(err.response?.data?.message || "Échec de l'ajout du produit.");
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
          {isLoading ? "Ajout en cours..." : "Ajouter le produit"}
        </Button>
      </form>
    </Form>
  );
};

export default AddProductForm;