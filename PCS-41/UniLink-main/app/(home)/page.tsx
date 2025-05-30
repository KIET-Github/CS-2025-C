import HeroSection from "@/components/home/hero";
import { authOptions } from "@/lib/auth/auth-options";
import { getServerSession } from "next-auth";

const HomePage = async () => {
  const session = await getServerSession(authOptions);
  const isAuthenticated = session ? true : false;

  return <HeroSection user={session?.user} isAuthenticated={isAuthenticated} />;
};

export default HomePage;
