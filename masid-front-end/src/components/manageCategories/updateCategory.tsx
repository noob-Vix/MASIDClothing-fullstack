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
import { Input } from "../ui/input";
import { useState } from "react";
import { Pencil } from "lucide-react";
import { useProductContext } from "@/context/ProductContext";
import { useAuthContext } from "@/context/AuthContext";
import { toast } from "sonner";
import type { category } from "@/types/data";

type UpdateCategoryProps = {
  categoryId: string;
  setState: React.Dispatch<React.SetStateAction<category>>;
};

export default function UpdateCategory({
  categoryId,
  setState,
}: UpdateCategoryProps) {
  const { user } = useAuthContext();
  const { dispatch } = useProductContext();
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleUpdate() {
    setIsLoading(true);

    const newData = {
      id: categoryId,
      name: input,
    };

    const response = await fetch(
      `${import.meta.env.VITE_SERVER_URL}/category/update/${categoryId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify(newData),
      }
    );
    const json = await response.json();

    if (!response.ok) {
      setIsLoading(false);
      return toast.warning(json.message);
    }

    toast.success(json.message);
    setIsLoading(false);
    dispatch({
      type: "UPDATE_CATEGORY",
      payload: { categoryId, updatedData: newData },
    });
    setState({ id: "", name: "" });
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant={"outline"}
          className="w-24 border-[1.5px] border-blue-500 text-blue-500 hover:border-blue-700 hover:text-blue-700 hover:bg-transparent"
          disabled={categoryId === ""}
        >
          <Pencil size={15} /> Update
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Update Category</AlertDialogTitle>
          <AlertDialogDescription hidden></AlertDialogDescription>
        </AlertDialogHeader>
        <Input value={input} onChange={(e) => setInput(e.target.value)} />
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleUpdate}>Save</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
