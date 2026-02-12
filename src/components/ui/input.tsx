import * as React from "react"

import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "h-9 w-full min-w-0 rounded-md px-3 py-1 text-sm transition-all outline-none",
        "bg-zinc-800/50 border border-zinc-700 text-white",
        "placeholder:text-zinc-500",
        "focus:border-zinc-600 focus:ring-2 focus:ring-sky-500/20",
        "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    />
  )
}

export { Input }
