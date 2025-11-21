import type { order } from "@/types/data";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { ShoppingBag } from "lucide-react";
import { format } from "date-fns";

type CustomerOrderProps = {
  orders: order[] | [];
};

const status = {
  PENDING: "text-yellow-500 bg-yellow-200",
  SHIPPED: "text-orange-500 bg-orange-200",
  RETURNED: "text-purple-500 bg-purple-200",
  DELIVERED: "text-green-500 bg-green-200",
  CONFIRMED: "text-blue-500 bg-blue-200",
  CANCELLED: "text-red-500 bg-red-200",
}

export default function CustomerOrder({ orders }: CustomerOrderProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant={"ghost"}
          className="justify-start font-semibold text-md"
        >
          <ShoppingBag className="!size-6" /> Orders
        </Button>
      </DialogTrigger>
      <DialogContent className="flex flex-col max-sm:min-w-full max-sm:min-h-full max-sm:rounded-none">
        <DialogHeader>
          <DialogTitle className="w-full flex justify-start text-neutral-800">Orders</DialogTitle>
          <DialogDescription hidden>Your orders</DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-2 max-w-full">
          {orders.length !== 0 ? (
            orders.map((item) => (
              <div key={item.id} className="flex gap-3 max-w-full">
                <img
                  className="aspect-square object-cover w-[4rem] h-[4rem] rounded-2xl"
                  src={
                    typeof item.product.imageUrl === "string"
                      ? item.product.imageUrl
                      : URL.createObjectURL(item.product.imageUrl)
                  }
                />
                <div className="flex flex-col w-full text-ellipsis">
                  <div className="flex justify-between items-center w-full">
                    <h1 className="text-lg overflow-hidden text-ellipsis w-36 text-neutral-800 font-semibold">{item.product.name}</h1>
                    <span className="font-semibold text-neutral-500 text-sm max-sm:w-20">Ordered At {format(item.createdAt, "MM/dd/yyyy")}</span>
                  </div>
                  <div className="flex justify-between items-center max-sm:flex-col max-sm:items-start max-sm:gap-1">
                    <div className="flex gap-2 text-sm font-semibold text-neutral-700">
                      <h2>QTY</h2>
                      <span>{item.quantity}</span>
                    </div>
                    <div className="flex gap-2 text-sm font-semibold text-neutral-700">
                      <h2>Price</h2>
                      <span>{item.price}</span>
                    </div>
                    <div className="flex gap-2 items-center">
                      <h2 className="text-sm font-semibold text-neutral-700">Status</h2>
                      <span className={`${status[item.status]} rounded-sm px-2 py-1 font-semibold text-sm`}>{item.status}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center font-semibold text-neutral-600">
              <h1>No Orders</h1>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
