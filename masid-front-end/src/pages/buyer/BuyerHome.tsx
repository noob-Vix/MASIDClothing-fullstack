import Header from "@/components/buyer/header";
import Main from "@/components/buyer/main";

import { Toaster } from "@/components/ui/sonner";

export default function BuyerHome() {
  return (
    <>
      <Toaster />
      <div className="flex flex-col h-screen">
        <Header />
        <Main />
      </div>
    </>
  );
}
