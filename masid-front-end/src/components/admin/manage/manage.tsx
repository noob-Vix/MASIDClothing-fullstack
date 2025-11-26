import {
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { SearchForm } from "@/components/search-form";
import ManageCategoryDialog from "@/components/manageCategories/manageCategoryDialog";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import AddProduct from "@/components/addProduct";
import ProductList from "@/components/productList";

export default function Manage() {
  return (
    <>
      <header className="flex shrink-0 items-center gap-2 p-4 justify-between">
        <div className="flex flex-col w-full gap-5">
          <div className="flex flex-row justify-between items-center">
            <div className="flex flex-row mr-4">
              <SidebarTrigger className="-ml-1" />
              <h1 className="font-semibold text-lg text-neutral-800 max-sm:hidden">Manage</h1>
            </div>
            <SearchForm />
          </div>
          <div className="flex gap-2">
            <ManageCategoryDialog />
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  variant={"outline"}
                  className="text-neutral-800 font-semibold"
                >
                  <Plus size={25} className="text-neutral-800" /> Product
                </Button>
              </DialogTrigger>
              <AddProduct />
            </Dialog>
          </div>
        </div>
      </header>
      <ProductList />
    </>
  );
}
