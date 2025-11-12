import { type ReactNode } from "react";
import { cn } from "@/lib/utils";

interface Props {
  children?: ReactNode;
  className?: string;
}

export const Body = ({ children, className }: Props) => {
  return (
    <main className={cn("flex-1 overflow-y-auto px-4", className)}>
      {children}
    </main>
  );
};

