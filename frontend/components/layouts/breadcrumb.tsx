"use client"

import { Home } from "lucide-react"
import {
  Breadcrumb as BreadcrumbRoot,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

interface BreadcrumbItemData {
  label: string
  href?: string
}

interface BreadcrumbProps {
  items: BreadcrumbItemData[]
}

export function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <BreadcrumbRoot>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="/dashboard" className="flex items-center">
            <Home className="size-3.5" />
          </BreadcrumbLink>
        </BreadcrumbItem>
        {items.map((item, index) => (
          <span key={index} className="flex items-center gap-1.5">
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              {item.href ? (
                <BreadcrumbLink href={item.href}>{item.label}</BreadcrumbLink>
              ) : (
                <BreadcrumbPage>{item.label}</BreadcrumbPage>
              )}
            </BreadcrumbItem>
          </span>
        ))}
      </BreadcrumbList>
    </BreadcrumbRoot>
  )
}
