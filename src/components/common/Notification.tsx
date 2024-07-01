import React from 'react';
import { ToastOptions, toast } from 'react-hot-toast';

interface Props {
  options?: ToastOptions;
}

const Toast: React.FC<Props> = ({ options }) => {
  const showToast = (message: string) => {
    toast(message, options);
  };

  return null; // Toast component itself doesn't render anything
};

export default Toast;

// Exporting a function to trigger the toast from anywhere
export const showToast = (message: string, options?: ToastOptions) => {
  toast(message, options);
};
