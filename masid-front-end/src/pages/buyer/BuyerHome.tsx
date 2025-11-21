import Header from "@/components/buyer/header";
import Main from "@/components/buyer/main";
import { ProductProvider } from "@/context/ProductContext";
import { Route, Routes } from "react-router";
import SearchProduct from "@/components/buyer/searchProduct";
import { Toaster } from "@/components/ui/sonner"
import ProductInfo from "@/components/buyer/productInfo";

export default function BuyerHome() {
  return (
    <ProductProvider>
      <Toaster />
      <Routes>
        <Route
          index
          path=""
          element={
            <div className="flex flex-col h-screen">
              <Header />
              <Main />
            </div>
          }
        />
        <Route path="/search" element={<SearchProduct />} />
        <Route path="/product-info" element={<ProductInfo />} />
      </Routes>
    </ProductProvider>
  );
}
