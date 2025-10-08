"use client"

import { Button } from "@/components/shadcn/button"
import { Sun } from "lucide-react"

export function ThemeToggleButton() {
  // Theme is forced to light mode, so this button is disabled
  return (
    <Button
      variant="outline"
      size="icon"
      disabled
      title="Light theme is enforced"
    >
      <Sun className="h-[1.2rem] w-[1.2rem]" />
      <span className="sr-only">Light theme (enforced)</span>
    </Button>
  )
}
