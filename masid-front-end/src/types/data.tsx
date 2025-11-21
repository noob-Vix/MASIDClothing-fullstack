export type category = {
  id: string;
  name: string;
};

export type categoryList = {
  categoryList: category[];
};

export type product = {
  id: string;
  name: string;
  description: string;
  price: string;
  imageUrl: string | File;
  category: string;
};

export type userRole = "ADMIN" | "";

export type user = {
  id: number;
  name: string;
  email: string;
  phoneNumber: string;
  role: userRole;
  address: address;
};

export type orderStatus =
  | "PENDING"
  | "CONFIRMED"
  | "SHIPPED"
  | "DELIVERED"
  | "CANCELLED"
  | "RETURNED";

export type order = {
  id: number;
  quantity: number;
  price: number;
  status: orderStatus;
  user: user;
  product: product;
  createdAt: string;
};

export type address = {
  id: number;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
};
