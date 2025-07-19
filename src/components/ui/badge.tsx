import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '~/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center justify-center rounded-md border px-2.5 py-1 text-xs font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1.5 [&>svg]:pointer-events-none focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:ring-offset-1 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive transition-all duration-200 overflow-hidden shadow-xs',
  {
    variants: {
      variant: {
        default:
          'border-transparent bg-primary text-primary-foreground [a&]:hover:bg-primary/90 [a&]:hover:shadow-sm',
        secondary:
          'border-transparent bg-secondary text-secondary-foreground [a&]:hover:bg-secondary/90 [a&]:hover:shadow-sm',
        destructive:
          'border-transparent bg-destructive text-white [a&]:hover:bg-destructive/90 [a&]:hover:shadow-sm focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60',
        outline:
          'border-border-subtle bg-background text-foreground [a&]:hover:bg-accent [a&]:hover:text-accent-foreground [a&]:hover:shadow-sm dark:bg-surface-elevated',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

function Badge({
  className,
  variant,
  asChild = false,
  ...props
}: React.ComponentProps<'span'> & VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : 'span';

  return (
    <Comp
      className={cn(badgeVariants({ variant }), className)}
      {...props}
      // Suppress hydration warning for SSR compatibility
      suppressHydrationWarning
    />
  );
}

export { Badge, badgeVariants };
