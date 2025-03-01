"use client"

import { AppSidebar } from "@/components/app-sidebar"
import { NavBreadcrumbs } from "@/components/nav-breadcrumbs"
import NavLanguage from "@/components/nav-language"
import { NavTheme } from "@/components/nav-theme"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { useAuth } from "@/hooks/use-auth"
import { useStoreResponse } from "@/hooks/use-store"
import { storeService } from "@/services/store-service"
import { redirect } from "next/navigation"
import { useEffect } from "react"
import { toast } from "sonner"

interface DashboardPageProps {
  children: React.ReactNode
}

export default function DashboardPage({ children }: DashboardPageProps) {
  const { user } = useAuth();
  if (!user) {
    redirect('/auth/login');
  }

  const store = useStoreResponse((state) => state.store);

  useEffect(() => {
    if (!store) {
      async function getStoreInfo() {
        try {
          const response = await storeService.getStoreOfUser();
          console.log(response)
          if (response.success) {
            useStoreResponse.setState({ store: response.payload });
          } else {
            if (response.statusCode === 403 || response.statusCode === 401) {
              toast.error('You are not authorized to access this page');
              setTimeout(() => {
                redirect('/auth/login');
              }, 1500);
            }
          }
        } catch (error) {
          console.error('Failed to fetch store info:', error);
        }
      }
      getStoreInfo();
    }
  }, [store]);

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <NavBreadcrumbs />
          </div>
          <div className='flex items-center gap-2 ml-auto mx-1'>
            <NavTheme />
            <NavLanguage />
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 px-2 py-4 pt-0">
          <div className="">
            {children}
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
