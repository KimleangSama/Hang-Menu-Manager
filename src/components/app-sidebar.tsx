"use client"

import * as React from "react"

import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"
import { accountSideNav, coreSideNav, orderSideNav, staffSideNav } from "@/constants/sidenav"
import AppLogo from "./app-logo"

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar className="z-0" collapsible="icon" {...props}>
      <SidebarHeader>
        <AppLogo />
      </SidebarHeader>
      <SidebarContent>
        <NavMain
          label="Core"
          items={coreSideNav}
        />
        <NavMain
          label="Order"
          items={orderSideNav}
        />
        <NavMain
          label="User & Feedback"
          items={staffSideNav}
        />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={accountSideNav} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
