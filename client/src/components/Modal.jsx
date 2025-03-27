import React from "react";
import { motion } from "framer-motion";

const Modal = ({ isOpen, onClose, title, message }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -50 }}
        className="bg-[#1c1c24] text-white p-6 rounded-lg shadow-lg w-[90%] max-w-md"
      >
        <h2 className="text-xl font-semibold mb-2">{title}</h2>
        <p className="text-[#b2b3bd]">{message}</p>
        <button
          onClick={onClose}
          className="mt-4 w-full bg-red-500 py-2 rounded-lg hover:bg-red-600 transition duration-300"
        >
          Close
        </button>
      </motion.div>
    </div>
  );
};
export default Modal;
