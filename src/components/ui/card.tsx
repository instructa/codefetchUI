import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '~/lib/utils';

const cardVariants = cva('flex flex-col gap-2 transition-shadow duration-200', {
  variants: {
    variant: {
      default: 'bg-card text-card-foreground rounded-lg border border-border-subtle py-2 shadow-sm',
      transparent: 'bg-transparent text-foreground py-1',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

interface CardProps extends React.ComponentProps<'div'>, VariantProps<typeof cardVariants> {}

function Card({ className, variant, ...props }: CardProps) {
  return <div data-slot="card" className={cn(cardVariants({ variant }), className)} {...props} />;
}

const cardHeaderVariants = cva(
  '@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-4',
  {
    variants: {
      variant: {
        default: 'px-6',
        transparent: 'px-0',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

interface CardHeaderProps
  extends React.ComponentProps<'div'>,
    VariantProps<typeof cardHeaderVariants> {}

function CardHeader({ className, variant, ...props }: CardHeaderProps) {
  return (
    <div
      data-slot="card-header"
      className={cn(cardHeaderVariants({ variant }), className)}
      {...props}
    />
  );
}

function CardTitle({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="card-title"
      className={cn('leading-none font-semibold', className)}
      {...props}
    />
  );
}

function CardDescription({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="card-description"
      className={cn('text-muted-foreground text-sm', className)}
      {...props}
    />
  );
}

function CardAction({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="card-action"
      className={cn('col-start-2 row-span-2 row-start-1 self-start justify-self-end', className)}
      {...props}
    />
  );
}

const cardContentVariants = cva('', {
  variants: {
    variant: {
      default: 'px-6',
      transparent: 'px-0',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

interface CardContentProps
  extends React.ComponentProps<'div'>,
    VariantProps<typeof cardContentVariants> {}

function CardContent({ className, variant, ...props }: CardContentProps) {
  return (
    <div
      data-slot="card-content"
      className={cn(cardContentVariants({ variant }), className)}
      {...props}
    />
  );
}

const cardFooterVariants = cva('flex items-center [.border-t]:pt-6', {
  variants: {
    variant: {
      default: 'px-6',
      transparent: 'px-0',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

interface CardFooterProps
  extends React.ComponentProps<'div'>,
    VariantProps<typeof cardFooterVariants> {}

function CardFooter({ className, variant, ...props }: CardFooterProps) {
  return (
    <div
      data-slot="card-footer"
      className={cn(cardFooterVariants({ variant }), className)}
      {...props}
    />
  );
}

export { Card, CardHeader, CardFooter, CardTitle, CardAction, CardDescription, CardContent };
