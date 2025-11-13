"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BillItem } from "@/lib/types/session";
import { formatCurrency } from "@/lib/utils/splitCalculator";
import { Minus, Plus } from "lucide-react";

interface QuantitySelectorProps {
  item: BillItem;
  onConfirm: (quantity: number) => void;
  onCancel: () => void;
}

export function QuantitySelector({
  item,
  onConfirm,
  onCancel,
}: QuantitySelectorProps) {
  const [quantity, setQuantity] = useState(1);

  const handleIncrement = () => {
    if (quantity < item.quantity) {
      setQuantity(quantity + 1);
    }
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const totalPrice = item.price * quantity;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-xl text-center">{item.name}</CardTitle>
          <p className="text-center text-muted-foreground">
            ¿Cuántas unidades consumiste?
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Quantity selector */}
          <div className="flex items-center justify-center gap-4">
            <Button
              variant="outline"
              size="icon"
              className="h-12 w-12 rounded-full"
              onClick={handleDecrement}
              disabled={quantity <= 1}
            >
              <Minus size={20} />
            </Button>

            <div className="flex flex-col items-center">
              <span className="text-5xl font-bold">{quantity}</span>
              <span className="text-sm text-muted-foreground">
                de {item.quantity} disponibles
              </span>
            </div>

            <Button
              variant="outline"
              size="icon"
              className="h-12 w-12 rounded-full"
              onClick={handleIncrement}
              disabled={quantity >= item.quantity}
            >
              <Plus size={20} />
            </Button>
          </div>

          {/* Price calculation */}
          <div className="text-center space-y-2">
            <div className="text-sm text-muted-foreground">
              {formatCurrency(item.price)} × {quantity}
            </div>
            <div className="text-3xl font-bold text-blue-600">
              {formatCurrency(totalPrice)}
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="lg"
              className="flex-1"
              onClick={onCancel}
            >
              Cancelar
            </Button>
            <Button
              size="lg"
              className="flex-1 bg-green-600 hover:bg-green-700"
              onClick={() => onConfirm(quantity)}
            >
              Confirmar
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
