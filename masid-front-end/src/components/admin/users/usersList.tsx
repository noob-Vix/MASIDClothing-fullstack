import type { user } from "@/types/data";

type UsersListProps = {
  users: user[];
};

export default function UsersList({ users }: UsersListProps) {
  return (
    <div className="border-1 border-neutral-300 rounded-2xl h-full overflow-hidden">
      <table className="w-full">
        <thead>
          <tr className="text-neutral-800 bg-neutral-200">
            <th className="font-semibold p-3">User ID</th>
            <th className="font-semibold p-3">Name</th>
            <th className="font-semibold p-3">Email</th>
            <th className="font-semibold p-3">Phone Number</th>
            <th className="font-semibold p-3">Role</th>
          </tr>
        </thead>
        <tbody className="text-center">
          {users.map((user) => (
            <tr key={user.id} className="w-full font-semibold text-neutral-800 border-b-1">
              <td className="py-2">{user.id}</td>
              <td className="py-2">{user.name}</td>
              <td className="py-2">{user.email}</td>
              <td className="py-2">{user.phoneNumber}</td>
              <td className="py-2">{user.role}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
