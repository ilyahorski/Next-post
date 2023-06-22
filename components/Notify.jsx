import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

export const notifyInfo = () =>
  toast.info("Please sign in.", {
    position: toast.POSITION.TOP_CENTER
  });

export const notifyError = ({ message }) =>
  toast.error(message, {
    position: toast.POSITION.TOP_CENTER
  });

export const notifyLoading = () =>
  toast.loading("Please wait, content is loading.", {
    position: toast.POSITION.TOP_CENTER
  });

export const notifySuccess = () =>
  toast.success("Done! Your request has been processed successfully!", {
    position: toast.POSITION.TOP_CENTER
  });

export const notifyWarning = () =>
  toast.warning("Attention! This may take some time.", {
    position: toast.POSITION.TOP_CENTER
  });