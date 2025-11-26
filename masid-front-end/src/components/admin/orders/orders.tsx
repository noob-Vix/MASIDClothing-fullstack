import OrderedItems from "./orderedItems";
import { SidebarTrigger } from "@/components/ui/sidebar";

export default function Orders() {
  return (
    <div className="h-screen flex flex-col">
      <header className="flex shrink-0 items-center gap-2 p-4">
        <SidebarTrigger className="-ml-1" />
        <h1 className="text-neutral-800 font-semibold text-lg">Orders</h1>
      </header>
      <OrderedItems />
    </div>
  );
}
