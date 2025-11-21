import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import type { order, orderStatus } from "@/types/data";
import { DialogTrigger } from "@radix-ui/react-dialog";
import ProductInfo from "./productInfo";
import CustomerInfo from "./customerInfo";
import {
  Select,
  SelectTrigger,
  SelectItem,
  SelectContent,
  SelectValue,
} from "@/components/ui/select";
import { useAuthContext } from "@/context/AuthContext";
import { useProductContext } from "@/context/ProductContext";
import { toast } from "sonner";
import { format } from "date-fns";

type ItemsTableProps = {
  orders: order[];
};

export default function ItemsTable({ orders }: ItemsTableProps) {
  const { user } = useAuthContext();
  const { dispatch } = useProductContext();

  async function handleChangeStatus(id: number, status: string) {
    const formData = new FormData();
    formData.append("status", status);

    const response = await fetch(
      `${import.meta.env.VITE_SERVER_URL}/order/update-item-status/${id}`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
        body: formData,
      }
    );

    const json = await response.json();

    if (!response.ok) {
      return toast.warning(json.message);
    }

    toast.success(json.message);
    dispatch({
      type: "UPDATE_ORDER_STATUS",
      payload: { orderId: id, newStatus: status as orderStatus },
    });
  }

  return (
    <div className="border-1 border-neutral-300 rounded-2xl h-full overflow-hidden">
      <table className="w-full">
        <thead>
          <tr className="text-neutral-800 bg-neutral-200">
            <th className="font-semibold p-3">Order ID</th>
            <th className="font-semibold p-3">QTY</th>
            <th className="font-semibold p-3">Price</th>
            <th className="font-semibold p-3">Ordered At</th>
            <th className="font-semibold p-3">Status</th>
            <th></th>
          </tr>
        </thead>
        <tbody className="text-center">
          {orders.map((item) => (
            <tr key={item.id} className="w-full font-semibold text-neutral-800 border-b-1">
              <td className="py-2">{item.id}</td>
              <td className="py-2">{item.quantity}</td>
              <td className="py-2">{item.price}</td>
              <td className="py-2">{format(new Date(item.createdAt), "MM/dd/yyyy")}</td>
              <td className="flex justify-center py-2">
                <Select
                  defaultValue={item.status}
                  onValueChange={(value) => handleChangeStatus(item.id, value)}
                >
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PENDING">Pending</SelectItem>
                    <SelectItem value="CONFIRMED">Confirmed</SelectItem>
                    <SelectItem value="SHIPPED">Shipped</SelectItem>
                    <SelectItem value="DELIVERED">Delivered</SelectItem>
                    <SelectItem value="CANCELLED">Cancelled</SelectItem>
                    <SelectItem value="RETURNED">Returned</SelectItem>
                  </SelectContent>
                </Select>
              </td>
              <td className="space-x-3 py-2">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="w-28">Customer</Button>
                  </DialogTrigger>
                  <CustomerInfo customer={item.user} />
                </Dialog>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="w-28">Product</Button>
                  </DialogTrigger>
                  <ProductInfo product={item.product} />
                </Dialog>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
