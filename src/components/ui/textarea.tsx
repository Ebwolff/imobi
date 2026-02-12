import * as React from "react"

import { cn } from "@/lib/utils"

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "min-h-20 w-full rounded-md px-3 py-2 text-sm transition-all outline-none resize-none",
        "bg-zinc-800/50 border border-zinc-700 text-white",
        "placeholder:text-zinc-500",
        "focus:border-zinc-600 focus:ring-2 focus:ring-sky-500/20",
        "disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    />
  )
}

export { Textarea }
