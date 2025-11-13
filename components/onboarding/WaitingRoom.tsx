"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { UserAvatar } from "@/components/shared/UserAvatar";
import { PaymentMethodBadge } from "@/components/shared/PaymentMethodBadge";
import { Participant } from "@/lib/types/session";
import { Users, Crown, Share2 } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";

interface WaitingRoomProps {
  participants: Participant[];
  currentUserId: string;
  sessionId: string;
  totalComensales?: number;
  onStartSplit: () => void;
}

export function WaitingRoom({
  participants,
  currentUserId,
  sessionId,
  totalComensales,
  onStartSplit,
}: WaitingRoomProps) {
  const currentUser = participants.find((p) => p.id === currentUserId);
  const isAdmin = currentUser?.isAdmin || false;
  const canStart = totalComensales
    ? participants.length >= totalComensales
    : participants.length >= 2;

  const sessionUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/session/${sessionId}`
      : "";

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Únete a dividir la cuenta",
          text: "Escanea este enlace para unirte a la sesión",
          url: sessionUrl,
        });
      } catch (error) {
        // User cancelled or error occurred
        console.error("Error sharing:", error);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(sessionUrl);
      alert("Enlace copiado al portapapeles");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4 bg-gradient-to-br from-blue-50 to-purple-50">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Sala de espera</CardTitle>
          <div className="flex items-center justify-center gap-2 text-muted-foreground">
            <Users size={20} />
            <span>
              {participants.length}
              {totalComensales && ` de ${totalComensales}`} comensales unidos
            </span>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* QR Code */}
          {isAdmin && sessionUrl && (
            <div className="flex flex-col items-center gap-3 p-4 bg-white rounded-lg border-2 border-dashed border-blue-300">
              <p className="text-sm font-semibold text-center">
                Comparte este código QR
              </p>
              <div className="bg-white p-3 rounded-lg shadow-sm">
                <QRCodeSVG value={sessionUrl} size={180} level="M" />
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleShare}
                className="gap-2"
              >
                <Share2 size={16} />
                Compartir enlace
              </Button>
            </div>
          )}

          <Separator />

          <div className="space-y-3">
            {participants.map((participant) => (
              <div
                key={participant.id}
                className="flex items-center gap-3 p-3 rounded-lg bg-white border border-gray-100 shadow-sm"
              >
                <UserAvatar name={participant.name} size="md" />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">{participant.name}</span>
                    {participant.isAdmin && (
                      <Crown
                        size={16}
                        className="text-yellow-500"
                        title="Administrador"
                      />
                    )}
                  </div>
                  <PaymentMethodBadge
                    method={participant.paymentMethod}
                    size="sm"
                  />
                </div>
              </div>
            ))}
          </div>

          {!canStart && (
            <div className="text-center text-sm text-muted-foreground">
              {totalComensales
                ? `Esperando a ${totalComensales - participants.length} comensales más...`
                : "Esperando a más comensales..."}
            </div>
          )}

          <Separator />

          {isAdmin ? (
            <Button
              size="lg"
              className="w-full"
              onClick={onStartSplit}
              disabled={!canStart}
            >
              Comenzar a dividir
            </Button>
          ) : (
            <div className="text-center text-sm text-muted-foreground">
              Esperando a que el administrador inicie...
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
