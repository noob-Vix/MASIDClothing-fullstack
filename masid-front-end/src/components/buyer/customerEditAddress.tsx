import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "../ui/input";
import { useState } from "react";
import { useAuthContext } from "@/context/AuthContext";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { Loader2Icon } from "lucide-react";
import type { address } from "@/types/data";

const formSchema = z.object({
  street: z.string(),
  city: z.string(),
  state: z.string(),
  zipCode: z.string(),
  country: z.string(),
});

type CustomerEditAddressProps = {
    setState: React.Dispatch<React.SetStateAction<boolean>>
    address: address
}

export default function CustomerEditAddress({ setState, address }: CustomerEditAddressProps) {
  const { user } = useAuthContext();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      street: address ? address.street : "",
      city: address ? address.city : "",
      state: address ? address.state : "",
      zipCode: address ? address.zipCode : "",
      country: address ? address.country : "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);

    const response = await fetch(
      `${import.meta.env.VITE_SERVER_URL}/address/save`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({
          street: values.street,
          city: values.city,
          state: values.state,
          zipCode: values.zipCode,
          country: values.country,
        }),
      }
    );

    const json = await response.json();

    if (!response.ok) {
      setIsLoading(false);
      return toast.warning(json.message);
    }

    form.reset();
    toast.success(json.message);
    setIsLoading(false);
    setState(PREV => !PREV)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 w-[25rem] max-sm:w-fit">
        <FormField
          control={form.control}
          name="street"
          render={({ field }) => (
            <FormItem className="flex gap-3">
              <FormLabel className="font-semibold text-gray-900 w-24">
                Street
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="Street"
                  {...field}
                  className="border-gray-900"
                  required
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="city"
          render={({ field }) => (
            <FormItem className="flex gap-3">
              <FormLabel className="font-semibold text-gray-900 w-24">
                City
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="City"
                  {...field}
                  className="border-gray-900"
                  required
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="state"
          render={({ field }) => (
            <FormItem className="flex gap-3">
              <FormLabel className="font-semibold text-gray-900 w-24">
                State
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="State"
                  {...field}
                  className="border-gray-900"
                  required
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="zipCode"
          render={({ field }) => (
            <FormItem className="flex gap-3">
              <FormLabel className="font-semibold text-gray-900 w-24">
                Zip Code
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="Zip Code"
                  {...field}
                  className="border-gray-900"
                  required
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="country"
          render={({ field }) => (
            <FormItem className="flex gap-3">
              <FormLabel className="font-semibold text-gray-900 w-24">
                Country
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="Country"
                  {...field}
                  className="border-gray-900"
                  required
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex gap-3 justify-end mt-auto">
            <Button className="font-semibold text-neutral-800 w-24" variant={"outline"} onClick={() => setState(PREV => !PREV)}>Cancel</Button>
            <Button className="w-24" type="submit" disabled={isLoading}>{isLoading ? <Loader2Icon /> : "Save"}</Button>
        </div>
      </form>
    </Form>
  );
}
