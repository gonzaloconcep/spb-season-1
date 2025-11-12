import { type ReactNode } from "react";
import { cn } from "@/lib/utils";

interface Props {
  children?: ReactNode;
  className?: string;
}

export const Header = ({ children, className }: Props) => {
  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full h-14 bg-white border-b px-4 py-2 shrink-0 flex items-center",
        className,
      )}
    >
      {children}
    </header>
  );
};
