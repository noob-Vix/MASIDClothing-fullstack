import type { category, order, orderStatus, product } from "@/types/data";
import { createContext, useContext, useReducer, type ReactNode } from "react";

export interface ProductState {
  product: product[] | [];
  categories: category[] | [];
  orders: order[] | [];
}

type ProductAction =
  | { type: "SET_PRODUCT"; payload: product[] }
  | { type: "ADD_PRODUCT"; payload: product }
  | {
      type: "UPDATE_PRODUCT";
      payload: { productId: string; updatedData: product };
    }
  | { type: "DELETE_PRODUCT"; payload: string }
  | { type: "SEARCH_PRODUCT"; payload: product[] }
  | { type: "SET_CATEGORIES"; payload: category[] }
  | {
      type: "UPDATE_CATEGORY";
      payload: { categoryId: string; updatedData: category };
    }
  | { type: "DELETE_CATEGORY"; payload: string }
  | { type: "SET_ORDERS"; payload: order[] }
  | { type: "UPDATE_ORDER_STATUS"; payload: { orderId: number, newStatus: orderStatus } }

type ProductContextType = {
  product: product[] | [];
  categories: category[] | [];
  orders: order[] | [];
  dispatch: React.Dispatch<ProductAction>;
};

const ProductContext = createContext<ProductContextType | undefined>(undefined);

const productReducer = (
  state: ProductState,
  action: ProductAction
): ProductState => {
  switch (action.type) {
    case "SET_PRODUCT":
      return {
        ...state,
        product: action.payload,
      };
    case "ADD_PRODUCT":
      return {
        ...state,
        product: [...state.product, action.payload],
      };
    case "UPDATE_PRODUCT":
      return {
        ...state,
        product: state.product.map((p) =>
          p.id === action.payload.productId
            ? (p = action.payload.updatedData)
            : p
        ),
      };
    case "DELETE_PRODUCT":
      return {
        ...state,
        product: state.product.filter((p) => p.id !== action.payload),
      };
    case "SEARCH_PRODUCT":
      return {
        ...state,
        product: action.payload,
      };
    case "SET_CATEGORIES":
      return {
        ...state,
        categories: action.payload,
      };
    case "UPDATE_CATEGORY":
      return {
        ...state,
        categories: state.categories.map((c) =>
          c.id === action.payload.categoryId
            ? (c = action.payload.updatedData)
            : c
        ),
      };
    case "DELETE_CATEGORY":
      return {
        ...state,
        categories: state.categories.filter((c) => c.id !== action.payload),
      };
      case "SET_ORDERS":
        return {
          ...state,
          orders: action.payload
        }
        case "UPDATE_ORDER_STATUS":
          return {
            ...state,
            orders: state.orders.map(o =>
              o.id === action.payload.orderId
                ? { ...o, status: action.payload.newStatus }
                : o
            )
          }
    default:
      return state;
  }
};

export const ProductProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(productReducer, {
    product: [],
    categories: [],
    orders: []
  });

  return (
    <ProductContext.Provider value={{ ...state, dispatch }}>
      {children}
    </ProductContext.Provider>
  );
};

export const useProductContext = (): ProductContextType => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error(
      "useProductContext must be used within a ProductContextProvider"
    );
  }
  return context;
};
