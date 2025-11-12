import { cn } from "@/lib/utils";

interface Props {
  amount: number;
  className?: string;
}

export const MoneyLabel = ({ amount, className }: Props) => {
  return (
    <span
      className={cn(
        "text-sm text-black ml-4 shrink-0 font-semibold text-right",
        className,
      )}
    >
      {amount.toFixed(2).replace(".", ",")}€
    </span>
  );
};
