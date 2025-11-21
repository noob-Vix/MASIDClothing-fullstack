import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { ProductProvider } from "@/context/ProductContext";
import { Toaster } from "@/components/ui/sonner"
import Manage from "@/components/admin/manage/manage";
import { Route, Routes } from "react-router";
import Orders from "@/components/admin/orders/orders";
import Users from "@/components/admin/users/users";

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
          <Routes>
            <Route path="" element={<Manage />}/>
            <Route path="/orders" element={<Orders />}/>
            <Route path="/users" element={<Users />}/>
          </Routes>
        </SidebarInset>
      </SidebarProvider>
    </ProductProvider>
  );
}
