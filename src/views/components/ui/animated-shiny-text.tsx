import { cn } from '@/app/utils';
import { motion } from 'motion/react';
import type { ComponentProps } from 'react';

type AnimatedShinyTextProps = ComponentProps<typeof motion.span>;

export function AnimatedShinyText({
  className,
  children,
  ...props
}: AnimatedShinyTextProps) {
  return (
    <motion.span
      className={cn(
        'inline-block bg-size-[220%_100%] bg-clip-text text-transparent',
        className,
      )}
      style={{
        backgroundImage:
          'linear-gradient(110deg, hsl(var(--muted-foreground)) 35%, hsl(var(--primary)) 50%, hsl(var(--muted-foreground)) 65%)',
      }}
      initial={{ backgroundPosition: '0% 50%' }}
      animate={{ backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'] }}
      transition={{ duration: 2.2, repeat: Infinity, ease: 'linear' }}
      {...props}
    >
      {children}
    </motion.span>
  );
}
