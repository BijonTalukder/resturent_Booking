import React from "react";

const SaveAndCloseButton = ({ title, isLoading, closeModal }) => {
  return (
    <div className="flex items-center gap-x-3 justify-end mt-4">
      {closeModal && (
        <button
          disabled={isLoading}
          onClick={() => closeModal()}
          type="button"
          className="neu-btn w-full lg:w-[200px] h-[45px] text-[#6b7588] text-sm font-medium"
        >
          Close
        </button>
      )}
      <button
        disabled={isLoading}
        type="submit"
        className={`${
          title === "Login"
            ? "lg:w-[88px] h-[35px]"
            : "w-full lg:w-[200px] h-[45px]"
        } neu-btn-primary text-sm font-medium disabled:opacity-60`}
      >
        {isLoading ? "Processing..." : title}
      </button>
    </div>
  );
};

export default SaveAndCloseButton;
