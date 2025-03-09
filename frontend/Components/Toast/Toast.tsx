"use client"; // This makes it a client component

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ToastProvider = () => {
  return <ToastContainer position="top-right" autoClose={3000} />;
};

export default ToastProvider;
