import type { product } from "@/types/data";

type ProductCardProps = {
  data: product;
  onClick: () => void;
};

export default function ProductCard({ data, onClick }: ProductCardProps) {
  return (
    <div onClick={onClick} className="h-56 w-40 border-1 border-neutral-200 rounded-[10px] overflow-hidden flex flex-col justify-between cursor-pointer hover:border-neutral-400">
      <img
        className="object-cover w-full h-36"
        src={
          typeof data.imageUrl === "string"
            ? data.imageUrl
            : URL.createObjectURL(data.imageUrl)
        }
        alt="product image"
      />
      <div className="p-2 bg-white h-16">
        <h1 className="font-semibold text-neutral-700 truncate">{data.name}</h1>
        <p className="font-semibold text-neutral-800">P {data.price}</p>
      </div>
    </div>
  );
}
