"use client";

import { UpProvider } from "@/components/up-provider";
import { useUpProvider } from "@/hooks/use-up-provider";

export default function HomePage() {
  return (
    <UpProvider>
      <HomeSection />
    </UpProvider>
  );
}

function HomeSection() {
  const { contextAccounts, accounts, chainId } = useUpProvider();

  console.log({ contextAccounts, accounts, chainId });

  return (
    <main className="container mx-auto px-4 lg:px-80 py-16">Home page...</main>
  );
}
