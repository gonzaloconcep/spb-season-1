import { BillItem } from "@/lib/types/session";
import { Card, CardContent } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils/splitCalculator";
import { Badge } from "@/components/ui/badge";

interface ItemCardProps {
  item: BillItem;
  totalItems: number;
  currentIndex: number;
}

export function ItemCard({ item, totalItems, currentIndex }: ItemCardProps) {
  // Map food names to emojis
  const getEmoji = (name: string) => {
    const lowerName = name.toLowerCase();
    if (lowerName.includes("pan") || lowerName.includes("tomate")) return "🍞🍅";
    if (lowerName.includes("jamón") || lowerName.includes("jamon")) return "🥓";
    if (lowerName.includes("pizza")) return "🍕";
    if (lowerName.includes("pasta")) return "🍝";
    if (lowerName.includes("ensalada")) return "🥗";
    if (lowerName.includes("risotto")) return "🍚";
    if (lowerName.includes("agua")) return "💧";
    if (lowerName.includes("cerveza")) return "🍺";
    if (lowerName.includes("vino")) return "🍷";
    if (lowerName.includes("tiramis") || lowerName.includes("tirami")) return "🍰";
    if (lowerName.includes("helado")) return "🍦";
    if (lowerName.includes("café") || lowerName.includes("cafe")) return "☕";
    return "🍽️";
  };

  const emoji = item.imageUrl ? null : getEmoji(item.name);

  return (
    <Card className="w-[90vw] max-w-sm h-[500px] shadow-2xl">
      <CardContent className="p-0 h-full flex flex-col">
        {/* Image placeholder */}
        <div className="h-2/3 bg-gradient-to-br from-orange-400 to-pink-500 rounded-t-lg flex items-center justify-center relative overflow-hidden">
          {item.imageUrl ? (
            <img
              src={item.imageUrl}
              alt={item.name}
              className="w-full h-full object-cover"
              crossOrigin="anonymous"
              loading="eager"
            />
          ) : (
            <div className="text-9xl drop-shadow-2xl">{emoji}</div>
          )}
          {/* Progress indicator */}
          <div className="absolute top-4 right-4 z-10">
            <Badge variant="secondary" className="text-xs">
              {currentIndex + 1} / {totalItems}
            </Badge>
          </div>
        </div>

        {/* Item details */}
        <div className="flex-1 p-6 flex flex-col justify-between bg-white rounded-b-lg">
          <div>
            <h3 className="text-2xl font-bold mb-2">{item.name}</h3>
            <p className="text-3xl font-bold text-blue-600">
              {formatCurrency(item.price)}
            </p>
          </div>

          {item.quantity > 1 && (
            <div className="flex items-center justify-center gap-2 mt-4">
              <div className="flex items-center gap-1">
                <span className="text-red-500 text-2xl">●</span>
                <span className="text-lg font-semibold">x{item.quantity}</span>
              </div>
              <span className="text-sm text-muted-foreground">
                {item.quantity} unidades disponibles
              </span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
