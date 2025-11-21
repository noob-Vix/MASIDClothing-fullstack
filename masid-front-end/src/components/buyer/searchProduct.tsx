import { SearchForm } from "../search-form";
import { useProductContext } from "@/context/ProductContext";
import ProductCard from "../productCard";
import { Button } from "../ui/button";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router";
import type { product } from "@/types/data";
import { useNavigate } from "react-router";

export default function SearchProduct() {
  const { product } = useProductContext();
  const navigate = useNavigate();

  function onClickProduct(data: product) {
    console.log(data);
    navigate("/buyer/product-info", {
      state: data,
    });
  }

  return (
    <div>
      <header className="m-4 flex gap-5 max-sm:flex-col-reverse">
        <Link to={"/buyer"}>
          <Button
            variant={"outline"}
            className="text-neutral-800 font-semibold"
          >
            <ArrowLeft /> Back
          </Button>
        </Link>
        <SearchForm className="w-96" />
      </header>
      <main className="flex flex-wrap overflow-y-scroll gap-2 mx-4 max-h-full">
        {product.length !== 0 ? (
          product.map((p) => (
            <ProductCard key={p.id} data={p} onClick={() => onClickProduct(p)} />
          ))
        ) : (
          <div className="w-full h-full flex justify-center items-center">
            <p className="text-2xl text-neutral-800 font-semibold">
              No Product
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
