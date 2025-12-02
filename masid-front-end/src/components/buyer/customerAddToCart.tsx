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
  const { product } = useProductContext();

  const [cart, setCart] = useState<extendedProducts[] | []>([]);
  const [checkedItems, setCheckedItems] = useState<item[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const SHIPPING_FEE = 50; // Fixed shipping fee

  // Load cart from localStorage and map to product details
  useEffect(() => {
    const localCart = localStorage.getItem("item");
    if (!localCart) return;

    const cartItems: item[] = JSON.parse(localCart);

    const items = product
      .filter((p) => cartItems.some((ci) => ci.productId === p.id))
      .map((p) => ({
        ...p,
        quantity: cartItems.find((ci) => ci.productId === p.id)?.quantity ?? 1,
      }));

    setCart(items);

    // Initially mark all items as checked
    setCheckedItems(
      items.map((item) => ({ productId: item.id, quantity: item.quantity }))
    );
  }, [product]);

  // Save cart to localStorage
  function saveCartToLocal(updated: extendedProducts[]) {
    localStorage.setItem(
      "item",
      JSON.stringify(
        updated.map((i) => ({ productId: i.id, quantity: i.quantity }))
      )
    );
  }

  // Increment quantity
  function increaseQuantity(id: string) {
    const updated = cart.map((item) =>
      item.id === id ? { ...item, quantity: item.quantity + 1 } : item
    );
    setCart(updated);
    saveCartToLocal(updated);

    // Update checkedItems if item is checked
    setCheckedItems((prev) =>
      prev.map((ci) =>
        ci.productId === id ? { ...ci, quantity: ci.quantity + 1 } : ci
      )
    );
  }

  // Decrement quantity (min 1)
  function decreaseQuantity(id: string) {
    const updated = cart.map((item) =>
      item.id === id && item.quantity > 1
        ? { ...item, quantity: item.quantity - 1 }
        : item
    );
    setCart(updated);
    saveCartToLocal(updated);

    setCheckedItems((prev) =>
      prev.map((ci) =>
        ci.productId === id && ci.quantity > 1
          ? { ...ci, quantity: ci.quantity - 1 }
          : ci
      )
    );
  }

  // Remove single item from cart
  function handleRemoveItem(id: string) {
    const newCart = cart.filter((i) => i.id !== id);
    setCart(newCart);
    saveCartToLocal(newCart);
    setCheckedItems((prev) => prev.filter((ci) => ci.productId !== id));
  }

  // Toggle check/uncheck single item
  const handleCheckItem = (id: string, quantity: number) => {
    setCheckedItems((prev) =>
      prev.some((item) => item.productId === id)
        ? prev.filter((item) => item.productId !== id)
        : [...prev, { productId: id, quantity }]
    );
  };

  // Toggle check all
  const handleCheckAll = () => {
    if (checkedItems.length === cart.length) {
      setCheckedItems([]);
    } else {
      setCheckedItems(
        cart.map((item) => ({ productId: item.id, quantity: item.quantity }))
      );
    }
  };

  // Place order
  async function placeOrder() {
    if (!checkedItems.length) return toast.error("No items selected!");

    setIsLoading(true);

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

    // Remove only checked items from cart
    const remaining = cart.filter(
      (i) => !checkedItems.some((ci) => ci.productId === i.id)
    );
    setCart(remaining);
    saveCartToLocal(remaining);

    // Clear checked items
    setCheckedItems([]);
    setIsLoading(false);
  }

  // Calculate total
  const totalPrice = checkedItems.reduce((acc, ci) => {
    const productPrice = Number(
      cart.find((p) => p.id === ci.productId)?.price ?? 0
    );
    return acc + productPrice * ci.quantity;
  }, 0);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant={"ghost"} size={"icon"} className="text-neutral-800">
          <ShoppingCart className="!size-6" />
        </Button>
      </DialogTrigger>
      <DialogContent className="p-0 gap-0 flex flex-col max-sm:rounded-none max-sm:min-w-full max-sm:min-h-dvh max-h-[60%]">
        <DialogHeader className="border-b p-4">
          <DialogTitle className="text-neutral-800 text-start">
            Your Cart
          </DialogTitle>
          <DialogDescription hidden>Your cart</DialogDescription>
        </DialogHeader>

        <div className="px-4 pt-4 flex flex-col overflow-y-scroll h-full gap-2">
          {cart.length ? (
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
                  className="aspect-square object-cover w-[4rem] rounded-lg border"
                  src={
                    typeof item.imageUrl === "string"
                      ? item.imageUrl
                      : URL.createObjectURL(item.imageUrl)
                  }
                  alt="product image"
                />
                <div className="flex flex-col w-full overflow-hidden">
                  <h1 className="text-md overflow-hidden text-ellipsis font-semibold text-neutral-800">
                    {item.name}
                  </h1>
                  <div className="flex justify-between items-center mt-1">
                    {/* Quantity controls */}
                    <div className="flex items-center gap-2">
                      <Button
                        className="text-center font-bold text-gray-800"
                        variant="outline"
                        size="sm"
                        onClick={() => decreaseQuantity(item.id)}
                      >
                        -
                      </Button>
                      <span className="font-semibold text-md text-neutral-700">
                        {item.quantity}
                      </span>
                      <Button
                        className="text-center font-bold text-gray-800"
                        variant="outline"
                        size="sm"
                        onClick={() => increaseQuantity(item.id)}
                      >
                        +
                      </Button>
                    </div>
                    <span className="font-semibold text-md text-neutral-700">
                      ₱{item.price}
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

        <div className="mt-auto">
          <div className="border-t p-4 flex flex-col gap-1 mt-2 text-sm">
            <p className="text-neutral-700 font-semibold">
              Subtotal: ₱{totalPrice}
            </p>
            <p className="text-neutral-700 font-semibold">
              Shipping: ₱{SHIPPING_FEE}
            </p>
            <p className="text-neutral-800 font-bold">
              Total: ₱{totalPrice + SHIPPING_FEE}
            </p>
          </div>

          <div className="flex justify-between items-center h-fit p-4 border-t gap-2">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={checkedItems.length === cart.length && cart.length > 0}
                onChange={handleCheckAll}
                className="accent-neutral-800"
              />
              <span className="font-semibold text-neutral-700">Check All</span>
            </label>
            <Button
              onClick={placeOrder}
              disabled={cart.length === 0 || !checkedItems.length}
            >
              {isLoading ? <Loader2Icon /> : "Place Order"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
