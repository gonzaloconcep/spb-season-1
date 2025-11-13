"use client";

import { useState } from "react";
import { SwipeContainer } from "@/components/swipe/SwipeContainer";
import { AllParticipantsSummary } from "@/components/summary/AllParticipantsSummary";
import {
  BillItem,
  Participant,
  BillItemWithSelections,
  ItemSelection,
} from "@/lib/types/session";
import { calculateParticipantsSummary } from "@/lib/utils/splitCalculator";
import { Body } from "@/components/layout/Body";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Wrapper } from "@/components/layout/Wrapper";
import { Button } from "@/components/ui/button";
import { OrderItems } from "@/components/Order/Items";
import { Summary } from "@/components/Order/Summary";
import { Order } from "@/lib/hooks/useOrder";

// Mock data - Real items from the restaurant order
const mockBillItems: BillItem[] = [
  {
    id: "I1",
    sessionId: "mock",
    name: "Entrante - Pan con tomate",
    price: 4.0,
    quantity: 2,
  },
  {
    id: "I2",
    sessionId: "mock",
    name: "Jamón ibérico",
    price: 18.5,
    quantity: 1,
  },
  {
    id: "I3",
    sessionId: "mock",
    name: "Pizza Prosciutto e Funghi",
    price: 12.5,
    quantity: 1,
  },
  {
    id: "I4",
    sessionId: "mock",
    name: "Pasta Pesto Genovese",
    price: 13.0,
    quantity: 1,
  },
  {
    id: "I5",
    sessionId: "mock",
    name: "Ensalada Caprese",
    price: 10.5,
    quantity: 1,
  },
  {
    id: "I6",
    sessionId: "mock",
    name: "Risotto de setas",
    price: 14.5,
    quantity: 1,
  },
  {
    id: "I7",
    sessionId: "mock",
    name: "Agua con gas 1L",
    price: 3.0,
    quantity: 2,
  },
  {
    id: "I8",
    sessionId: "mock",
    name: "Cerveza artesanal IPA",
    price: 4.8,
    quantity: 3,
  },
  {
    id: "I9",
    sessionId: "mock",
    name: "Copa de vino tinto Rioja",
    price: 5.5,
    quantity: 3,
  },
  {
    id: "I10",
    sessionId: "mock",
    name: "Tiramisú",
    price: 6.0,
    quantity: 2,
  },
  {
    id: "I11",
    sessionId: "mock",
    name: "Helado de pistacho",
    price: 5.5,
    quantity: 1,
  },
  {
    id: "I12",
    sessionId: "mock",
    name: "Café espresso",
    price: 2.2,
    quantity: 4,
  },
];

const mockParticipants: Participant[] = [
  {
    id: "user1",
    sessionId: "mock",
    name: "María",
    paymentMethod: "card",
    isAdmin: true,
    joinedAt: Date.now(),
  },
  {
    id: "user2",
    sessionId: "mock",
    name: "Juan",
    paymentMethod: "cash",
    isAdmin: false,
    joinedAt: Date.now(),
  },
  {
    id: "user3",
    sessionId: "mock",
    name: "Ana",
    paymentMethod: "card",
    isAdmin: false,
    joinedAt: Date.now(),
  },
];

const currentUserId = "user1"; // Simulamos que somos María

// Convertir mockBillItems a formato Order para la vista inicial
const mockOrder: Order = {
  table: {
    id: "MESA-18",
    name: "Mesa 18",
    server: "Lucía",
  },
  items: mockBillItems.map((item) => ({
    id: item.id,
    name: item.name,
    qty: item.quantity,
    unitPrice: item.price,
  })),
};

type ViewMode = "bill" | "swipe" | "summary";

