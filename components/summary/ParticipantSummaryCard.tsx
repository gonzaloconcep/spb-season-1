import { ParticipantSummary } from "@/lib/types/session";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { UserAvatar } from "@/components/shared/UserAvatar";
import { PaymentMethodBadge } from "@/components/shared/PaymentMethodBadge";
import { formatCurrency } from "@/lib/utils/splitCalculator";

interface ParticipantSummaryCardProps {
  summary: ParticipantSummary;
}

export function ParticipantSummaryCard({
  summary,
}: ParticipantSummaryCardProps) {
  return (
    <Card className="w-full">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-3">
          <UserAvatar name={summary.participant.name} size="md" />
          <div className="flex-1">
            <h3 className="text-lg font-semibold">
              {summary.participant.name}
            </h3>
            <PaymentMethodBadge
              method={summary.participant.paymentMethod}
              size="sm"
            />
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Items consumed */}
        <div className="space-y-2">
          <h4 className="text-sm font-semibold text-muted-foreground">
            Items consumidos:
          </h4>
          {summary.items.map((item) => (
            <div
              key={item.itemId}
              className="flex justify-between items-start text-sm"
            >
              <div className="flex-1">
                <div className="font-medium">{item.itemName}</div>
                {item.sharedWith.length > 0 && (
                  <div className="text-xs text-muted-foreground">
                    Compartido con: {item.sharedWith.join(", ")}
                  </div>
                )}
                {item.quantityConsumed > 1 && (
                  <div className="text-xs text-muted-foreground">
                    {item.quantityConsumed} unidades
                  </div>
                )}
              </div>
              <div className="font-semibold whitespace-nowrap ml-2">
                {formatCurrency(item.amountToPay)}
              </div>
            </div>
          ))}
        </div>

        <Separator />

        {/* Total */}
        <div className="flex justify-between items-center text-lg font-bold">
          <span>TOTAL A PAGAR:</span>
          <span className="text-blue-600">
            {formatCurrency(summary.totalAmount)}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
