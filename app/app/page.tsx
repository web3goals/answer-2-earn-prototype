import { Button } from "@/components/ui/button";
import { siteConfig } from "@/config/site";
import { ExternalLinkIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function LandingPage() {
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
          <Link href="https://universaleverything.io/" target="_blank">
            <span className="text-primary">Universal Everything</span>
          </Link>{" "}
          (LUKSO Tesnet)
        </p>
        <div className="bg-background border border-primary rounded-lg px-4 py-3 mt-4">
          <p className="text-center text-muted-foreground">
            https://answer-2-earn.vercel.app/home
          </p>
        </div>
        <h2 className="text-3xl font-semibold tracking-tight text-center mt-8">
          OR
        </h2>
        <p className="text-center mt-2">
          Clone the Mini-Application from our profile on Universal Everything
          (LUKSO Tesnet)
        </p>
        <Link
          href="https://universaleverything.io/0x4018737e0D777b3d4C72B411a3BeEC286Ec5F5eF?assetGroup=grid"
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
