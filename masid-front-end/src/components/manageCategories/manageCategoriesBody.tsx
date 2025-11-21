import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { useAuthContext } from "@/context/AuthContext";
import { useProductContext } from "@/context/ProductContext";
import { useState } from "react";
import { toast } from "sonner";
import type { category } from "@/types/data";
import UpdateCategory from "./updateCategory";
import AddCategory from "./addCategory";
import DeleteCategory from "./deleteCategory";

export default function ManageCategoriesBody() {
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuthContext();
  const { categories } = useProductContext();
  const [active, setActive] = useState<category>({ id: "", name: "" });
  const [localResult, setLocalResult] = useState<category[] | []>([]);

  async function handleSearch(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);

    const response = await fetch(
      `${import.meta.env.VITE_SERVER_URL}/category/get-category-by-id/${input}`,
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
      return toast.warning(json.message);
    }
    setIsLoading(false);
    setLocalResult([json.category]);
  }

  async function getProductCategory() {
    setIsLoading(true);

    const response = await fetch(
      `${import.meta.env.VITE_SERVER_URL}/category/get-all`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      }
    );

    const json = await response.json();

    if (!response.ok) {
      setIsLoading(false);
      return toast.warning(json.message);
    }

    setIsLoading(false);
    setLocalResult(json.categoryList);
  }

  function handleActive(category: category) {
    if (active?.id === category.id) {
      return setActive({ id: "", name: "" });
    }
    setActive(category);
  }

  return (
    <DialogContent className="max-h-11/12 flex flex-col gap-6">
      <DialogHeader>
        <DialogTitle className="text-neutral-800">Manage Categories</DialogTitle>
        <DialogDescription hidden></DialogDescription>
        <div className="flex flex-row gap-2 mt-4">
          <Button variant={"outline"} onClick={getProductCategory}>
            All
          </Button>
          <AddCategory />
          <UpdateCategory categoryId={active.id} setState={setActive} />
          <DeleteCategory categoryId={active.id} setState={setActive} />
        </div>
      </DialogHeader>
      <form onSubmit={handleSearch}>
        <Input
          type="search"
          placeholder="Search category by ID"
          className="border-1 border-neutral-800 text-center"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          accept="number"
        />
      </form>
      <div className="h-full">
        {localResult.length === 0
          ? categories.map((c) => (
              <div
                className={
                  active?.id === c.id
                    ? "bg-neutral-200 w-full flex flex-row text-neutral-800 font-semibold text-1xl rounded-sm"
                    : "bg-transparent w-full flex flex-row hover:bg-neutral-200 font-medium"
                }
                onClick={() => handleActive(c)}
              >
                <div className="flex justify-center items-center w-full">
                  <h1>{c.id}</h1>
                </div>
                <div className="flex justify-center items-center w-full">
                  <p>{c.name}</p>
                </div>
              </div>
            ))
          : localResult.map((c) => (
              <div
                className={
                  active?.id === c.id
                    ? "bg-neutral-200 w-full flex flex-row text-neutral-800 font-semibold text-1xl rounded-sm"
                    : "bg-transparent w-full flex flex-row hover:bg-neutral-100 text-neutral-800 font-medium text-1xl rounded-sm"
                }
                onClick={() => handleActive(c)}
              >
                <div className="flex justify-center items-center w-full">
                  <h1>{c.id}</h1>
                </div>
                <div className="flex justify-center items-center w-full">
                  <p>{c.name}</p>
                </div>
              </div>
            ))}
      </div>
    </DialogContent>
  );
}
