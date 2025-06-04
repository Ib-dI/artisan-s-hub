// frontend/src/pages/HomePage.tsx
import desertIsland from '@/assets/desert-island.webp';
import fingerprint from '@/assets/fingerprint.webp';
import sparklingHeart from '@/assets/sparkling-heart.webp';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import Autoplay from "embla-carousel-autoplay"; // Pour l'autoplay du carrousel (si vous l'installez)
import React from 'react';
import { Link } from 'react-router-dom';

// Assurez-vous d'avoir installé Autoplay si vous voulez le carrousel automatique:
// pnpm install embla-carousel-autoplay

const HomePage: React.FC = () => {
  // Configuration pour l'autoplay du carrousel
  const plugin = React.useRef(
    Autoplay({ delay: 4000, stopOnInteraction: false, stopOnMouseEnter: true })
  );

  return (
    <div className="min-h-[calc(100vh-64px)] bg-background text-foreground font-inter">
      {/* Section Héro - Visuel Impactant et Texte Clair */}
      <section
        className="relative h-[70vh] md:h-[80vh] flex items-center justify-center text-center bg-cover bg-center"
        style={{
          backgroundImage: "url('https://placehold.co/1920x1080/E0E7FF/333333/png?text=Artisanat+Authentique')", // Image plus lumineuse et douce
          backgroundAttachment: 'fixed', // Effet Parallax léger
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-background/70 to-transparent"></div> {/* Dégradé subtil */}
        <div className="relative z-10 text-foreground p-4 max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold mb-6 leading-tight drop-shadow-md text-primary font-geist">
            L'Artisanat à Portée de Main
          </h1>
          <p className="text-lg md:text-xl lg:text-2xl mb-10 opacity-90 font-medium text-muted-foreground">
            Découvrez des pièces uniques, faites avec passion et savoir-faire par des créateurs locaux.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-6">
            <Button asChild className="bg-primary text-primary-foreground hover:bg-primary/90 text-lg px-8 py-6 rounded-xl shadow-lg transition-all duration-300 transform hover:scale-105">
              <Link to="/products">Explorer les Créations</Link>
            </Button>
            <Button asChild variant="outline" className="text-foreground border-foreground/50 hover:bg-accent hover:text-accent-foreground text-lg px-8 py-6 rounded-xl shadow-lg transition-all duration-300 transform hover:scale-105">
              <Link to="/artisans">Rencontrer les Artisans</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Section "Pourquoi Nous Choisir" - Mise en avant des valeurs */}
      <section className="container mx-auto py-16 px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-primary font-geist">Pourquoi Artisan's Hub ?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="p-8 text-center shadow-lg border border-border rounded-xl transform hover:scale-105 transition-transform duration-300">
            <CardHeader className="flex flex-col items-center">
              <img src={sparklingHeart} alt="Qualité" className="w-16 h-16 mb-4" />
              <CardTitle className="text-2xl text-foreground font-geist">Qualité Exceptionnelle</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-muted-foreground">Chaque produit est fait à la main avec des matériaux de haute qualité et une attention aux détails.</CardDescription>
            </CardContent>
          </Card>
          <Card className="p-8 text-center shadow-lg border border-border rounded-xl transform hover:scale-105 transition-transform duration-300">
            <CardHeader className="flex flex-col items-center">
              <img src={desertIsland} alt="Soutien" className="w-16 h-16 mb-4" />
              <CardTitle className="text-2xl text-foreground font-geist">Soutien Local</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-muted-foreground">Achetez directement auprès d'artisans passionnés et contribuez à l'économie locale.</CardDescription>
            </CardContent>
          </Card>
          <Card className="p-8 text-center shadow-lg border border-border rounded-xl transform hover:scale-105 transition-transform duration-300">
            <CardHeader className="flex flex-col items-center">
              <img src={fingerprint} alt="Unicité" className="w-16 h-16 mb-4" />
              <CardTitle className="text-2xl text-foreground font-geist">Pièces Uniques</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-muted-foreground">Trouvez des créations originales que vous ne verrez nulle part ailleurs, avec une histoire.</CardDescription>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Section Catégories Populaires - Visuels clairs */}
      <section className="container mx-auto py-16 px-4 bg-card rounded-xl shadow-lg mb-16">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-primary font-geist">Explorez Nos Catégories Populaires</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Exemple de carte de catégorie */}
          <Link to="/products?category=Bijoux" className="group block">
            <Card className="overflow-hidden rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 transform group-hover:scale-105">
              <img src="https://images.unsplash.com/photo-1608042314453-ae338d80c427?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjR8fEJpam91eHxlbnwwfHwwfHx8MA%3D%3D" alt="Bijoux" className="w-full h-48 object-cover group-hover:brightness-90 transition-all duration-300" />
              <CardContent className="p-4 text-center">
                <CardTitle className="text-xl text-foreground group-hover:text-primary transition-colors duration-300">Bijoux</CardTitle>
              </CardContent>
            </Card>
          </Link>

          <Link to="/products?category=Décoration" className="group block">
            <Card className="overflow-hidden rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 transform group-hover:scale-105">
              <img src="https://images.unsplash.com/photo-1534349762230-e0cadf78f5da?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8ZCVDMyVBOWNvcmF0aW9ufGVufDB8fDB8fHww" alt="Décoration" className="w-full h-48 object-cover group-hover:brightness-90 transition-all duration-300" />
              <CardContent className="p-4 text-center">
                <CardTitle className="text-xl text-foreground group-hover:text-primary transition-colors duration-300">Décoration</CardTitle>
              </CardContent>
            </Card>
          </Link>

          <Link to="/products?category=Textile" className="group block">
            <Card className="overflow-hidden rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 transform group-hover:scale-105">
              <img src="https://images.unsplash.com/photo-1542044801-30d3e45ae49a?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8dGV4dGlsZXxlbnwwfHwwfHx8MA%3D%3D" alt="Textile" className="w-full h-48 object-cover group-hover:brightness-90 transition-all duration-300" />
              <CardContent className="p-4 text-center">
                <CardTitle className="text-xl text-foreground group-hover:text-primary transition-colors duration-300">Textile</CardTitle>
              </CardContent>
            </Card>
          </Link>

          <Link to="/products?category=Cuisine" className="group block">
            <Card className="overflow-hidden rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 transform group-hover:scale-105">
              <img src="https://images.unsplash.com/photo-1600489000022-c2086d79f9d4?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8Q3Vpc2luZXxlbnwwfHwwfHx8MA%3D%3D" alt="Cuisine" className="w-full h-48 object-cover group-hover:brightness-90 transition-all duration-300" />
              <CardContent className="p-4 text-center">
                <CardTitle className="text-xl text-foreground group-hover:text-primary transition-colors duration-300">Cuisine</CardTitle>
              </CardContent>
            </Card>
          </Link>
        </div>
      </section>

      {/* Section Carrousel de Témoignages - Design épuré */}
      <section className="bg-muted py-16 px-4">
        <div className="container mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-primary font-geist">Ce que nos clients disent</h2>
          <Carousel
            plugins={[plugin.current]}
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full max-w-4xl mx-auto"
            onMouseEnter={() => plugin.current.stop()}
            onMouseLeave={() => plugin.current.play()}
          >
            <CarouselContent className="-ml-4">
              {/* Chaque CarouselItem contient une seule Card */}
              <CarouselItem className="pl-4 md:basis-1/2 lg:basis-1/3">
                <Card className="p-6 h-full flex flex-col justify-between border border-border rounded-xl shadow-sm bg-card text-card-foreground">
                    <CardDescription className="italic text-lg mb-4">
                        "Artisan's Hub a transformé ma façon de faire du shopping. Chaque achat est une découverte, et la qualité est toujours au rendez-vous. Un grand merci aux artisans !"
                    </CardDescription>
                    <p className="font-semibold text-right text-muted-foreground">- Sophie L.</p>
                </Card>
              </CarouselItem>
              <CarouselItem className="pl-4 md:basis-1/2 lg:basis-1/3">
                <Card className="p-6 h-full flex flex-col justify-between border border-border rounded-xl shadow-sm bg-card text-card-foreground">
                    <CardDescription className="italic text-lg mb-4">
                        "Non seulement je trouve des produits magnifiques et uniques, mais je sais aussi que je soutiens directement des créateurs passionnés. C'est une plateforme formidable."
                    </CardDescription>
                    <p className="font-semibold text-right text-muted-foreground">- Marc D.</p>
                </Card>
              </CarouselItem>
              <CarouselItem className="pl-4 md:basis-1/2 lg:basis-1/3">
                <Card className="p-6 h-full flex flex-col justify-between border border-border rounded-xl shadow-sm bg-card text-card-foreground">
                    <CardDescription className="italic text-lg mb-4">
                        "L'expérience utilisateur est fluide et agréable. J'apprécie la diversité des produits et la facilité avec laquelle je peux trouver ce que je cherche."
                    </CardDescription>
                    <p className="font-semibold text-right text-muted-foreground">- Clara V.</p>
                </Card>
              </CarouselItem>
              <CarouselItem className="pl-4 md:basis-1/2 lg:basis-1/3">
                <Card className="p-6 h-full flex flex-col justify-between border border-border rounded-xl shadow-sm bg-card text-card-foreground">
                    <CardDescription className="italic text-lg mb-4">
                        "Je suis un artisan et je dois dire que cette plateforme est un rêve. Facile à utiliser pour gérer mes produits et une excellente visibilité."
                    </CardDescription>
                    <p className="font-semibold text-right text-muted-foreground">- Artisan Heureux</p>
                </Card>
              </CarouselItem>
            </CarouselContent>
            <CarouselPrevious className="hidden md:flex" />
            <CarouselNext className="hidden md:flex" />
          </Carousel>
        </div>
      </section>

      {/* Section Appel à l'action pour les artisans - Fond secondaire */}
      <section className="bg-secondary text-secondary-foreground py-16 px-4 text-center">
        <div className="container mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 font-geist">Vous êtes un artisan ?</h2>
          <p className="text-lg mb-8 opacity-90">Rejoignez notre communauté dynamique et partagez vos créations uniques avec un public passionné.</p>
          <Button asChild className="bg-primary text-primary-foreground hover:bg-primary/90 text-lg px-8 py-6 rounded-xl shadow-lg transition-all duration-300 transform hover:scale-105">
            <Link to="/register">Inscrivez-vous maintenant</Link>
          </Button>
        </div>
      </section>
    </div>
  );
};

export default HomePage;