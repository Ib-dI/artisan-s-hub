// frontend/src/RegisterPage.tsx
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'; // Pour le choix du rôle
import type { RegisterData } from '@/context/authContext';
import { useAuth } from '@/context/authContext';
import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';
// Installe le composant radio-group : npx shadcn-ui@latest add radio-group

// Schéma de validation avec Zod
const formSchema = z.object({
  username: z.string().min(3, { message: "Le nom d'utilisateur doit contenir au moins 3 caractères." }),
  email: z.string().email({ message: "Adresse email invalide." }),
  password: z.string().min(6, { message: "Le mot de passe doit contenir au moins 6 caractères." }),
  role: z.enum(['customer', 'artisan']), // Validation du rôle
  companyName: z.string().optional(), // Optionnel par défaut
  description: z.string().optional(),
}).superRefine((data, ctx) => { // Validation conditionnelle pour le rôle artisan
  if (data.role === 'artisan' && (!data.companyName || data.companyName.trim() === '')) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Le nom de l'entreprise est requis pour un artisan.",
      path: ['companyName'],
    });
  }
});

const RegisterPage: React.FC = () => {
  const { register: authRegister, isLoading, error } = useAuth(); // Renomme register pour éviter le conflit
  const navigate = useNavigate();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      role: "customer", // Valeur par défaut
      companyName: "",
      description: "",
    },
  });

  const selectedRole = form.watch("role"); // Surveille le changement du rôle

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const userDataToSend: RegisterData = {
        username: values.username,
        email: values.email,
        password: values.password,
        role: values.role,
        ...(values.role === 'artisan' && values.companyName ? {
          artisanDetails: {
            companyName: values.companyName,
            description: values.description || undefined
          }
        } : {})
      };

      await authRegister(userDataToSend);
      navigate(values.role === 'artisan' ? '/dashboard' : '/');
    } catch (err) {
      console.error("Erreur d'inscription dans le composant", err);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[calc(100vh-64px)] bg-background p-4 font-inter">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-geist text-primary">Inscription</CardTitle>
          <CardDescription className="font-inter">
            Créez votre compte Artisan's Hub.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-inter">Nom d'utilisateur</FormLabel>
                    <FormControl>
                      <Input className="font-inter" placeholder="Votre nom d'utilisateur" {...field} />
                    </FormControl>
                    <FormMessage className="font-inter" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-inter">Email</FormLabel>
                    <FormControl>
                      <Input className="font-inter" placeholder="votre.email@exemple.com" {...field} />
                    </FormControl>
                    <FormMessage className="font-inter" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-inter">Mot de passe</FormLabel>
                    <FormControl>
                      <Input className="font-inter" type="password" placeholder="********" {...field} />
                    </FormControl>
                    <FormMessage className="font-inter" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel className="font-inter">Je suis un(e)...</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex flex-col space-y-1"
                      >
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="customer" />
                          </FormControl>
                          <FormLabel className="font-normal font-inter">
                            Client(e)
                          </FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="artisan" />
                          </FormControl>
                          <FormLabel className="font-normal font-inter">
                            Artisan(e)
                          </FormLabel>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage className="font-inter" />
                  </FormItem>
                )}
              />

              {selectedRole === 'artisan' && (
                <>
                  <FormField
                    control={form.control}
                    name="companyName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-inter">Nom de l'entreprise</FormLabel>
                        <FormControl>
                          <Input className="font-inter" placeholder="Mon Atelier Créatif" {...field} />
                        </FormControl>
                        <FormMessage className="font-inter" />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-inter">Description (Optionnel)</FormLabel>
                        <FormControl>
                          <Input className="font-inter" placeholder="Décrivez votre travail..." {...field} />
                        </FormControl>
                        <FormMessage className="font-inter" />
                      </FormItem>
                    )}
                  />
                </>
              )}

              {error && <p className="text-red-500 text-sm font-inter">{error}</p>}
              <Button type="submit" className="w-full font-inter" disabled={isLoading}>
                {isLoading ? "Inscription en cours..." : "S'inscrire"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default RegisterPage;