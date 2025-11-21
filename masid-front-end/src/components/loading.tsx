import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center w-full h-full absolute z-10 bg-neutral-950 opacity-70">
      <Loader2 className="animate-spin text-neutral-400" size={40} />
      <span className="ml-3 text-neutral-400 font-semibold">Loading...</span>
    </div>
  );
}