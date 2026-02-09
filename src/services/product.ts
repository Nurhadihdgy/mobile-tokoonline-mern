import API from "./api";
import { Product } from "../types/Product";
interface ProductsResponse {
  status: string;
  message: string;
  products: Product[];
}

/* =========================
   GET ALL PRODUCTS (AUTH)
========================= */
export const getProducts = async (): Promise<Product[]> => {
  const res = await API.get("/products");
  return res.data.products;
};

/* =========================
   GET PRODUCT BY ID (AUTH)
========================= */
export const getProductById = async (id: string) => {
  const res = await API.get(`/products/${id}`);
  return res.data.product;
};

/* =========================
   CREATE PRODUCT (ADMIN)
========================= */
export const createProduct = async (data: FormData) => {
  const res = await API.post("/products", data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data;
};

/* =========================
   UPDATE PRODUCT (ADMIN)
========================= */
export const updateProduct = async (id: string, data: FormData) => {
  const res = await API.put(`/products/${id}`, data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data;
};

/* =========================
   DELETE PRODUCT (ADMIN)
========================= */
export const deleteProduct = async (id: string) => {
  const res = await API.delete(`/products/${id}`);
  return res.data;
};
