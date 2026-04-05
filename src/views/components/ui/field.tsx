import * as React from 'react';

import { cn } from '@/app/utils';
import { Label } from '@/views/components/ui/label';
import { Separator } from '@/views/components/ui/separator';

function FieldGroup({ className, ...props }: React.ComponentProps<'div'>) {
  return <div className={cn('grid gap-4', className)} {...props} />;
}

function Field({ className, ...props }: React.ComponentProps<'div'>) {
  return <div className={cn('grid gap-2', className)} {...props} />;
}

function FieldLabel({
  className,
  ...props
}: React.ComponentProps<typeof Label>) {
  return <Label className={cn('text-sm font-medium', className)} {...props} />;
}

function FieldDescription({ className, ...props }: React.ComponentProps<'p'>) {
  return (
    <p className={cn('text-sm text-muted-foreground', className)} {...props} />
  );
}

function FieldSeparator({ children, className }: React.ComponentProps<'div'>) {
  return (
    <div className={cn('flex items-center gap-3 py-1', className)}>
      <Separator className="flex-1" />
      {children ? (
        <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
          {children}
        </span>
      ) : null}
      <Separator className="flex-1" />
    </div>
  );
}

export { Field, FieldDescription, FieldGroup, FieldLabel, FieldSeparator };
