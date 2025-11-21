import { useAuthContext } from "@/context/AuthContext";
import { useProductContext } from "@/context/ProductContext";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import ProductSkeleton from "./productSkeleton";
import type { product } from "@/types/data";
import { Dialog } from "@/components/ui/dialog";
import ProductDialog from "./productDialog";

export default function ProductList() {
  const [isLoading, setIsLoading] = useState(false);
  const { product, dispatch } = useProductContext();
  const [clickProduct, setClickProduct] = useState<product | null>(null);
  const { user } = useAuthContext();

  useEffect(() => {
    async function getProduct() {
      setIsLoading(true);

      const response = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/product/get-all`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      const json = await response.json();

      if (!response.ok) {
        setIsLoading(false);
        return toast.error(json.error);
      }

      setIsLoading(false);
      dispatch({ type: "SET_PRODUCT", payload: json.productList });
    }

    getProduct();
  }, []);

  function onClickProduct(data: product) {
    setClickProduct(data);
  }

  return (
    <main className="flex flex-wrap overflow-y-scroll gap-2 p-2">
      <Dialog
        open={clickProduct !== null}
        onOpenChange={() => setClickProduct(null)}
      >
        {clickProduct && (
          <ProductDialog
            product={clickProduct}
            closeDialog={() => setClickProduct(null)}
          />
        )}
      </Dialog>
      {isLoading ? (
        ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l"].map(
          (i) => <ProductSkeleton key={i} />
        )
      ) : product.length !== 0 ? (
        product.map((p) => (
          <div
            key={p.id}
            onClick={() => onClickProduct(p)}
            className="flex flex-row rounded-[10px] overflow-hidden gap-1 border border-neutral-800 h-32 min-w-64"
          >
            <img
              src={
                typeof p.imageUrl === "string"
                  ? p.imageUrl
                  : URL.createObjectURL(p.imageUrl)
              }
              className="h-full"
            />
            <div className="p-2 text-sm max-w-36">
              <div>
                <h1 className="font-semibold">Product ID</h1>
                <p className="font-medium text-neutral-700">{p.id}</p>
              </div>
              <div>
                <h1 className="font-semibold">Product Name</h1>
                <p className="font-medium text-neutral-700 truncate">{p.name}</p>
              </div>
              {/* <div>
                <h1 className="font-semibold">Category</h1>
                <p className="font-medium text-neutral-500">{p.category}</p>
              </div> */}
            </div>
          </div>
        ))
      ) : (
        <div className="w-full h-full flex justify-center items-center">
          <p className="text-2xl text-neutral-800 font-semibold">No Product</p>
        </div>
      )}
    </main>
  );
}
