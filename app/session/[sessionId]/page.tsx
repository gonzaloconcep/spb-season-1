"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/hooks/useSession";
import { NameInput } from "@/components/onboarding/NameInput";
import { PaymentMethodSelector } from "@/components/onboarding/PaymentMethodSelector";
import { WaitingRoom } from "@/components/onboarding/WaitingRoom";
import { SwipeContainer } from "@/components/swipe/SwipeContainer";
import { AllParticipantsSummary } from "@/components/summary/AllParticipantsSummary";
import { PaymentMethod, BillItemWithSelections } from "@/lib/types/session";
import { calculateParticipantsSummary } from "@/lib/utils/splitCalculator";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

type OnboardingStep = "name" | "payment" | "waiting";

interface PageProps {
  params: Promise<{ sessionId: string }>;
}

export default function SessionPage({ params }: PageProps) {
  const { sessionId } = use(params);
  const router = useRouter();
  const {
    isLoading,
    session,
    participants,
    billItems,
    currentUserId,
    joinSession,
    startSwiping,
    saveItemSelection,
    completeSession,
  } = useSession(sessionId);

  const [onboardingStep, setOnboardingStep] = useState<OnboardingStep | null>(
    null
  );
  const [userName, setUserName] = useState("");
  const [hasCompletedSwipe, setHasCompletedSwipe] = useState(false);

  // Determine onboarding step
  useEffect(() => {
    if (!isLoading && !currentUserId) {
      setOnboardingStep("name");
    } else if (currentUserId && session?.status === "waiting") {
      setOnboardingStep("waiting");
    } else {
      setOnboardingStep(null);
    }
  }, [isLoading, currentUserId, session?.status]);

  const handleNameSubmit = (name: string) => {
    setUserName(name);
    setOnboardingStep("payment");
  };

  const handlePaymentMethodSubmit = async (method: PaymentMethod) => {
    await joinSession(userName, method);
    setOnboardingStep("waiting");
  };

  const handleStartSplit = async () => {
    await startSwiping();
  };

  const handleSwipeComplete = async (
    selections: Map<string, { consumed: boolean; quantity?: number }>
  ) => {
    if (!currentUserId) return;

    // Save all selections to the database
    const savePromises = Array.from(selections.entries()).map(
      ([billItemId, selection]) =>
        saveItemSelection(
          currentUserId,
          billItemId,
          selection.consumed,
          selection.quantity
        )
    );

    await Promise.all(savePromises);
    setHasCompletedSwipe(true);
  };

  const handleFinish = async () => {
    await completeSession();
    router.push("/");
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
        <Card>
          <CardContent className="flex items-center gap-3 p-6">
            <Loader2 className="animate-spin" />
            <span>Cargando sesión...</span>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Session not found
  if (!session) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <p className="text-lg font-semibold mb-2">Sesión no encontrada</p>
            <p className="text-muted-foreground">
              Esta sesión no existe o ha sido eliminada.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Onboarding flow
  if (onboardingStep === "name") {
    return <NameInput onSubmit={handleNameSubmit} />;
  }

  if (onboardingStep === "payment") {
    return (
      <PaymentMethodSelector
        userName={userName}
        onSubmit={handlePaymentMethodSubmit}
      />
    );
  }

  if (onboardingStep === "waiting") {
    return (
      <WaitingRoom
        participants={participants}
        currentUserId={currentUserId!}
        sessionId={sessionId}
        totalComensales={session.totalComensales}
        onStartSplit={handleStartSplit}
      />
    );
  }

  // Swiping phase
  if (session.status === "swiping" && !hasCompletedSwipe) {
    return (
      <SwipeContainer items={billItems} onComplete={handleSwipeComplete} />
    );
  }

  // Waiting for others to complete
  if (session.status === "swiping" && hasCompletedSwipe) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center space-y-4">
            <Loader2 className="animate-spin mx-auto" size={48} />
            <p className="text-lg font-semibold">¡Selección completada!</p>
            <p className="text-muted-foreground">
              Esperando a que los demás terminen...
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Summary phase (completed or all have finished swiping)
  if (session.status === "completed" || hasCompletedSwipe) {
    // Calculate summaries
    const participantsWithSelections = participants.map((p) => ({
      ...p,
      selections:
        billItems
          .flatMap((item) => item.selections || [])
          .filter((s: any) => s.participant?.id === p.id) || [],
    }));

    const billItemsWithSelections: BillItemWithSelections[] = billItems.map(
      (item) => ({
        ...item,
        sessionId: session.id,
        selections: item.selections || [],
      })
    );

    const summaries = calculateParticipantsSummary(
      participantsWithSelections,
      billItemsWithSelections
    );

    const totalBill = billItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    return (
      <AllParticipantsSummary
        summaries={summaries}
        onFinish={handleFinish}
        totalBill={totalBill}
      />
    );
  }

  return null;
}
