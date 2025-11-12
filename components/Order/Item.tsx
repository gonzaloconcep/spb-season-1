interface Props {
  qty: number;
  name: string;
  unitPrice: number;
}

export const Item = ({ qty, name, unitPrice }: Props) => {
  const total = qty * unitPrice;

  return (
    <div className="flex items-center justify-between py-3 border-b border-gray-200 last:border-b-0">
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <div className="bg-gray-100 rounded-md px-2 py-1 min-w-8 text-center text-sm font-medium shrink-0">
          {qty}
        </div>
        <span className="text-base font-normal truncate">{name}</span>
      </div>
      <span className="text-sm text-black ml-4 shrink-0 font-semibold text-right ">
        {total.toFixed(2).replace(".", ",")}€
      </span>
    </div>
  );
};
