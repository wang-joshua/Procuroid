import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

interface FadeWrapperProps {
  children: ReactNode;
}

export default function FadeWrapper({ children }: FadeWrapperProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4, ease: 'easeInOut' }}
      className="h-full"
    >
      {children}
    </motion.div>
  );
}
