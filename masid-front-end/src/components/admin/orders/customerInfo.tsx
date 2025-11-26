import {
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { user } from "@/types/data";

type CustomerInfoProps = {
  customer: user;
};

export default function CustomerInfo({ customer }: CustomerInfoProps) {
  return (
    <DialogContent className="flex flex-col items-center max-sm:justify-start justify-center max-sm:h-screen max-sm:min-w-screen max-sm:rounded-none">
      <DialogHeader className="w-full ">
        <DialogTitle className="text-neutral-800">Buyer Information</DialogTitle>
      </DialogHeader>
      <div className="flex gap-10 max-sm:flex-col max-sm:w-full">
        <div>
          <div>
            <h1 className="font-semibold text-sm text-neutral-800">Name</h1>
            <p className="font-medium text-sm text-neutral-700">
              {customer.name}
            </p>
          </div>
          <div>
            <h1 className="font-semibold text-sm text-neutral-800">Email</h1>
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
        {customer.address && <div>
          <div>
            <h1 className="font-semibold text-sm text-neutral-800">Street</h1>
            <p className="font-medium text-sm text-neutral-700">
              {customer.address.street}
            </p>
          </div>
          <div>
            <h1 className="font-semibold text-sm text-neutral-800">City</h1>
            <p className="font-medium text-sm text-neutral-700">
              {customer.address.city}
            </p>
          </div>
          <div>
            <h1 className="font-semibold text-sm text-neutral-800">State</h1>
            <p className="font-medium text-sm text-neutral-700">
              {customer.address.state}
            </p>
          </div>
          <div>
            <h1 className="font-semibold text-sm text-neutral-800">Zip code</h1>
            <p className="font-medium text-sm text-neutral-700">
              {customer.address.zipCode}
            </p>
          </div>
          <div>
            <h1 className="font-semibold text-sm text-neutral-800">Country</h1>
            <p className="font-medium text-sm text-neutral-700">
              {customer.address.country}
            </p>
          </div>
        </div>}
      </div>
    </DialogContent>
  );
}
