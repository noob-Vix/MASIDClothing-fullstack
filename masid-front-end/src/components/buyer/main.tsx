import { useAuthContext } from "@/context/AuthContext";
import { useProductContext } from "@/context/ProductContext";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import type { product } from "@/types/data";
import ProductCard from "../productCard";
import { useNavigate } from "react-router";

export default function Main() {
  const [isLoading, setIsLoading] = useState(false);
  const { product, dispatch } = useProductContext();
  const { user } = useAuthContext();
  const navigate = useNavigate();

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
        return toast.error(json.message);
      }

      setIsLoading(false);
      dispatch({ type: "SET_PRODUCT", payload: json.productList });
    }

    getProduct();
  }, []);

  function onClickProduct(data: product) {
    console.log(data);
    navigate("/buyer/product-info", {
      state: data,
    });
  }

  return (
    <main className="flex flex-wrap overflow-y-scroll gap-2 mx-4 max-h-full">
      {isLoading ? (
        ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l"].map(
          (i) => (
            <div key={i} className="flex flex-col rounded-[10px] overflow-hidden gap-1 border border-neutral-800 h-44 w-40 animate-pulse bg-neutral-100">
              <Skeleton className="h-full w-full bg-neutral-300" />
              <div className="p-2 text-sm flex flex-col gap-2 w-full">
                <div>
                  <Skeleton className="h-4 w-24 bg-neutral-300 rounded mb-1" />
                  <Skeleton className="h-3 w-16 bg-neutral-200 rounded" />
                </div>
              </div>
            </div>
          )
        )
      ) : product.length !== 0 ? (
        product.map((p) => (
          <ProductCard key={p.id} data={p} onClick={() => onClickProduct(p)} />
        ))
      ) : (
        <div className="w-full h-full flex justify-center items-center">
          <p className="text-2xl text-neutral-800 font-semibold">No Product</p>
        </div>
      )}
    </main>
  );
}
