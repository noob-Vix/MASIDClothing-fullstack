import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { User } from "lucide-react";
import { Button } from "../ui/button";
import { useEffect, useState } from "react";
import { useAuthContext } from "@/context/AuthContext";
import { toast } from "sonner";
import type { order, user } from "@/types/data";
import CustomerProfile from "./customerProfile";
import CustomerOrder from "./customerOrder";

export type userInfo = user & {
    orderItemList: order[] | []
}

export default function CustomerDialog() {
  const [isLoading, setIsLoading] = useState(false);
  const [customerInfo, setCustomerInfo] = useState<userInfo | undefined>(undefined);
  const { user, dispatch } = useAuthContext();

  useEffect(() => {
    async function getCustomerInfo() {
      setIsLoading(true);

      const response = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/user/my-info`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      const json = await response.json();

      if (!response.ok) {
        setIsLoading(false);
        return toast.warning(json.message);
      }

      setCustomerInfo(json.user)
      setIsLoading(false);
    }

    getCustomerInfo();
  }, []);

  function handleLogout() {
    dispatch({ type: "LOGOUT" })
    localStorage.removeItem("user")
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant={"ghost"} size={"icon"}>
          <User className="!size-6" />
        </Button>
      </DialogTrigger>
      <DialogContent className="flex flex-col max-sm:rounded-none max-sm:min-w-full max-sm:h-full text-neutral-800">
        <DialogHeader className="mb-4">
          <DialogTitle className="text-neutral-800 text-start">Cutomer</DialogTitle>
          <DialogDescription hidden>
            The profile, orders, and logout of user.
          </DialogDescription>
        </DialogHeader>
        {!isLoading && <CustomerProfile customer={customerInfo!}/>}
        {!isLoading && <CustomerOrder orders={customerInfo?.orderItemList ? customerInfo?.orderItemList : []}/>}
        <Button variant={"destructive"} onClick={handleLogout} className="mt-auto">Logout</Button>
      </DialogContent>
    </Dialog>
  );
}
