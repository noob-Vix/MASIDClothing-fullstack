import { useState } from "react";
import { useAuthContext } from "../context/AuthContext";

export const useRegister = () => {
  const { dispatch } = useAuthContext();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const register = async (
    name: string,
    email: string,
    phoneNumber: string,
    password: string,
    role?: string
  ) => {
    setIsLoading(true);
    setError(null);

    const response = await fetch(
      `${import.meta.env.VITE_SERVER_URL}/auth/register`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, phoneNumber, password, role }),
      }
    );

    const json = await response.json();

    if (!response.ok) {
      if (response.status === 500) {
        setError("User with this email already exists.");
      }
      if (response.status === 400) {
        setError("Please fill all the fields correctly.");
      }
      // setError(json.error);
      setIsLoading(false);
    }
    if (response.ok) {
      localStorage.setItem("user", JSON.stringify(json.user));
      dispatch({ type: "LOGIN", payload: json.user });
      setIsLoading(false);
      setError(null);
    }
  };
  return { register, error, isLoading };
};
