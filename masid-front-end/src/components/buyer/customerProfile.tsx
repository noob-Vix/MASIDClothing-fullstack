import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { User } from "lucide-react";
import { Button } from "../ui/button";
import type { userInfo } from "./customerDialog";
import { useState } from "react";
import CustomerEditAddress from "./customerEditAddress";

type CustomerProfileProps = {
  customer: userInfo;
};

export default function CustomerProfile({ customer }: CustomerProfileProps) {
  const [editAddress, setEditAddress] = useState(false);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant={"ghost"}
          className="justify-start font-semibold text-md"
        >
          <User className="!size-6" /> Profile
        </Button>
      </DialogTrigger>
      <DialogContent className="w-auto max-sm:min-w-full max-sm:min-h-full max-sm:flex max-sm:flex-col max-sm:rounded-none">
        <DialogHeader>
          <DialogTitle className="text-neutral-800 text-start">{!editAddress ? "Profile" : "Edit Address"}</DialogTitle>
          <DialogDescription hidden>Your profile</DialogDescription>
        </DialogHeader>
        {!editAddress && <div>
          <Button
            variant={"outline"}
            onClick={() => setEditAddress((prev) => !prev)}
            className="font-semibold text-neutral-800"
          >
            Edit Address
          </Button>
        </div>}
        {editAddress ? (
          <CustomerEditAddress setState={setEditAddress} address={customer.address} />
        ) : (
          <div className="flex max-sm:flex-col gap-10">
            <div>
              <div>
                <h1 className="font-semibold text-sm text-neutral-800">Name</h1>
                <p className="font-medium text-sm text-neutral-700">
                  {customer.name}
                </p>
              </div>
              <div>
                <h1 className="font-semibold text-sm text-neutral-800">
                  Email
                </h1>
                <p className="font-medium text-sm text-neutral-700">
                  {customer.email}
                </p>
              </div>
              <div>
                <h1 className="font-semibold text-sm text-neutral-800">
                  Phone Number
                </h1>
                <p className="font-medium text-sm text-neutral-700">
                  {customer.phoneNumber}
                </p>
              </div>
            </div>
            {customer.address ? (
              <div>
                <div>
                  <h1 className="font-semibold text-sm text-neutral-800">
                    Street
                  </h1>
                  <p className="font-medium text-sm text-neutral-700">
                    {customer.address.street}
                  </p>
                </div>
                <div>
                  <h1 className="font-semibold text-sm text-neutral-800">
                    City
                  </h1>
                  <p className="font-medium text-sm text-neutral-700">
                    {customer.address.city}
                  </p>
                </div>
                <div>
                  <h1 className="font-semibold text-sm text-neutral-800">
                    State
                  </h1>
                  <p className="font-medium text-sm text-neutral-700">
                    {customer.address.state}
                  </p>
                </div>
                <div>
                  <h1 className="font-semibold text-sm text-neutral-800">
                    Zip code
                  </h1>
                  <p className="font-medium text-sm text-neutral-700">
                    {customer.address.zipCode}
                  </p>
                </div>
                <div>
                  <h1 className="font-semibold text-sm text-neutral-800">
                    Country
                  </h1>
                  <p className="font-medium text-sm text-neutral-700">
                    {customer.address.country}
                  </p>
                </div>
              </div>
            ) : (
              <div className="w-full flex justify-center items-center">
                <Button
                  variant={"outline"}
                  onClick={() => setEditAddress((prev) => !prev)}
                >
                  Add Address
                </Button>
              </div>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
