import { useEffect, useState } from "react";
import { useAuthContext } from "@/context/AuthContext";
import { toast } from "sonner";
import type { user } from "@/types/data";
import UsersList from "./usersList";
import { SidebarTrigger } from "@/components/ui/sidebar";
import LoadingComponent from "@/components/loadingComponent";

export default function Users() {
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuthContext();
  const [users, setUsers] = useState<user[] | []>([]);

  useEffect(() => {
    async function getUsers() {
      setIsLoading(true);

      const response = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/user/get-all`,
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
      setUsers(json.userList);
    }

    getUsers();
  }, [user.token]);

  return (
    <div className="h-screen flex flex-col m-4 gap-4">
      <header className="flex shrink-0 items-center gap-2">
        <SidebarTrigger className="-ml-1" />
        <h1 className="text-neutral-800 font-semibold text-lg">Users</h1>
      </header>
      {!isLoading ? <UsersList users={users} /> : <LoadingComponent />}
    </div>
  );
}
