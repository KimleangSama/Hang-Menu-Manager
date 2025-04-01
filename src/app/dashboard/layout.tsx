"use client";

import { AppSidebar } from "@/components/app-sidebar";
import { NavBreadcrumbs } from "@/components/nav-breadcrumbs";
import NavLanguage from "@/components/nav-language";
import { NavTheme } from "@/components/nav-theme";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { ReactNode, useEffect, useState } from "react";
import { useStoreResponse } from "@/hooks/use-store";
import { storeService } from "@/services/store-service";
import { redirect } from "next/navigation";
import { toast } from "sonner";
import NavNotification from "@/components/nav-noti";
import { useAuth } from "@/hooks/use-auth";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const { logout } = useAuth();
  const [isArchived, setIsArchived] = useState(false);
  const store = useStoreResponse((state) => state.store);

  useEffect(() => {
    if (!store) {
      async function getStoreInfo() {
        try {
          const response = await storeService.getStoreOfUser();
          if (response.success) {
            useStoreResponse.setState({ store: response.payload });
            if (response.payload.isArchived) {
              setIsArchived(true);
              toast.error("Your store has been archived. Please contact the administrator for further assistance.");
            }
          } else {
            if (response.statusCode === 403 || response.statusCode === 401) {
              toast.error("You do not have permission to access this page");
              setTimeout(() => {
                logout();
                redirect("/auth/login");
              }, 1500);
            }
          }
        } catch (error) {
          console.error("Failed to fetch store info:", error);
          toast.error(`Failed to fetch store info: ${String(error)}`);
          setTimeout(() => {
            redirect("/auth/login");
          }, 1000);
        }
      }
      getStoreInfo();
    }
  }, [store]);

  return (
    <SidebarProvider>
      {isArchived && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            <h2 className="text-xl font-semibold mb-2 text-gray-600">Store Archived</h2>
            <p className="text-gray-600">Your store has been archived. Please contact the administrator for further assistance.</p>
            <p className="text-gray-600">Your menu is still available, but you cannot edit it.</p>
          </div>
        </div>
      )}
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <NavBreadcrumbs />
          </div>
          <div className="flex items-center gap-2 ml-auto mx-1">
            <div className="mx-3">
              <NavNotification />
            </div>
            <NavTheme />
            <NavLanguage />
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 px-2 py-4 pt-0">
          <div>{children}</div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
