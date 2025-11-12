import { type ReactNode } from "react";
import { cn } from "@/lib/utils";

interface Props {
  children?: ReactNode;
  className?: string;
}

export const Footer = ({ children, className }: Props) => {
  return (
    <footer
      className={cn(
        "sticky bottom-0 z-50 w-full bg-white p-2 shrink-0 flex items-center min-h-12 justify-center border-t ",
        className,
      )}
    >
      {children}
    </footer>
  );
};
