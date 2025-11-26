import {
  DialogContent,
  DialogFooter,
  DialogClose,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { category } from "@/types/data";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { z } from "zod";
import { Image, X } from "lucide-react";
import { useAuthContext } from "@/context/AuthContext";
import { toast } from "sonner";
import Loading from "./loading";
import { Textarea } from "@/components/ui/textarea";

const formSchema = z.object({
  name: z.string().min(2),
  description: z.string(),
  price: z.number().min(1),
  categoryId: z.string(),
  image: z
    .instanceof(File)
    .refine((file) => file.size <= 10_000_000, {
      message: "Image must be less than 10MB.",
    })
    .refine(
      (file) => ["image/jpeg", "image/png", "image/webp"].includes(file.type),
      { message: "Only JPEG, PNG, or WebP images are allowed." }
    ),
});

export default function AddProduct() {
  const [categories, setCategories] = useState<category[] | []>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [image, setImage] = useState<File | null>(null);
  const { user } = useAuthContext();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      price: 1,
      categoryId: "",
      image: undefined,
    },
  });

  useEffect(() => {
    async function getProductCategoty() {
      setIsLoading(true);
      
      const response = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/category/get-all`,
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
        return toast.error(json.message);
      }

      setIsLoading(false);
      setCategories(json.categoryList);
    }

    getProductCategoty();
  }, []);

  async function handleAddProduct(
    name: string,
    description: string,
    price: number,
    categoryId: string,
    image: File
  ) {
    setIsLoading(true);

    const parseCategoryId = parseInt(categoryId);

    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    formData.append("price", price.toString());
    formData.append("categoryId", parseCategoryId.toString());
    formData.append("image", image);

    // console.log(formData)

    try {
      const response = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/product/create`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
          body: formData,
        }
      );

      const json = await response.json();

      if (!response.ok) {
        setIsLoading(false);
        return toast.error(json.message);
      }

      handleReset();
      setImage(null);
      setIsLoading(false);
      toast.success(json.message);
    } catch (err: any) {
      console.log(err.message);
    }
  }

  function onSubmit(values: z.infer<typeof formSchema>) {
    if (!image) {
      return toast.warning("Product image is required");
    }

    handleAddProduct(
      values.name,
      values.description,
      values.price,
      values.categoryId,
      values.image
    );
  }

  function handleReset() {
    form.reset();
    setImage(null);
  }

  return (
    <DialogContent className="min-w-[50%] max-sm:h-full max-sm:min-w-full max-sm:rounded-none p-0 overflow-hidden">
      {isLoading && <Loading />}
      <div className="flex w-full">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-row gap-2 w-full max-sm:flex-col"
          >
            <div className="relative w-1/2 max-sm:w-full h-full bg-neutral-400 flex justify-center items-center">
              {image && <img src={URL.createObjectURL(image)} />}
              <FormField
                control={form.control}
                name="image"
                render={({ field: { value, onChange, ...fieldProps } }) => (
                  <FormItem>
                    {image && (
                      <Button
                        className="absolute top-2 left-1"
                        onClick={() => setImage(null)}
                        variant={"ghost"}
                      >
                        <X color="#FFFFFF" size={25} />
                      </Button>
                    )}
                    {!image && (
                      <FormLabel className="text-neutral-800 font-semibold flex flex-col cursor-pointer">
                        <Image color="#1E1E1E" size={25} />
                        Select Image
                      </FormLabel>
                    )}
                    <FormControl>
                      <Input
                        {...fieldProps}
                        hidden
                        type="file"
                        className="w-full"
                        onChange={(event) => {
                          onChange(event.target.files && event.target.files[0]);
                          setImage(event.target.files && event.target.files[0]);
                        }}
                        accept="image/*"
                        required
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="p-4 w-1/2 max-sm:w-full h-full flex flex-col justify-between gap-4">
              <div className="flex flex-col space-y-2">
                <DialogHeader className="mb-4">
                  <DialogTitle className="font-semibold text-neutral-800">
                    Add New Product
                  </DialogTitle>
                </DialogHeader>
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-semibold text-neutral-800">
                        Name
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Name"
                          {...field}
                          className="border-neutral-800"
                          required
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-semibold text-neutral-800">
                        Description
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Description"
                          {...field}
                          className="border-neutral-800 w-full min-h-16"
                          required
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex flex-row gap-2 w-full">
                  <FormField
                    control={form.control}
                    name="price"
                    render={({ field }) => (
                      <FormItem className="w-1/2">
                        <FormLabel className="font-semibold text-gray-900">
                          Price
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Price"
                            {...field}
                            className="border-gray-900 w-full"
                            type="number"
                            min={1}
                            onChange={(event) =>
                              field.onChange(+event.target.value)
                            }
                            required
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="categoryId"
                    render={({ field }) => (
                      <FormItem className="w-1/2">
                        <FormLabel className="font-semibold text-gray-900">
                          Category
                        </FormLabel>
                        <Select
                          {...field}
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          value={field.value}
                          required
                        >
                          <FormControl>
                            <SelectTrigger className="border-gray-900 min-w-full text-neutral-700 font-medium capitalize">
                              <SelectValue placeholder="Category" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {categories &&
                              categories.map((c) => (
                                <SelectItem
                                  key={c.id}
                                  value={c.id.toString()}
                                  className="capitalize"
                                >
                                  {c.name}
                                </SelectItem>
                              ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              <DialogFooter className="flex-row justify-end">
                <DialogClose asChild>
                  <Button
                    variant="outline"
                    className="w-24"
                    onClick={handleReset}
                  >
                    Cancel
                  </Button>
                </DialogClose>
                <Button type="submit" className="w-24">
                  Add
                </Button>
              </DialogFooter>
            </div>
          </form>
        </Form>
      </div>
    </DialogContent>
  );
}
