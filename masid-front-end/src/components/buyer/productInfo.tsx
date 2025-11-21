import { Link } from "react-router";
import { Button } from "../ui/button";
import { ArrowLeft } from "lucide-react";
import { useLocation } from "react-router";
import { Input } from "../ui/input";
import { useState } from "react";
import { toast } from "sonner";
import { useNavigate } from "react-router";

type item = {
  productId: number;
  quantity: number;
};

export default function ProductInfo() {
  const navigate = useNavigate();
  const location = useLocation();
  const { id, imageUrl, name, description, price } = location.state;
  const [quantity, setQuantity] = useState(1);

  function addToCart() {
    let item: item = {
      productId: id,
      quantity: quantity,
    };
    const items = localStorage.getItem("item");
    if (!items) {
      localStorage.setItem("item", JSON.stringify([item]));
      return toast.success("Added to cart");
    }
    const cart: item[] = JSON.parse(items);

    const findItemIfAlreadyInCart = cart.find(
      (i) => i.productId === item.productId
    );
    let filteredCart: item[] = cart;

    if (findItemIfAlreadyInCart) {
      item = {
        productId: id,
        quantity: findItemIfAlreadyInCart.quantity + item.quantity,
      };

      filteredCart = cart.filter((i) => i.productId !== item.productId);
    }

    const updatedCart = [...filteredCart, item];
    localStorage.setItem("item", JSON.stringify(updatedCart));
    toast.success("Added to cart");
    navigate("/buyer");
  }

  return (
    <div className="flex flex-col h-screen p-4 gap-2">
      <header>
        <Link to={"/buyer"}>
          <Button variant={"outline"}>
            <ArrowLeft /> Back
          </Button>
        </Link>
      </header>
      <main className="flex h-full justify-center items-center gap-10 max-sm:flex-col">
        <img
          className="object-cover w-2xs rounded-2xl max-sm:w-full"
          src={
            typeof imageUrl === "string"
              ? imageUrl
              : URL.createObjectURL(imageUrl)
          }
        />
        <div className="h-[40%] w-[25%] max-sm:w-full flex flex-col justify-between">
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl overflow-hidden text-ellipsis font-semibold text-neutral-800">
              {name}
            </h1>
            <p className="text-md font-medium text-neutral-700">
              {description}
            </p>
          </div>
          <div className="flex flex-col gap-2">
            <span className="text-md font-semibold text-neutral-800">
              Price {price}
            </span>
            <Input
              type="number"
              min={1}
              placeholder="Quantity"
              className="w-1/2"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
            />
            <Button onClick={addToCart}>Add to Cart</Button>
          </div>
        </div>
      </main>
    </div>
  );
}
