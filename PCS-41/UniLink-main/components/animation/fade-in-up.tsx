import { motion, useInView } from "framer-motion";
import { ReactNode, useRef } from "react";

interface FadeInUpProps {
  children: ReactNode;
  delay?: number;
  once?: boolean;
}

export function FadeInUp({ children, delay = 0, once = true }: FadeInUpProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, {
    once, // Animation will only play once when true
    margin: "0px 0px -50px 0px", // Starts animation slightly before element enters viewport
  });

  return (
    <motion.div
      ref={ref}
      initial={{ y: 20, opacity: 0 }}
      animate={isInView ? { y: 0, opacity: 1 } : { y: 20, opacity: 0 }}
      transition={{ duration: 0.5, delay }}
    >
      {children}
    </motion.div>
  );
}
