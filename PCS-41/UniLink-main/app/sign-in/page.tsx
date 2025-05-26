"use client";

import FadeIn from "@/components/global/fade-in";
import FadeSlideIn from "@/components/global/fade-slide-in";
import { Button } from "@/components/ui/button";
import RotatingBorderBadge from "@/components/ui/rotating-border-badge";
import { siteConfig } from "@/config/site";
import { dashboardRoutes } from "@/lib/constants";
import { VerificationStatus } from "@prisma/client";
import { Code2, FileSearch, Lightbulb, Loader } from "lucide-react";
import { signIn, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const features = [
  {
    title: "Centralized Data Hub",
    description:
      "Access comprehensive placement statistics and trends from technical institutes nationwide in one unified platform",
    icon: FileSearch,
  },
  {
    title: "Real-time Analytics",
    description:
      "Track and analyze placement performance metrics, salary trends, and industry-wise recruitment patterns",
    icon: Code2,
  },
  {
    title: "Smart Insights",
    description:
      "Leverage data-driven insights to make informed decisions about campus recruitment and career opportunities",
    icon: Lightbulb,
  },
];

export default function SignIn() {
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const { data: session, status } = useSession();
  const router = useRouter();

  const handleGoogleSignIn = async () => {
    try {
      setIsGoogleLoading(true);
      await signIn("google", {
        redirect: false,
      });
    } catch (error) {
      console.error("GitHub Sign-In Error:", error);
    } finally {
      setIsGoogleLoading(false);
    }
  };

  // Handle redirects based on verification status when session loads
  useEffect(() => {
    if (status === "authenticated" && session?.user) {
      const user = session.user;

      if (user.verificationStatus === ("PENDING" as VerificationStatus)) {
        router.push("/auth/verification-status");
      } else if (
        user.verificationStatus === ("APPROVED" as VerificationStatus)
      ) {
        router.push(dashboardRoutes[user.role]);
      } else {
        router.push("/auth/profile-setup");
      }
    }
  }, [session, status, router]);

  return (
    <div className="flex min-h-screen overflow-hidden ">
      {/* Left Panel - Info Section */}
      <div className="hidden lg:flex lg:w-3/5 z-20 bg-card">
        <div className="w-full  flex flex-col justify-between">
          <div className="backdrop-blur-md p-6">
            <Link href="/">
              <h1 className="text-5xl font-bold ">{siteConfig.name}</h1>
            </Link>
            <p className="text-muted-foreground mt-1 text-lg">
              {siteConfig.description}
            </p>
          </div>

          <div className="space-y-4 max-w-2xl p-6">
            {features.map((feature, i) => (
              <FadeSlideIn key={i} delay={i * 0.2}>
                <div className="flex items-start gap-4 p-4 rounded-lg border backdrop-blur-md">
                  <div className="p-2 rounded-md border">
                    <feature.icon />
                  </div>
                  <div>
                    <h3 className="font-medium text-foreground">
                      {feature.title}
                    </h3>
                    <p className="text-muted-foreground">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </FadeSlideIn>
            ))}
          </div>

          <div className="text-sm text-muted-foreground p-6">
            © 2024 {siteConfig.name}. All rights reserved.
          </div>
        </div>
      </div>

      {/* Right Panel - Auth Section */}
      <div className="w-full lg:w-2/5 flex items-center justify-center">
        <div className=" flex items-center justify-center relative">
          {/* Decorative elements */}
          <div className="absolute -top-16 -right-16 h-64 w-64 rounded-full bg-primary/20 blur-3xl" />
          <div className="absolute -bottom-16 -left-16 h-64 w-64 rounded-full bg-purple-500/20 blur-3xl" />
          <FadeIn delay={0.1}>
            <div className="w-[400px] p-8 bg-card/40 backdrop-blur-sm rounded-md border space-y-6">
              <div className="space-y-2 text-center">
                <RotatingBorderBadge title={`Welcome to ${siteConfig.name}`} />
              </div>

              <div className="space-y-4">
                <Button
                  variant="outline"
                  className="w-full text-foreground"
                  onClick={handleGoogleSignIn}
                  disabled={isGoogleLoading}
                >
                  {isGoogleLoading ? (
                    <>
                      <Loader className="w-5 h-5 animate-spin" />
                      Wait ...
                    </>
                  ) : (
                    <>
                      <Image
                        src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                        alt="Google"
                        width={18}
                        height={18}
                        className="mr-2"
                      />
                      <span className="text-center tracking-wide">
                        Continue with Google
                      </span>
                    </>
                  )}
                </Button>
              </div>
            </div>
          </FadeIn>
        </div>
      </div>
    </div>
  );
}
