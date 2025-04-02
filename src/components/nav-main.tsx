"use client";
import { ChevronRight } from "lucide-react"

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar"
import Link from "next/link"
import { SideNav } from "@/constants/sidenav"
import { useAuth } from "@/hooks/use-auth";

export function NavMain({ label, items }: { label: string, items: SideNav[] }) {
  const { user } = useAuth()

  const hasAccess = (item: SideNav) => {
    const userRoles = user?.roles?.map(role => role.name) || []
    return item.roles?.some(role => userRoles.includes(role))
  }

  const menuButton = (item: SideNav) => {
    item.roles = item.roles || []
    const hasSubItems = (item.items ?? []).length > 0
    return hasSubItems ? (
      <div className='cursor-pointer flex items-center'>
        {item.icon && <item.icon />}
        <span>{item.title}</span>
        <ChevronRight className='ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90' />
      </div>
    ) : (
      <Link href={item?.url} className='flex items-center'>
        {item.icon && <item.icon />}
        <span>{item.title}</span>
      </Link>
    )
  }

  return (
    <SidebarGroup>
      <SidebarGroupLabel>{label}</SidebarGroupLabel>
      <SidebarMenu>
        {items
          .filter(hasAccess)
          .map((item) => {
            const hasSubItems = (item.items ?? []).length > 0
            return (
              <Collapsible
                key={item.title}
                asChild
                defaultOpen={item.isActive}
                className="group/collapsible"
              >
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton asChild tooltip={item.title}>
                      {menuButton(item)}
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  {hasSubItems && (
                    <CollapsibleContent>
                      <SidebarMenuSub>
                        {item.items?.filter(hasAccess)
                          .map(subItem => (
                            <SidebarMenuSubItem key={subItem.title}>
                              <SidebarMenuSubButton asChild>
                                <Link href={subItem.url} className='flex items-center'>
                                  {subItem.icon && <subItem.icon />}
                                  <span>{subItem.title}</span>
                                </Link>
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                          ))}
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  )}
                </SidebarMenuItem>
              </Collapsible>
            )
          })}
      </SidebarMenu>
    </SidebarGroup>
  )
}
