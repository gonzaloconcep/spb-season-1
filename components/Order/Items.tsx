import { OrderItem } from "@/lib/hooks/useOrder";
import { Item } from "./Item";

interface Props {
  items: OrderItem[];
}

export const OrderItems = ({ items }: Props) => {
  return (
    <div className="flex flex-col space-y-0">
      {items.map((item) => (
        <Item
          key={item.id}
          qty={item.qty}
          name={item.name}
          unitPrice={item.unitPrice}
        />
      ))}
    </div>
  );
};
