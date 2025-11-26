import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { ProductProvider } from "@/context/ProductContext";
import { Toaster } from "@/components/ui/sonner"
import { Outlet } from "react-router";


export default function AdminDashboard() {
  return (
    <ProductProvider>
      <SidebarProvider
        style={
          {
            "--sidebar-width": "19rem",
          } as React.CSSProperties
        }
      >
        <Toaster />
        <AppSidebar />
        <SidebarInset className="h-screen">
          <Outlet />
        </SidebarInset>
      </SidebarProvider>
    </ProductProvider>
  );
}
