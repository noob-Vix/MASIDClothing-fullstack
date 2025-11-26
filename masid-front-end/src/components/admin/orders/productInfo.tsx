import { DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import type { product } from "@/types/data"

type ProductInfoProps = {
    product: product;
}

export default function ProductInfo({ product }: ProductInfoProps) {
    return (
        <DialogContent className="min-w-[50%] p-0 overflow-hidden max-sm:overflow-scroll max-sm:h-screen max-sm:min-w-screen max-sm:rounded-none">
        <div className="flex w-full">
          <div className="flex flex-row gap-2 w-full max-sm:flex-col">
            <div className="relative w-1/2 h-full bg-neutral-900 flex justify-center items-center max-sm:w-full">
              <img src={typeof product.imageUrl === "string" ? product.imageUrl : URL.createObjectURL(product.imageUrl)} alt="Product Image" />
            </div>
            <div className="p-4 w-1/2 max-sm:w-full h-full flex flex-col justify-between gap-4">
              <div className="flex flex-col space-y-2">
                <DialogHeader className="mb-4">
                  <DialogTitle className="font-semibold text-neutral-800">
                    Product Details
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
                <div>
                  <h1 className="font-semibold text-sm text-neutral-800">
                    Name
                  </h1>
                  <p className="font-medium text-sm text-neutral-700">
                    {product.name}
                  </p>
                </div>
                <div>
                  <h1 className="font-semibold text-sm text-neutral-800">
                    Description
                  </h1>
                  <p className="font-medium text-md text-neutral-700">
                    {product.description}
                  </p>
                </div>
                <div>
                  <h1 className="font-semibold text-sm text-neutral-800">
                    Price
                  </h1>
                  <p className="font-medium text-sm text-neutral-700">
                    {product.price}
                  </p>
                </div>
                {/* <div>
                    <h1>Category</h1>
                    <p>{product.category}</p>
                </div> */}
              </div>
            </div>
          </div>
        </div>
    </DialogContent>
    )
}