import { toast } from "sonner";

export const showSuccess = (message: string) => {
  toast.success(message);
};

export const showError = (message: string) => {
  toast.error(message);
};

export const showLoading = (message: string): string | number => {
  return toast.loading(message);
};

export const dismissToast = (toastId: string | number) => {
  // sonner's toast.dismiss accepts whatever id showLoading returned.
  // Keep the helper permissive to avoid type mismatches.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (toast.dismiss as any)(toastId);
};
