"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Utensils, Play } from "lucide-react";

export default function Home() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8 text-center">
        {/* Hero section */}
        <div className="space-y-4">
          <div className="flex justify-center">
            <div className="bg-white p-6 rounded-full shadow-2xl">
              <Utensils size={64} className="text-blue-600" />
            </div>
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Split the Bill
          </h1>
          <p className="text-xl text-muted-foreground">
            Swipe para dividir la cuenta
          </p>
        </div>

        {/* Demo button */}
        <div className="space-y-3">
          <Button
            size="lg"
            className="w-full h-16 text-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 gap-3"
            onClick={() => router.push("/demo")}
          >
            <Play size={24} />
            Iniciar Demo
          </Button>
          <p className="text-sm text-muted-foreground">
            Desliza <span className="text-red-500 font-bold">←</span> para NO o{" "}
            <span className="text-green-500 font-bold">→</span> para SÍ
          </p>
        </div>

        {/* Features */}
        <div className="bg-white/80 backdrop-blur-sm rounded-lg p-6 text-left space-y-3">
          <h3 className="font-semibold text-center mb-4">Cómo funciona:</h3>
          <div className="space-y-2 text-sm text-muted-foreground">
            <p>✓ Swipe en cada item de la cuenta</p>
            <p>✓ División automática entre comensales</p>
            <p>✓ Ver el total a pagar al instante</p>
          </div>
        </div>
      </div>
    </div>
  );
}
