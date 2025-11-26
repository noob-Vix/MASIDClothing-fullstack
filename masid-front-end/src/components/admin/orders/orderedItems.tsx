import { CalendarButton } from "@/components/calendarButton";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectItem,
  SelectContent,
  SelectValue,
} from "@/components/ui/select";
import ItemsTable from "./itemsTable";
import { useEffect, useState } from "react";
import { useAuthContext } from "@/context/AuthContext";
import { useProductContext } from "@/context/ProductContext";
import { toast } from "sonner";
import type { orderStatus } from "@/types/data";
import { Button } from "@/components/ui/button";
import LoadingComponent from "@/components/loadingComponent";

export default function OrderedItems() {
  const { user } = useAuthContext();
  const { dispatch, orders } = useProductContext();
  const [isLoading, setIsLoading] = useState(false);
  const [startDate, SetStartDate] = useState<Date | undefined>(undefined);
  const [endDate, SetEndDate] = useState<Date | undefined>(undefined);
  const [input, setInput] = useState("");
  const [status, setStatus] = useState<string | orderStatus>("");

  useEffect(() => {
    async function getOrders() {
      setIsLoading(true);

      const response = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/order/filter`,
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
        return toast.warning(json.message);
      }

      setIsLoading(false);
      // setCategories(json.categoryList);
      dispatch({ type: "SET_ORDERS", payload: json.orderItemList });
    }

    getOrders();
  }, [user.token, dispatch]);

  async function handleFilter(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);

    const params = new URLSearchParams();
    if (startDate) params.append("startDate", startDate.toISOString());
    if (endDate) params.append("endDate", endDate.toISOString());
    if (input) params.append("itemId", input);
    if (status) params.append("status", status);

    const response = await fetch(
      `${import.meta.env.VITE_SERVER_URL}/order/filter?${params.toString()}`,
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
      return toast.warning(json.message);
    }

    setIsLoading(false);
    dispatch({ type: "SET_ORDERS", payload: json.orderItemList });
  }

  return (
    <div className="h-full flex flex-col px-4 pb-4">
      <div>
        <form className="flex flex-wrap gap-3 mb-4" onSubmit={handleFilter}>
          <Input
            type="number"
            value={input}
            placeholder="Type the order ID"
            onChange={(e) => setInput(e.target.value)}
          />
          <CalendarButton date={startDate} setDate={SetStartDate} />
          <CalendarButton date={endDate} setDate={SetEndDate} />
          <Select
            defaultValue={status}
            onValueChange={(value) => setStatus(value)}
            value={status}
          >
            <SelectTrigger className="w-[180px]">
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
          <Button className="w-24" type="submit">Filter</Button>
        </form>
      </div>
      {!isLoading ? <ItemsTable orders={orders} /> : <LoadingComponent />}
    </div>
  );
}
