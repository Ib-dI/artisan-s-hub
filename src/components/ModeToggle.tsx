// frontend/src/components/mode-toggle.tsx

import { useTheme } from "@/components/ThemeProvider"
import { Moon, Sun } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function ModeToggle() {
  const { setTheme } = useTheme()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        {/* Le Button est l'enfant unique du DropdownMenuTrigger. */}
        {/* Nous nous assurons que le Button lui-même n'a qu'UN SEUL enfant direct */}
        {/* en enveloppant TOUT son contenu visible et accessible dans un seul fragment ou div. */}
        <Button variant="ghost" size="icon" className="hover:bg-transparent">
          {/* Utilisation d'un fragment React pour grouper les icônes et le span sr-only */}
          {/* Le Button reçoit un seul enfant (le fragment), qui contient ensuite les icônes et le span */}
          <>
            <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 text-foreground" />
            <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 text-foreground" />
            <span className="sr-only">Toggle theme</span>
          </>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setTheme("light")}>
          Clair
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")}>
          Sombre
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("system")}>
          Système
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}