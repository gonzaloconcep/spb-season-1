import {
  BillItemWithSelections,
  ItemSplit,
  Participant,
  ParticipantSummary,
  ParticipantWithSelections,
} from "../types/session";

/**
 * Calculates how much each participant owes for a specific bill item
 */
export function calculateItemSplit(
  item: BillItemWithSelections,
  participants: Participant[]
): Map<string, ItemSplit> {
  const splits = new Map<string, ItemSplit>();

  // Filter selections where consumed is true
  const consumedSelections = item.selections.filter((s) => s.consumed);

  if (consumedSelections.length === 0) {
    return splits;
  }

  // Calculate total quantity consumed
  const totalQuantityConsumed = consumedSelections.reduce(
    (sum, selection) => sum + (selection.quantityConsumed || 1),
    0
  );

  // Price per unit
  const pricePerUnit = item.price;

  // For each participant who consumed this item
  consumedSelections.forEach((selection) => {
    const quantityConsumed = selection.quantityConsumed || 1;
    const participant = participants.find(
      (p) => p.id === selection.participantId
    );

    if (!participant) return;

    // Get names of other participants who shared this item
    const sharedWith = consumedSelections
      .filter((s) => s.participantId !== selection.participantId)
      .map((s) => {
        const p = participants.find((p) => p.id === s.participantId);
        return p?.name || "Unknown";
      });

    const itemSplit: ItemSplit = {
      itemId: item.id,
      itemName: item.name,
      totalPrice: item.price * item.quantity,
      totalQuantity: item.quantity,
      quantityConsumed,
      pricePerUnit,
      amountToPay: pricePerUnit * quantityConsumed,
      sharedWith,
    };

    splits.set(selection.participantId, itemSplit);
  });

  return splits;
}

/**
 * Calculates the complete summary for all participants
 */
export function calculateParticipantsSummary(
  participants: ParticipantWithSelections[],
  billItems: BillItemWithSelections[]
): ParticipantSummary[] {
  const summaries: ParticipantSummary[] = [];

  participants.forEach((participant) => {
    const items: ItemSplit[] = [];
    let totalAmount = 0;

    billItems.forEach((billItem) => {
      const itemSplits = calculateItemSplit(billItem, participants);
      const participantSplit = itemSplits.get(participant.id);

      if (participantSplit) {
        items.push(participantSplit);
        totalAmount += participantSplit.amountToPay;
      }
    });

    summaries.push({
      participant,
      items,
      totalAmount,
    });
  });

  return summaries;
}

/**
 * Validates that all bill items have been assigned
 */
export function validateAllItemsAssigned(
  billItems: BillItemWithSelections[]
): { isValid: boolean; unassignedItems: string[] } {
  const unassignedItems: string[] = [];

  billItems.forEach((item) => {
    const totalAssigned = item.selections
      .filter((s) => s.consumed)
      .reduce((sum, s) => sum + (s.quantityConsumed || 1), 0);

    if (totalAssigned < item.quantity) {
      unassignedItems.push(`${item.name} (${totalAssigned}/${item.quantity})`);
    }
  });

  return {
    isValid: unassignedItems.length === 0,
    unassignedItems,
  };
}

/**
 * Formats currency amount
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: "EUR",
  }).format(amount);
}
