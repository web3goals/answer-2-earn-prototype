import Link from "next/link";
import { Separator } from "../ui/separator";

export function HomeFooter() {
  return (
    <div className="mt-8">
      <Separator />
      <p className="text-sm text-center text-muted-foreground mt-4">
        <Link href="/">
          <span className="text-primary">Answer 2 Earn</span>
        </Link>{" "}
        © 2025
      </p>
    </div>
  );
}
