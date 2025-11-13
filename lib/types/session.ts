export type SessionStatus = "waiting" | "swiping" | "completed";
export type PaymentMethod = "cash" | "card";

export interface Session {
  id: string;
  createdAt: number;
  adminUserId: string;
  totalComensales?: number;
  status: SessionStatus;
  qrCode?: string;
}

export interface BillItem {
  id: string;
  sessionId: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl?: string;
}

export interface Participant {
  id: string;
  sessionId: string;
  name: string;
  paymentMethod: PaymentMethod;
  isAdmin: boolean;
  joinedAt: number;
}

export interface ItemSelection {
  id: string;
  participantId: string;
  billItemId: string;
  consumed: boolean;
  quantityConsumed?: number;
}

export interface ParticipantWithSelections extends Participant {
  selections: ItemSelection[];
}

export interface BillItemWithSelections extends BillItem {
  selections: ItemSelection[];
}

export interface ItemSplit {
  itemId: string;
  itemName: string;
  totalPrice: number;
  totalQuantity: number;
  quantityConsumed: number;
  pricePerUnit: number;
  amountToPay: number;
  sharedWith: string[]; // participant names
}

export interface ParticipantSummary {
  participant: Participant;
  items: ItemSplit[];
  totalAmount: number;
}
