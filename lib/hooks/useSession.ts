"use client";

import { useEffect, useState } from "react";
import { db } from "@/db/client";
import {
  Session,
  Participant,
  BillItem,
  ItemSelection,
  PaymentMethod,
} from "../types/session";
import { id, tx } from "@instantdb/react";

export function useSession(sessionId: string) {
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  // Query session data with all related entities
  const { isLoading, error, data } = db.useQuery({
    sessions: {
      $: {
        where: {
          id: sessionId,
        },
      },
      participants: {},
      billItems: {
        selections: {},
      },
    },
  });

  const session = data?.sessions?.[0];
  const participants = session?.participants || [];
  const billItems = session?.billItems || [];

  // Get current user from localStorage
  useEffect(() => {
    const storedUserId = localStorage.getItem(`session_${sessionId}_userId`);
    if (storedUserId) {
      setCurrentUserId(storedUserId);
    }
  }, [sessionId]);

  const createSession = async (
    adminName: string,
    paymentMethod: PaymentMethod,
    totalComensales?: number
  ) => {
    const sessionId = id();
    const participantId = id();

    await db.transact([
      tx.sessions[sessionId].update({
        createdAt: Date.now(),
        adminUserId: participantId,
        status: "waiting",
        totalComensales,
      }),
      tx.participants[participantId].update({
        name: adminName,
        paymentMethod,
        isAdmin: true,
        joinedAt: Date.now(),
      }),
      tx.participants[participantId].link({ session: sessionId }),
    ]);

    // Store user ID in localStorage
    localStorage.setItem(`session_${sessionId}_userId`, participantId);
    setCurrentUserId(participantId);

    return { sessionId, participantId };
  };

  const joinSession = async (name: string, paymentMethod: PaymentMethod) => {
    const participantId = id();

    await db.transact([
      tx.participants[participantId].update({
        name,
        paymentMethod,
        isAdmin: false,
        joinedAt: Date.now(),
      }),
      tx.participants[participantId].link({ session: sessionId }),
    ]);

    // Store user ID in localStorage
    localStorage.setItem(`session_${sessionId}_userId`, participantId);
    setCurrentUserId(participantId);

    return participantId;
  };

  const addBillItems = async (items: Omit<BillItem, "id" | "sessionId">[]) => {
    const transactions = items.map((item) => {
      const itemId = id();
      return [
        tx.billItems[itemId].update({
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          imageUrl: item.imageUrl,
        }),
        tx.billItems[itemId].link({ session: sessionId }),
      ];
    });

    await db.transact(transactions.flat());
  };

  const startSwiping = async () => {
    if (!session) return;
    await db.transact([
      tx.sessions[session.id].update({
        status: "swiping",
      }),
    ]);
  };

  const saveItemSelection = async (
    participantId: string,
    billItemId: string,
    consumed: boolean,
    quantityConsumed?: number
  ) => {
    const selectionId = id();

    await db.transact([
      tx.itemSelections[selectionId].update({
        consumed,
        quantityConsumed,
      }),
      tx.itemSelections[selectionId].link({
        participant: participantId,
        billItem: billItemId,
      }),
    ]);
  };

  const completeSession = async () => {
    if (!session) return;
    await db.transact([
      tx.sessions[session.id].update({
        status: "completed",
      }),
    ]);
  };

  return {
    isLoading,
    error,
    session,
    participants,
    billItems,
    currentUserId,
    createSession,
    joinSession,
    addBillItems,
    startSwiping,
    saveItemSelection,
    completeSession,
  };
}
