"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/config/site";
import { CopyIcon, ExternalLinkIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import useError from "@/hooks/use-error";

export default function LandingPage() {
  const { handleError } = useError();
  const [copied, setCopied] = useState(false);
  const miniAppUrl = "https://answer-2-earn.vercel.app/home";

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(miniAppUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (error) {
      handleError(error, "Failed to copy, try again later");
    }
  };

  return (
    <main className="max-w-lg min-h-screen flex flex-col items-center justify-center mx-auto px-4 py-8">
      {/* Cover */}
      <div className="w-full">
        <Image
          src="/images/cover.png"
          alt="Cover"
          priority={false}
          width="100"
          height="100"
          sizes="100vw"
          className="w-full h-full rounded-2xl"
        />
      </div>
      <h1 className="text-4xl xl:text-5xl font-extrabold tracking-tighter text-center mt-12">
        ANSWER 2 EARN
      </h1>
      <h4 className="text-2xl tracking-tight text-center text-muted-foreground mt-1">
        Answer fan questions, earn LYX rewards — a LUKSO Mini-App with AI
        verification
      </h4>
      {/* Instructions */}
      <div className="flex flex-col items-center bg-secondary border rounded-2xl p-8 mt-12">
        <h2 className="text-3xl font-semibold tracking-tight text-center">
          🚀 — Here we go!
        </h2>
        <p className="text-center mt-2">
          Add the following Mini-App to your grid on{" "}
          <Link
            href="https://universaleverything.io/?network=testnet"
            target="_blank"
          >
            <span className="text-primary">Universal Everything</span>
          </Link>{" "}
          (LUKSO Tesnet)
        </p>
        <div className="bg-background border rounded-lg px-4 py-3 mt-4">
          <p className="text-center text-muted-foreground">
            https://answer-2-earn.vercel.app/home
          </p>
        </div>
        <Button
          className="mt-2"
          onClick={handleCopy}
          disabled={copied}
          type="button"
        >
          <CopyIcon />
          {copied ? "Copied!" : "Copy"}
        </Button>
        <h2 className="text-3xl font-semibold tracking-tight text-center mt-8">
          OR
        </h2>
        <p className="text-center mt-2">
          Clone the Mini-Application from our profile on{" "}
          <Link
            href="https://universaleverything.io/?network=testnet"
            target="_blank"
          >
            <span className="text-primary">Universal Everything</span>
          </Link>{" "}
          (LUKSO Tesnet)
        </p>
        <Link
          href="https://universaleverything.io/0xfcC5eC941E2C26FF618A8a975D9262Cd887d9c15?network=testnet"
          target="_blank"
        >
          <Button className="mt-4">
            <ExternalLinkIcon /> Open profile
          </Button>
        </Link>
      </div>
      {/* Footer */}
      <div className="mt-8">
        <p className="text-sm text-center text-muted-foreground">
          Built by{" "}
          <Link href={siteConfig.links.twitter} target="_blank">
            <span className="text-primary">kiv1n</span>
          </Link>{" "}
          © 2025
        </p>
      </div>
    </main>
  );
}
