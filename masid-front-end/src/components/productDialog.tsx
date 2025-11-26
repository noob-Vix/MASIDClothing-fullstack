import {
  DialogContent,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import type { product } from "@/types/data";
import { Button } from "./ui/button";
import { Pencil } from "lucide-react";
import UpdateProduct from "./updateProduct";
import { useState } from "react";
import DeleteDialog from "./deleteDialog";
import { toast } from "sonner";
import { useAuthContext } from "@/context/AuthContext";
import { useProductContext } from "@/context/ProductContext";

type ProductDialogProps = {
  product: product;
  closeDialog: () => void;
};

export default function ProductDialog({ product, closeDialog }: ProductDialogProps) {
  const [isUpdate, setIsUpdate] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuthContext();
  const { dispatch } = useProductContext();

  function onClickUpdate() {
    setIsUpdate((p) => !p);
  }

  async function handleDelete(id: string) {
    setIsLoading(true);

    const response = await fetch(
      `${import.meta.env.VITE_SERVER_URL}/product/delete/${id}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      }
    );

    const json = await response.json();

    if (!response.ok) {
      setIsLoading(false);
      return toast.error(json.message);
    }

    dispatch({ type: "DELETE_PRODUCT", payload: id })
    toast.success(json.message);
    setIsLoading(false);
    closeDialog();
  }

  return (
    <DialogContent className="min-w-[50%] max-sm:min-h-full max-sm:min-w-full max-sm:rounded-none p-0 overflow-hidden">
      {!isUpdate ? (
        <div className="flex w-full">
          <div className="flex flex-row max-sm:flex-col gap-2 w-full">
            <div className="relative w-1/2 max-sm:w-full h-full bg-neutral-900 flex justify-center items-center">
              <img className="object-contain w-full aspect-square" src={typeof product.imageUrl === "string" ? product.imageUrl : URL.createObjectURL(product.imageUrl)} alt="Product Image" />
            </div>
            <div className="p-4 w-1/2 max-sm:w-full h-full flex flex-col justify-between gap-4">
              <div className="flex flex-col space-y-2">
                <DialogHeader className="mb-4">
                  <DialogTitle className="font-semibold text-neutral-800">
                    Product Details
                  </DialogTitle>
                  <div className="flex flex-row gap-2 mt-2">
                    <Button
                      onClick={onClickUpdate}
                      className="border-[1.5px] border-neutral-800 w-24 font-semibold hover:border-blue-500 hover:text-blue-500 hover:bg-transparent"
                      variant={"outline"}
                    >
                      <Pencil size={25} /> Update
                    </Button>
                    <DeleteDialog
                      action={handleDelete}
                      productId={product.id}
                      triggerText="Delete"
                      title="Delete Product"
                      description="Are you sure you want to delete this product?"
                    />
                  </div>
                </DialogHeader>
                <div>
                  <h1 className="font-semibold text-sm text-neutral-800">
                    Product ID
                  </h1>
                  <p className="font-medium text-sm text-neutral-700">
                    {product.id}
                  </p>
                </div>
                <div>
                  <h1 className="font-semibold text-sm text-neutral-800">
                    Name
                  </h1>
                  <p className="font-medium text-sm text-neutral-700">
                    {product.name}
                  </p>
                </div>
                <div>
                  <h1 className="font-semibold text-sm text-neutral-800">
                    Description
                  </h1>
                  <p className="font-medium text-md text-neutral-700">
                    {product.description}
                  </p>
                </div>
                <div>
                  <h1 className="font-semibold text-sm text-neutral-800">
                    Price
                  </h1>
                  <p className="font-medium text-sm text-neutral-700">
                    {product.price}
                  </p>
                </div>
                {/* <div>
                    <h1>Category</h1>
                    <p>{product.category}</p>
                </div> */}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <UpdateProduct product={product} cancel={setIsUpdate} closeDialog={closeDialog}/>
      )}
    </DialogContent>
  );
}
