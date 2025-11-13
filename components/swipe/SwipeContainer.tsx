"use client";

import { useState } from "react";
import { BillItem } from "@/lib/types/session";
import { SwipeCard } from "./SwipeCard";
import { QuantitySelector } from "./QuantitySelector";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2 } from "lucide-react";

interface SwipeContainerProps {
  items: BillItem[];
  onComplete: (selections: Map<string, { consumed: boolean; quantity?: number }>) => void;
}

export function SwipeContainer({ items, onComplete }: SwipeContainerProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showQuantitySelector, setShowQuantitySelector] = useState(false);
  const [selections, setSelections] = useState(
    new Map<string, { consumed: boolean; quantity?: number }>()
  );

  const currentItem = items[currentIndex];
  const isLastItem = currentIndex === items.length - 1;

  const handleSwipeLeft = () => {
    // User didn't consume this item
    const newSelections = new Map(selections);
    newSelections.set(currentItem.id, { consumed: false });
    setSelections(newSelections);

    moveToNextItem();
  };

  const handleSwipeRight = () => {
    // User consumed this item
    if (currentItem.quantity > 1) {
      // Show quantity selector
      setShowQuantitySelector(true);
    } else {
      // Single item, just mark as consumed
      const newSelections = new Map(selections);
      newSelections.set(currentItem.id, { consumed: true, quantity: 1 });
      setSelections(newSelections);

      moveToNextItem();
    }
  };

  const handleQuantityConfirm = (quantity: number) => {
    const newSelections = new Map(selections);
    newSelections.set(currentItem.id, { consumed: true, quantity });
    setSelections(newSelections);

    setShowQuantitySelector(false);
    moveToNextItem();
  };

  const handleQuantityCancel = () => {
    setShowQuantitySelector(false);
    // Mark as not consumed
    const newSelections = new Map(selections);
    newSelections.set(currentItem.id, { consumed: false });
    setSelections(newSelections);

    moveToNextItem();
  };

  const moveToNextItem = () => {
    if (isLastItem) {
      // All items processed
      onComplete(selections);
    } else {
      setCurrentIndex(currentIndex + 1);
    }
  };

  if (!currentItem) {
    return (
      <div className="flex items-center justify-center min-h-screen p-4 bg-gradient-to-br from-blue-50 to-purple-50">
        <Card className="w-full max-w-md">
          <CardContent className="flex flex-col items-center justify-center p-8 space-y-4">
            <CheckCircle2 size={64} className="text-green-500" />
            <h2 className="text-2xl font-bold text-center">
              ¡Selección completada!
            </h2>
            <p className="text-center text-muted-foreground">
              Procesando tu selección...
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex flex-col">
      {/* Header */}
      <div className="p-4">
        <h2 className="text-xl font-semibold text-center">
          Dime qué has comido
        </h2>
        <p className="text-center text-sm text-muted-foreground">
          Desliza izquierda (NO) o derecha (SÍ)
        </p>
      </div>

      {/* Swipe area */}
      <div className="flex-1 flex items-center justify-center p-4">
        <SwipeCard
          item={currentItem}
          onSwipeLeft={handleSwipeLeft}
          onSwipeRight={handleSwipeRight}
          totalItems={items.length}
          currentIndex={currentIndex}
        />
      </div>

      {/* Quantity selector modal */}
      {showQuantitySelector && (
        <QuantitySelector
          item={currentItem}
          onConfirm={handleQuantityConfirm}
          onCancel={handleQuantityCancel}
        />
      )}
    </div>
  );
}
