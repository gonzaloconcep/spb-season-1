import { type Order } from "@/lib/hooks/useOrder";
import { MoneyLabel } from "./MoneyLabel";

interface Props {
  order: Order;
}

export const Summary = ({ order }: Props) => {
  const subtotal = order.items.reduce(
    (sum, item) => sum + item.qty * item.unitPrice,
    0,
  );

  return (
    <div className="px-4 py-2 bg-gray-50 shadow-top">
      <div className="flex items-center justify-between">
        <span className="text-base font-semibold text-black">Subtotal</span>
        <MoneyLabel
          amount={subtotal}
          className="text-base font-semibold text-black"
        />
      </div>
    </div>
  );
};
