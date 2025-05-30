"use client";

import FadeIn from "@/components/global/fade-in";
import FadeSlideIn from "@/components/global/fade-slide-in";
import MaxWidthWrapper from "@/components/global/max-width-wrapper";
import { BackgroundShine } from "@/components/ui/background-shine";
import { BorderBeam } from "@/components/ui/border-beam";
import GradientButton from "@/components/ui/gradient-button";
import { LampContainer } from "@/components/ui/lamp";
import { siteConfig } from "@/config/site";
import { dashboardRoutes } from "@/lib/constants";
import { VerificationStatus } from "@prisma/client";
import { motion } from "framer-motion";
import { ArrowRightIcon } from "lucide-react";
import { User } from "next-auth";
import Image from "next/image";
import { redirect, useRouter } from "next/navigation";

interface HeroSectionProps {
  isAuthenticated: boolean;
  user: User | undefined;
}

const HeroSection = ({ isAuthenticated, user }: HeroSectionProps) => {
  const router = useRouter();
  const handleGetStarted = () => {
    if (!isAuthenticated) {
      redirect("/sign-in");
    }

    if (isAuthenticated && user) {
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
  };

  return (
    <div className="overflow-x-hidden scrollbar-hide ">
      {/* Hero Section */}
      <MaxWidthWrapper>
        <div className="flex flex-col items-center justify-center w-full ">
          <FadeIn
            className="flex flex-col items-center justify-center w-full text-center"
            delay={0.1}
          >
            <GradientButton onClick={handleGetStarted}>
              ✨ Start Uploading Data
            </GradientButton>

            <h1 className="text-foreground text-center py-6 text-5xl font-medium text-balance sm:text-6xl md:text-7xl lg:text-8xl  w-full">
              Transform <br />
              <span className="text-transparent bg-gradient-to-r from-violet-500 to-fuchsia-500 bg-clip-text inline-bloc">
                Campus Placement
              </span>
              <br />
              Analytics
            </h1>

            <div className="flex items-center justify-center gap-4 z-50">
              <BackgroundShine className="rounded-md">
                <span
                  onClick={handleGetStarted}
                  className="flex items-center group cursor-pointer"
                >
                  Get started
                  <ArrowRightIcon
                    className="ml-1 size-4 transition-transform duration-300 
            ease-in-out group-hover:translate-x-2"
                  />
                </span>
              </BackgroundShine>
              <GradientButton rounded="md">
                <a
                  href={siteConfig.links.github}
                  className="flex items-center"
                  target="_blank"
                >
                  Github
                </a>
              </GradientButton>
            </div>
          </FadeIn>

          <FadeSlideIn
            delay={0.5}
            className="relative pt-20 pb-20 md:py-32 px-2 bg-transparent w-full"
          >
            <div className="absolute md:top-[10%] left-1/2 gradient w-3/4 -translate-x-1/2 h-1/4 md:h-1/3 inset-0 blur-[5rem] animate-image-glow"></div>
            <div className="-m-2 rounded-xl p-2 ring-1 ring-inset ring-foreground/20 lg:-m-4 lg:rounded-2xl bg-opacity-50 backdrop-blur-3xl">
              <BorderBeam size={250} duration={12} delay={9} />
              <Image
                src="/assets/dashboard.png"
                alt="Dashboard"
                width={1200}
                height={1200}
                quality={100}
                className="rounded-md lg:rounded-xl bg-foreground/10 ring-1 ring-border"
              />
              <div className="absolute -bottom-4 inset-x-0 w-full h-1/2 bg-gradient-to-t from-background z-40"></div>
              <div className="absolute bottom-0 md:-bottom-8 inset-x-0 w-full h-1/4 bg-gradient-to-t from-background z-50"></div>
            </div>
          </FadeSlideIn>
        </div>
      </MaxWidthWrapper>

      {/* CTA Section */}
      <MaxWidthWrapper className="mt-20 max-w-[100vw] overflow-x-hidden scrollbar-hide">
        <LampContainer>
          <motion.div
            initial={{ opacity: 0.5, y: 100 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8, ease: "easeInOut" }}
            className="flex flex-col items-center justify-center gap-8  "
          >
            <h1 className="mt-8  text-foreground py-4  text-center text-4xl font-medium tracking-tight md:text-7xl">
              Start <br />
              <span className="text-transparent bg-gradient-to-r from-violet-500 to-fuchsia-500 bg-clip-text inline-bloc">
                Tracking Placement Data
              </span>
              <br /> with{" "}
              <span className="text-transparent bg-gradient-to-r from-violet-500 to-fuchsia-500 bg-clip-text inline-bloc">
                {siteConfig.name}
              </span>
            </h1>
            <BackgroundShine>
              <span
                onClick={handleGetStarted}
                className="flex items-center group cursor-pointer"
              >
                Get started
                <ArrowRightIcon className="w-4 h-4 ml-2" />
              </span>
            </BackgroundShine>
          </motion.div>
        </LampContainer>
      </MaxWidthWrapper>
    </div>
  );
};

export default HeroSection;
