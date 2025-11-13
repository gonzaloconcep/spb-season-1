"use client";

import { ParticipantSummary } from "@/lib/types/session";
import { ParticipantSummaryCard } from "./ParticipantSummaryCard";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils/splitCalculator";
import { CheckCircle2, AlertCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface AllParticipantsSummaryProps {
  summaries: ParticipantSummary[];
  onFinish: () => void;
  totalBill: number;
}

export function AllParticipantsSummary({
  summaries,
  onFinish,
  totalBill,
}: AllParticipantsSummaryProps) {
  const totalAssigned = summaries.reduce(
    (sum, s) => sum + s.totalAmount,
    0
  );
  const isBalanced = Math.abs(totalBill - totalAssigned) < 0.01;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4 pb-24">
      <div className="max-w-2xl mx-auto space-y-4">
        {/* Header */}
        <div className="text-center space-y-2 py-4">
          <h1 className="text-2xl font-bold">Resumen de la cuenta</h1>
          <p className="text-muted-foreground">
            División completada para todos los comensales
          </p>
        </div>

        {/* Validation status */}
        <Card
          className={
            isBalanced
              ? "border-green-500 bg-green-50"
              : "border-yellow-500 bg-yellow-50"
          }
        >
          <CardContent className="flex items-center gap-3 p-4">
            {isBalanced ? (
              <>
                <CheckCircle2 className="text-green-600" size={24} />
                <div className="flex-1">
                  <p className="font-semibold text-green-900">
                    ¡Cuenta balanceada!
                  </p>
                  <p className="text-sm text-green-700">
                    Total: {formatCurrency(totalBill)}
                  </p>
                </div>
              </>
            ) : (
              <>
                <AlertCircle className="text-yellow-600" size={24} />
                <div className="flex-1">
                  <p className="font-semibold text-yellow-900">
                    Verificar totales
                  </p>
                  <p className="text-sm text-yellow-700">
                    Cuenta: {formatCurrency(totalBill)} | Asignado:{" "}
                    {formatCurrency(totalAssigned)} | Diferencia:{" "}
                    {formatCurrency(totalBill - totalAssigned)}
                  </p>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Individual summaries */}
        <div className="space-y-4">
          {summaries.map((summary) => (
            <ParticipantSummaryCard
              key={summary.participant.id}
              summary={summary}
            />
          ))}
        </div>

        {/* Fixed footer with action button */}
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t shadow-lg">
          <div className="max-w-2xl mx-auto">
            <Button
              size="lg"
              className="w-full bg-green-600 hover:bg-green-700"
              onClick={onFinish}
            >
              Finalizar y pagar
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
