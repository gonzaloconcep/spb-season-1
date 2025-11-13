"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CreditCard, Banknote } from "lucide-react";
import { PaymentMethod } from "@/lib/types/session";
import { cn } from "@/lib/utils";

interface PaymentMethodSelectorProps {
  onSubmit: (method: PaymentMethod) => void;
  userName: string;
}

export function PaymentMethodSelector({
  onSubmit,
  userName,
}: PaymentMethodSelectorProps) {
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | null>(
    null
  );

  const handleSubmit = () => {
    if (selectedMethod) {
      onSubmit(selectedMethod);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4 bg-gradient-to-br from-blue-50 to-purple-50">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl text-center">
            Hola {userName} 👋
          </CardTitle>
          <p className="text-center text-muted-foreground">
            ¿Cómo vas a pagar?
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => setSelectedMethod("cash")}
              className={cn(
                "flex flex-col items-center justify-center p-8 rounded-lg border-2 transition-all hover:scale-105",
                selectedMethod === "cash"
                  ? "border-green-500 bg-green-50 shadow-lg"
                  : "border-gray-200 hover:border-gray-300"
              )}
            >
              <Banknote
                size={48}
                className={cn(
                  "mb-3",
                  selectedMethod === "cash"
                    ? "text-green-600"
                    : "text-gray-600"
                )}
              />
              <span
                className={cn(
                  "text-lg font-semibold",
                  selectedMethod === "cash" ? "text-green-700" : "text-gray-700"
                )}
              >
                Efectivo
              </span>
            </button>

            <button
              type="button"
              onClick={() => setSelectedMethod("card")}
              className={cn(
                "flex flex-col items-center justify-center p-8 rounded-lg border-2 transition-all hover:scale-105",
                selectedMethod === "card"
                  ? "border-blue-500 bg-blue-50 shadow-lg"
                  : "border-gray-200 hover:border-gray-300"
              )}
            >
              <CreditCard
                size={48}
                className={cn(
                  "mb-3",
                  selectedMethod === "card" ? "text-blue-600" : "text-gray-600"
                )}
              />
              <span
                className={cn(
                  "text-lg font-semibold",
                  selectedMethod === "card" ? "text-blue-700" : "text-gray-700"
                )}
              >
                Tarjeta
              </span>
            </button>
          </div>

          <Button
            size="lg"
            className="w-full"
            onClick={handleSubmit}
            disabled={!selectedMethod}
          >
            Continuar
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
