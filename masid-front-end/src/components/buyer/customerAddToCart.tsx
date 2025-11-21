import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Loader2Icon, ShoppingCart } from "lucide-react";
import { useProductContext } from "@/context/ProductContext";
import type { product } from "@/types/data";
import { useAuthContext } from "@/context/AuthContext";
import { toast } from "sonner";

type item = {
  productId: string;
  quantity: number;
};

type extendedProducts = product & {
  quantity: number;
};

export default function CustomerAddToCart() {
  const { user } = useAuthContext();
  const [cart, setCart] = useState<extendedProducts[] | []>([]);
  const [checkedItems, setCheckedItems] = useState<item[]>([]);
  const { product } = useProductContext();
  const [isLoading, setIsLoading] = useState(false);

  // console.log(cart);

  useEffect(() => {
    function getCart() {
      const localCart = localStorage.getItem("item");
      if (!localCart) return;

      const cartItems: item[] = JSON.parse(localCart);

      const items = product
        .filter((p) => cartItems.some((ci) => ci.productId === p.id))
        .map((p) => ({
          ...p,
          quantity:
            cartItems.find((ci) => ci.productId === p.id)?.quantity ?? 1,
        }));
      setCart(items);
      setCheckedItems(
        items.map((item) => ({ productId: item.id, quantity: item.quantity }))
      );
    }

    getCart();
  }, [product]);

  const handleCheckItem = (id: string, quantity: number) => {
    setCheckedItems((prev) =>
      prev.some((item) => item.productId === id)
        ? prev.filter((item) => item.productId !== id)
        : [...prev, { productId: id, quantity }]
    );
  };
  const handleCheckAll = () => {
    if (checkedItems.length === cart.length) {
      setCheckedItems([]);
    } else {
      setCheckedItems(
        cart.map((item) => ({ productId: item.id, quantity: item.quantity }))
      );
    }
  };

  async function placeOrder() {
    setIsLoading(true);
    console.log(JSON.stringify({ items: checkedItems }));
    const response = await fetch(
      `${import.meta.env.VITE_SERVER_URL}/order/create`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({ items: checkedItems }),
      }
    );

    const json = await response.json();

    if (!response.ok) {
      setIsLoading(false);
      return toast.error(json.message);
    }

    toast.success(json.message);
    setCart(
      cart.filter((i) => !checkedItems.some((ci) => i.id !== ci.productId))
    );
    const updatedCart = cart.map((item) => ({
      productId: item.id,
      quantity: item.quantity,
    }));
    localStorage.setItem("item", JSON.stringify(updatedCart));
    setIsLoading(false);
  }

  function handleRemoveItem(id: string) {
    const newCart = cart.filter((i) => i.id !== id);
    setCart(newCart);
    const updatedCart = newCart.map((item) => ({
      productId: item.id,
      quantity: item.quantity,
    }));
    localStorage.setItem("item", JSON.stringify(updatedCart));
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant={"ghost"} size={"icon"} className="text-neutral-800">
          <ShoppingCart className="!size-6" />
        </Button>
      </DialogTrigger>
      <DialogContent className="flex flex-col max-sm:rounded-none max-sm:min-w-full max-sm:min-h-full  max-h-[60%]">
        <DialogHeader>
          <DialogTitle className="text-neutral-800 text-start">Your Cart</DialogTitle>
          <DialogDescription hidden>Your cart</DialogDescription>
        </DialogHeader>
        <div className="flex flex-col overflow-y-scroll h-full gap-2 ">
          {cart.length !== 0 ? (
            cart.map((item) => (
              <div key={item.id} className="flex gap-3 max-w-full items-center">
                <input
                  type="checkbox"
                  checked={checkedItems.some(
                    (checked) => checked.productId === item.id
                  )}
                  onChange={() => handleCheckItem(item.id, item.quantity)}
                  className="accent-neutral-800"
                />
                <img
                  className="aspect-square object-cover w-[3rem] rounded-2xl"
                  src={
                    typeof item.imageUrl === "string"
                      ? item.imageUrl
                      : URL.createObjectURL(item.imageUrl)
                  }
                  alt="product image"
                />
                <div className="flex flex-col w-full overflow-hidden ">
                  <div>
                    <h1 className="text-md overflow-hidden text-ellipsis font-semibold text-neutral-800">
                      {item.name}
                    </h1>
                  </div>
                  <div className="flex justify-between">
                    <p className="font-semibold text-md text-neutral-700">
                      Quantity: {item.quantity}
                    </p>
                    <span className="font-semibold text-md text-neutral-700">
                      Price: {item.price}
                    </span>
                    <Button
                      variant={"outline"}
                      size={"sm"}
                      className="font-semibold text-neutral-700"
                      onClick={() => handleRemoveItem(item.id)}
                    >
                      Remove
                    </Button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="flex items-center justify-center text-center font-semibold h-full text-neutral-500">
              <p>Your Cart is empty.</p>
            </div>
          )}
        </div>
        <div className="flex justify-between items-center h-fit py-2 gap-2 mt-auto ">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={checkedItems.length === cart.length && cart.length > 0}
              onChange={handleCheckAll}
              className="accent-neutral-800"
            />
            <span className="font-semibold text-neutral-700">Check All</span>
          </label>
          <Button onClick={placeOrder} disabled={cart.length === 0}>
            {isLoading ? <Loader2Icon /> : "Place Order"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
