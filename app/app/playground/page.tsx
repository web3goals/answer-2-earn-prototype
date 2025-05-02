"use client";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export default function PlaygroundPage() {
  async function test() {}

  return (
    <main className="max-w-xl mx-auto px-4 py-8">
      <h1 className="text-xl font-bold">Playground</h1>
      <Separator className="my-4" />
      <Button onClick={test}>Test</Button>
    </main>
  );
}
