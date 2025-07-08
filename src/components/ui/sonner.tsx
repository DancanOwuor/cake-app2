// A Shadcn component for a sonnner that gives feedback in response to user actions
"use client"
import { Toaster as Sonner, ToasterProps } from "sonner"

const Toaster = ({ ...props }: ToasterProps) => {

  return (
    <Sonner
      position="top-center"
      theme="light"
      className="toaster group"
      {...props}
    />
  )
}

export { Toaster }
