import { Skeleton } from "./ui/skeleton";

export default function ProductSkeleton() {
  return (
    <div className="flex flex-row rounded-[10px] overflow-hidden gap-1 border border-gray-300 h-32 animate-pulse bg-neutral-100">
      <Skeleton className="h-full w-32 bg-neutral-300" />
      <div className="p-2 text-sm flex flex-col gap-2 w-full">
        <div>
          <Skeleton className="h-4 w-24 bg-neutral-300 rounded mb-1" />
          <Skeleton className="h-3 w-16 bg-neutral-200 rounded" />
        </div>
        <div>
          <Skeleton className="h-4 w-24 bg-neutral-300 rounded mb-1" />
          <Skeleton className="h-3 w-32 bg-neutral-200 rounded" />
        </div>
      </div>
    </div>
  );
}