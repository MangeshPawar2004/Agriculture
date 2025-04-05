import React from "react";
import { cn } from "../../lib/util";

export const Card = ({ className, ...props }) => (
  <div
    className={cn("rounded-xl border bg-white text-black shadow", className)}
    {...props}
  />
);

export const CardContent = ({ className, ...props }) => (
  <div className={cn("p-6 pt-0", className)} {...props} />
);
