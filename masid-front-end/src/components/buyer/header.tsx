import logo from "@/assets/images/logo-black.png";
import { Button } from "../ui/button";
import { Link } from "react-router";
import CustomerDialog from "./customerDialog";
import CustomerAddToCart from "./customerAddToCart";

export default function Header() {
  return (
    <header className="m-4 flex items-center justify-between">
      <div className="flex gap-10 items-center w-full">
        <img
          className="aspect-square w-12 max-sm:hidden"
          src={logo}
          alt="logo"
        />
        <Link to={"/buyer/search"}>
          <Button
            className="w-96 max-sm:w-64 text-neutral-400 hover:text-neutral-500"
            variant={"outline"}
          >
            Search products
          </Button>
        </Link>
      </div>
      <div className="flex gap-4 justify-center items-center">
        <CustomerAddToCart />
        <CustomerDialog />
      </div>
    </header>
  );
}
