"use client"

import * as React from "react"
import * as SeparatorPrimitive from "@radix-ui/react-separator"

import { cn } from "@/lib/utils"

const Separator = React.forwardRef<
  React.ElementRef<typeof SeparatorPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SeparatorPrimitive.Root>
>(
  (
    { className, orientation = "horizontal", decorative = true, children, ...props },
    ref
  ) => (
    <div className={cn('flex items-center', className)}>
      <SeparatorPrimitive.Root
        ref={ref}
        decorative={decorative}
        orientation={orientation}
        className={cn(
          "shrink-0 bg-border flex-grow",
          orientation === "horizontal" ? "h-[1px] w-full" : "h-full w-[1px]",
        )}
        {...props}
      />
      {children && <span className="px-2 text-xs text-muted-foreground">{children}</span>}
      {children && <SeparatorPrimitive.Root
        decorative={decorative}
        orientation={orientation}
        className={cn(
          "shrink-0 bg-border flex-grow",
          orientation === "horizontal" ? "h-[1px] w-full" : "h-full w-[1px]",
        )}
        {...props}
      />}
    </div>
  )
)
Separator.displayName = SeparatorPrimitive.Root.displayName

export { Separator }
