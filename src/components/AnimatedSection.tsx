import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';

interface AnimatedSectionProps extends HTMLMotionProps<'div'> {
  children: React.ReactNode;
  id?: string;
  className?: string;
  delay?: number;
}

export const AnimatedSection: React.FC<AnimatedSectionProps> = ({
  children,
  id,
  className = '',
  delay = 0,
  ...props
}) => {
  return (
    <motion.div
      id={id}
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-70px' }}
      transition={{
        duration: 0.7,
        delay,
        ease: [0.21, 1, 0.36, 1], // Smooth professional Apple-grade spring easing
      }}
      className={`w-full ${className}`}
      {...props}
    >
      {children}
    </motion.div>
  );
};
