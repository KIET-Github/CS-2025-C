import { cn } from "@/lib/utils";
import Link from "next/link";
import { Icons } from "../Icons";
import { buttonVariants } from "../ui/button";

export default function SignInButton() {
  return (
    <div className="group relative inline-block">
      <Link
        href="/auth/sign-in"
        className={cn(
          buttonVariants({ variant: "default", size: "sm" }),
          "relative z-10 transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
        )}
      >
        <span className="flex items-center">
          <Icons.login className="mr-2 h-4 w-4" />
          Sign In
        </span>
      </Link>
    </div>
  );
}
