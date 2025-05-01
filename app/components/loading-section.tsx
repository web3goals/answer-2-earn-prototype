import { Loader2Icon } from "lucide-react";

export function LoadingSection() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center">
      <Loader2Icon className="animate-spin text-primary" />
    </main>
  );
}
