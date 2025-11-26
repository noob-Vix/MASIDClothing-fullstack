import { Loader2 } from "lucide-react";

export default function LoadingComponent() {
    return (
        <div className="flex h-full w-full justify-center items-center">
            <Loader2 size={30} className="animate-spin"/>
        </div>
    )
}