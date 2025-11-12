import { type ReactNode } from "react";
import { cn } from "@/lib/utils";

interface Props {
  children?: ReactNode;
  className?: string;
}

export const Wrapper = ({ children, className }: Props) => {
  return (
    <div className={cn("mx-auto w-full sm:max-w-md sm:border", className)}>
      {children}
    </div>
  );
};