export default function DemoPage() {
  const [viewMode, setViewMode] = useState<ViewMode>("bill");
  const [mySelections, setMySelections] = useState<
    Map<string, { consumed: boolean; quantity?: number }>
  >(new Map());

  const handleSwipeComplete = (
    selections: Map<string, { consumed: boolean; quantity?: number }>
  ) => {
    setMySelections(selections);
    setViewMode("summary");
  };

  const handleFinish = () => {
    alert("¡Demo completada! En producción aquí se procesaría el pago.");
    // Reset demo
    setViewMode("bill");
    setMySelections(new Map());
  };

  // Vista inicial: Cuenta completa
  if (viewMode === "bill") {
    const receiptImageUrl =
      "https://images.unsplash.com/photo-1554224311-beee415c201f?w=800&auto=format&fit=crop";

    return (
      <Wrapper>
        <Header>
          <h1 className="text-xl font-semibold text-black">La cuenta</h1>
        </Header>
        <Body className="">
          {/* Receipt Image */}
          <div className="mb-4 -mx-4 -mt-4">
            <img
              src={receiptImageUrl}
              alt="Cuenta de un restaurante sobre la mesa"
              className="w-full h-48 object-cover"
            />
          </div>
          <OrderItems items={mockOrder.items} />
        </Body>
        <Summary order={mockOrder} />
        <Footer>
          <Button
            size="lg"
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white h-12"
            onClick={() => setViewMode("swipe")}
          >
            Dividir cuenta
          </Button>
        </Footer>
      </Wrapper>
    );
  }

  // Vista de swipe
  if (viewMode === "swipe") {
    return <SwipeContainer items={mockBillItems} onComplete={handleSwipeComplete} />;
  }

  // Simular que todos han completado sus selecciones
  // Para el demo, vamos a simular selecciones de los otros usuarios
  const allSelections: ItemSelection[] = [];

  // Mis selecciones
  mySelections.forEach((selection, itemId) => {
    if (selection.consumed) {
      allSelections.push({
        id: `sel-${currentUserId}-${itemId}`,
        participantId: currentUserId,
        billItemId: itemId,
        consumed: true,
        quantityConsumed: selection.quantity || 1,
      });
    }
  });

  // Selecciones simuladas de Juan (user2)
  // Juan comió: Pizza (I3), Agua (I7: 1), Cerveza (I8: 2), Café (I12: 2)
  [
    { itemId: "I3", qty: 1 },
    { itemId: "I7", qty: 1 },
    { itemId: "I8", qty: 2 },
    { itemId: "I12", qty: 2 },
  ].forEach(({ itemId, qty }) => {
    allSelections.push({
      id: `sel-user2-${itemId}`,
      participantId: "user2",
      billItemId: itemId,
      consumed: true,
      quantityConsumed: qty,
    });
  });

  // Selecciones simuladas de Ana (user3)
  // Ana comió: Pan con tomate (I1: 1), Ensalada (I5), Agua (I7: 1), Tiramisú (I10: 1), Café (I12: 1)
  [
    { itemId: "I1", qty: 1 },
    { itemId: "I5", qty: 1 },
    { itemId: "I7", qty: 1 },
    { itemId: "I10", qty: 1 },
    { itemId: "I12", qty: 1 },
  ].forEach(({ itemId, qty }) => {
    allSelections.push({
      id: `sel-user3-${itemId}`,
      participantId: "user3",
      billItemId: itemId,
      consumed: true,
      quantityConsumed: qty,
    });
  });

  // Construir billItemsWithSelections
  const billItemsWithSelections: BillItemWithSelections[] = mockBillItems.map(
    (item) => ({
      ...item,
      selections: allSelections.filter((sel) => sel.billItemId === item.id),
    })
  );

  // Construir participantsWithSelections
  const participantsWithSelections = mockParticipants.map((p) => ({
    ...p,
    selections: allSelections.filter((sel) => sel.participantId === p.id),
  }));

  const summaries = calculateParticipantsSummary(
    participantsWithSelections,
    billItemsWithSelections
  );

  const totalBill = mockBillItems.reduce(
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
