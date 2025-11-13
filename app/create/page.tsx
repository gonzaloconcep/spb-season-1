"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { NameInput } from "@/components/onboarding/NameInput";
import { PaymentMethodSelector } from "@/components/onboarding/PaymentMethodSelector";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { PaymentMethod } from "@/lib/types/session";
import { useSession } from "@/lib/hooks/useSession";
import { id } from "@instantdb/react";

type Step = "name" | "payment" | "config";

export default function CreateSessionPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("name");
  const [name, setName] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | null>(
    null
  );
  const [totalComensales, setTotalComensales] = useState<number | undefined>();
  const [isCreating, setIsCreating] = useState(false);

  // Generate a session ID for the hook
  const sessionId = id();
  const { createSession, addBillItems } = useSession(sessionId);

  const handleNameSubmit = (inputName: string) => {
    setName(inputName);
    setStep("payment");
  };

  const handlePaymentMethodSubmit = (method: PaymentMethod) => {
    setPaymentMethod(method);
    setStep("config");
  };

  const handleCreateSession = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !paymentMethod) return;

    setIsCreating(true);

    try {
      const { sessionId } = await createSession(
        name,
        paymentMethod,
        totalComensales
      );

      // Add sample bill items (you can modify this or add a UI to input items)
      await addBillItems([
        { name: "Ensalada César", price: 12.0, quantity: 1 },
        { name: "Pizza Margarita", price: 14.5, quantity: 2 },
        { name: "Pasta Carbonara", price: 13.0, quantity: 1 },
        { name: "Agua con gas", price: 3.0, quantity: 3 },
        { name: "Cerveza", price: 4.5, quantity: 4 },
        { name: "Tiramisú", price: 6.0, quantity: 2 },
        { name: "Café", price: 2.2, quantity: 3 },
      ]);

      // Navigate to session page
      router.push(`/session/${sessionId}`);
    } catch (error) {
      console.error("Error creating session:", error);
      setIsCreating(false);
    }
  };

  if (step === "name") {
    return <NameInput onSubmit={handleNameSubmit} />;
  }

  if (step === "payment") {
    return (
      <PaymentMethodSelector
        userName={name}
        onSubmit={handlePaymentMethodSubmit}
      />
    );
  }

  // Configuration step (admin only)
  return (
    <div className="flex items-center justify-center min-h-screen p-4 bg-gradient-to-br from-blue-50 to-purple-50">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl text-center">
            Configuración de la mesa
          </CardTitle>
          <p className="text-center text-muted-foreground">
            Eres el administrador de esta sesión
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleCreateSession} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="comensales">
                ¿Cuántos comensales esperan? (opcional)
              </Label>
              <Input
                id="comensales"
                type="number"
                min="1"
                placeholder="Número de comensales"
                value={totalComensales || ""}
                onChange={(e) =>
                  setTotalComensales(
                    e.target.value ? parseInt(e.target.value) : undefined
                  )
                }
              />
              <p className="text-xs text-muted-foreground">
                Si no lo sabes, déjalo en blanco
              </p>
            </div>

            <Button
              type="submit"
              size="lg"
              className="w-full"
              disabled={isCreating}
            >
              {isCreating ? "Creando sesión..." : "Crear sesión"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
