import { UpContext } from "@/components/up-provider";
import { useContext } from "react";

export function useUpProvider() {
  const context = useContext(UpContext);
  if (!context) {
    throw new Error("useUpProvider must be used within a UpProvider");
  }
  return context;
}
