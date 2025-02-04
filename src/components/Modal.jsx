import React from 'react';

const Modal = ({ onClose, children }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30">
      <div className="bg-[#0D1421] p-6 rounded shadow-lg w-1/3 text-start text-white relative">
        <button
          className="absolute top-0 right-0 mt-4 mr-4 text-gray-500 hover:text-gray-700"
          onClick={onClose}
        >
          &times;
        </button>
        <div className="max-h-full overflow-y-auto scrollbar-hide snap-y snap-mandatory">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
