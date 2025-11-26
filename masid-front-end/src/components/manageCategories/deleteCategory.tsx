import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Loader2, Trash } from "lucide-react";
import { useProductContext } from "@/context/ProductContext";
import { useAuthContext } from "@/context/AuthContext";
import { toast } from "sonner";
import type { category } from "@/types/data";

type DeleteCategoryProps = {
  categoryId: string;
  setState: React.Dispatch<React.SetStateAction<category>>;
};

export default function DeleteCategory({
  categoryId,
  setState,
}: DeleteCategoryProps) {
  const { user } = useAuthContext();
  const { dispatch } = useProductContext();
  const [isLoading, setIsLoading] = useState(false);

  async function handleDelete() {
    setIsLoading(true);

    const response = await fetch(
      `${import.meta.env.VITE_SERVER_URL}/category/delete/${categoryId}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      }
    );
    const json = await response.json();

    if (!response.ok) {
      setIsLoading(false);
      return toast.warning(json.message);
    }

    toast.success(json.message);
    setIsLoading(false);
    dispatch({ type: "DELETE_CATEGORY", payload: categoryId });
    setState({ id: "", name: "" });
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant={"outline"}
          className="w-24 border-[1.5px] border-red-500 text-red-500 hover:border-red-700 hover:text-red-700 hover:bg-transparent"
          disabled={categoryId === ""}
        >
          <Trash size={15} /> Delete
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="w-fit max-sm:min-w-full">
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Category</AlertDialogTitle>
          <AlertDialogDescription hidden>
            Delete Category
          </AlertDialogDescription>
        </AlertDialogHeader>
        <p className="font-medium text-neutral-700 text-sm">
          Are you sure you want to delete this category?
        </p>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete}>{isLoading ? <Loader2 className="animate-spin"/> : "Delete"}</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
