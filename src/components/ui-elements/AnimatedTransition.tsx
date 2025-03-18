
import React from "react";
import { motion } from "framer-motion";

interface AnimatedTransitionProps {
  children: React.ReactNode;
  className?: string;
}

const animationVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 }
};

const AnimatedTransition = ({ children, className }: AnimatedTransitionProps) => {
  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={animationVariants}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export default AnimatedTransition;
