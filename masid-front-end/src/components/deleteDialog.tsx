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
import { Button } from "./ui/button";
import { Trash } from "lucide-react";

type DeleteDialogProps = {
  action: (id: string) => void;
  productId: string;
  triggerText: string;
  title: string;
  description: string;
  icon?: boolean;
};

export default function DeleteDialog({
  action,
  triggerText,
  title,
  description,
  productId,
  icon,
}: DeleteDialogProps) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          className="flex flex-col gap-2 border-[1.5px] border-neutral-800 w-24 font-semibold hover:border-red-500 hover:text-red-500 hover:bg-transparent"
          variant={"outline"}
        >
          {icon && <Trash size={25} />}
          {triggerText}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="w-fit">
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription hidden>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <p className="font-medium text-neutral-700 text-sm">{description}</p>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={() => action(productId)}>
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
