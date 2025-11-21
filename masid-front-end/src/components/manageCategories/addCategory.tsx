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
import { Plus } from "lucide-react";
import { useAuthContext } from "@/context/AuthContext";
import { toast } from "sonner";

type AddCategoryProps = {
    
}

export default function AddCategory({}: AddCategoryProps) {
  const { user } = useAuthContext();
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleAddNew() {
    setIsLoading(true);

    const newData = {
        name: input
    }

    const response = await fetch(
      `${import.meta.env.VITE_SERVER_URL}/category/create`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify(newData)
      }
    );
    const json = await response.json();

    if (!response.ok) {
      setIsLoading(false);
      return toast.warning(json.message);
    }
    
    toast.success(json.message);
    setIsLoading(false);
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant={"outline"} className="w-24">
          <Plus size={15} /> Add
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Add New Category</AlertDialogTitle>
          <AlertDialogDescription hidden></AlertDialogDescription>
        </AlertDialogHeader>
        <Input value={input} onChange={(e) => setInput(e.target.value)} />
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleAddNew}>Add</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
