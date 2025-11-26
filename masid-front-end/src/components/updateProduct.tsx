import {
  DialogFooter,
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
import type { product } from "@/types/data";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useState } from "react";
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
import { Pencil, X } from "lucide-react";
import { useAuthContext } from "@/context/AuthContext";
import { toast } from "sonner";
import Loading from "./loading";
import { Textarea } from "@/components/ui/textarea";
import { useProductContext } from "@/context/ProductContext";

const formSchema = z.object({
  name: z.string().min(2),
  description: z.string(),
  price: z.number().min(1).max(9999),
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

type UpdateProductProps = {
  product: product;
  cancel: React.Dispatch<React.SetStateAction<boolean>>;
  closeDialog: () => void;
};

export default function UpdateProduct({ product, cancel, closeDialog }: UpdateProductProps) {
  // const [categories, setCategories] = useState<category[] | []>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [newImage, setNewImage] = useState<File | null>(null);
  const { user } = useAuthContext();
  const { categories, dispatch } = useProductContext();

  const productImage = product.imageUrl;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: product.name,
      description: product.description,
      price: +product.price,
      categoryId: product.category,
      image: undefined,
    },
  });

  // useEffect(() => {
  //   async function getProductCategoty() {
  //     const response = await fetch(
  //       `${import.meta.env.VITE_SERVER_URL}/category/get-all`,
  //       {
  //         method: "GET",
  //         headers: {
  //           Authorization: `Bearer ${user.token}`,
  //         },
  //       }
  //     );

  //     const json = await response.json();

  //     if (!response.ok) {
  //       setIsLoading(false);
  //       return toast.error(json.message);
  //     }

  //     setIsLoading(false);
  //     setCategories(json.categoryList);
  //   }

  //   getProductCategoty();
  // }, []);

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
        `${import.meta.env.VITE_SERVER_URL}/product/update/${product.id}`,
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
        setIsLoading(false);
        return toast.error(json.message);
      }

      dispatch({
        type: "UPDATE_PRODUCT",
        payload: {
          productId: product.id,
          updatedData: {
            id: product.id,
            name,
            description,
            price: price.toString(),
            imageUrl: image,
            category: categoryId,
          },
        },
      });

      handleReset();
      setNewImage(null);
      setIsLoading(false);
      toast.success(json.message);
      closeDialog();
    } catch (err: any) {
      console.log(err.message);
    }
  }

  function onSubmit(values: z.infer<typeof formSchema>) {
    if (!newImage) {
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
    setNewImage(null);
    cancel((p) => !p);
  }

  return (
    <div className="min-w-[50%] p-0 overflow-hidden">
      {isLoading && <Loading />}
      <div className="flex w-full">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-row max-sm:flex-col gap-2 w-full"
          >
            <div className="relative w-1/2 max-sm:w-full h-full bg-neutral-900 flex justify-center items-center">
              {newImage ? (
                <img src={URL.createObjectURL(newImage)} />
              ) : (
                <img src={typeof productImage === "string" ? productImage : URL.createObjectURL(productImage)} />
              )}
              <FormField
                control={form.control}
                name="image"
                render={({ field: { value, onChange, ...fieldProps } }) => (
                  <FormItem>
                    {newImage ? (
                      <Button
                        className="text-neutral-900 font-semibold flex flex-col cursor-pointer bg-white rounded-4xl absolute top-2 left-1 p-2"
                        onClick={() => setNewImage(null)}
                      >
                        <X size={15} />
                      </Button>
                    ) : (
                      <FormLabel className="text-neutral-900 font-semibold flex flex-col cursor-pointer bg-white rounded-4xl absolute top-2 left-1 p-2">
                        <Pencil size={15} />
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
                          setNewImage(
                            event.target.files && event.target.files[0]
                          );
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
            <div className="p-4 w-1/2 max-sm:w-full max-sm:h-1/2 h-full flex flex-col justify-between gap-4">
              <div className="flex flex-col space-y-2">
                <DialogHeader className="mb-4">
                  <DialogTitle className="font-semibold text-neutral-800">
                    Update Product
                  </DialogTitle>
                </DialogHeader>
                <div>
                  <h1 className="font-semibold text-sm text-neutral-800">
                    Product ID
                  </h1>
                  <p className="font-medium text-sm text-neutral-700">
                    {product.id}
                  </p>
                </div>
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
                          defaultValue={product.category}
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
                <Button
                  variant="outline"
                  className="w-24"
                  onClick={handleReset}
                >
                  Cancel
                </Button>
                <Button type="submit" className="w-24">
                  Save
                </Button>
              </DialogFooter>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
