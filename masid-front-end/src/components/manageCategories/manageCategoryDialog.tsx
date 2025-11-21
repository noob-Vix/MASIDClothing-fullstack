import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import ManageCategoriesBody from "./manageCategoriesBody";
import { Button } from "../ui/button";

export default function ManageCategoryDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant={"outline"} className="text-neutral-800 font-semibold">
          Manage Categories
        </Button>
      </DialogTrigger>
      <ManageCategoriesBody />
    </Dialog>
  );
}
