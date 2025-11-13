import { PaymentMethod } from "@/lib/types/session";
import { CreditCard, Banknote } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface PaymentMethodBadgeProps {
  method: PaymentMethod;
  size?: "sm" | "md" | "lg";
}

export function PaymentMethodBadge({
  method,
  size = "md",
}: PaymentMethodBadgeProps) {
  const iconSize = size === "sm" ? 12 : size === "md" ? 16 : 20;

  return (
    <Badge
      variant={method === "card" ? "default" : "secondary"}
      className="flex items-center gap-1"
    >
      {method === "card" ? (
        <CreditCard size={iconSize} />
      ) : (
        <Banknote size={iconSize} />
      )}
      <span>{method === "card" ? "Tarjeta" : "Efectivo"}</span>
    </Badge>
  );
}
