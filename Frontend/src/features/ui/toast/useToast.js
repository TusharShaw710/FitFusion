import { useToast as useToastFromContext } from './ToastContext';

export const useToast = () => {
  return useToastFromContext();
};

export default useToast;
