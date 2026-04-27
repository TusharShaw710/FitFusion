import { useDispatch } from 'react-redux';
import { showToastAction } from './toast.slice';

export const useToast = () => {
  const dispatch = useDispatch();

  const showToast = (toast) => {
    dispatch(showToastAction(toast));
  };

  return { showToast };
};

export default useToast;
