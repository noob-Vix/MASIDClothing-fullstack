import { useProductContext } from "@/context/ProductContext";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import type { product } from "@/types/data";
import ProductCard from "@/components/productCard";
import { useNavigate } from "react-router";
import logo from "@/assets/images/logo-black.png";
import { Button } from "@/components/ui/button";
import { Link } from "react-router";

export default function GuestPage() {
  const [isLoading, setIsLoading] = useState(false);
  const { product, dispatch } = useProductContext();

  const navigate = useNavigate();

  useEffect(() => {
    async function getProduct() {
      setIsLoading(true);

      const response = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/product/get-all`
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
    navigate("/buyer/product-info", { state: data });
  }

  return (
    <>
      {/* Header */}
      <header className="p-4 flex flex-wrap justify-between gap-3">
        <div className="flex gap-10 items-center w-full">
          <img className="aspect-square w-12 max-sm:hidden" src={logo} />
          <Link to={"/buyer/search"}>
            <Button className="w-96 min-sm:w-full lg:w-90 text-neutral-400" variant="outline">
              Search products
            </Button>
          </Link>
        </div>

        

        <div className="flex gap-2">
          <Link to="/about">
            <Button variant="outline">About</Button>
          </Link>
          <Link to="/contact">
            <Button variant="outline">Contact</Button>
          </Link>
          <Link to={"/auth/buyer/login"}>
            <Button>Login</Button>
          </Link>
          <Link to={"/auth/buyer/register"}>
            <Button variant="secondary">Sign-up</Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="w-full bg-neutral-900 text-white py-10 px-6 rounded-xl mb-6">
        <div className="max-w-5xl mx-auto flex flex-col gap-4 text-center">
          <h1 className="text-3xl font-bold">Welcome to ShoeFit</h1>
          <p className="text-neutral-300">
            Discover high-quality Shoes designed for everyday comfort.
          </p>
          <Link to="/buyer/search">
            <Button className="w-40 mx-auto bg-white text-black">Shop Now</Button>
          </Link>
        </div>
      </section>

      {/* Categories */}
      <div className="flex gap-3 overflow-x-auto px-4 pb-4">
        {["All", "New Arrivals", "Men", "Women"].map((cat) => (
          <Button key={cat} variant="secondary" className="whitespace-nowrap">
            {cat}
          </Button>
        ))}
      </div>

      {/* Product Grid */}
      <main className="px-4 pb-10">
        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {Array.from({ length: 12 }).map((_, i) => (
              <Skeleton key={i} className="h-48 w-full rounded-lg bg-neutral-300" />
            ))}
          </div>
        ) : product.length !== 0 ? (
          <div className="flex flex-wrap gap-2">
            {product.map((p) => (
              <ProductCard key={p.id} data={p} onClick={() => onClickProduct(p)} />
            ))}
          </div>
        ) : (
          <div className="w-full h-full flex justify-center items-center">
            <p className="text-2xl text-neutral-800 font-semibold">No Product</p>
          </div>
        )}
      </main>
    </>
  );
}
