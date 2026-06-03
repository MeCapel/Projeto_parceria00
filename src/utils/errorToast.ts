import { toast } from "react-toastify";

export const showErrorToast = (err: unknown) => {
// eslint-disable-next-line @typescript-eslint/no-explicit-any
  const data = (err as any)?.response?.data;
  
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const message = data?.message || data?.error || (err as any)?.message || "Erro ao realizar operação";
  toast.error(message, { autoClose: 5000 });
};