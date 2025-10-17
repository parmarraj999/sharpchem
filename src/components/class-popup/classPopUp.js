import React from "react";
import "./classPopUp.css";

const PopupModal = ({ isOpen, title, options, onSelect, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="popup-overlay" onClick={onClose}>
      <div className="popup-box" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>×</button>
        <h2 className="popup-title">{title}</h2>
        <div className="popup-options">
          {options.map((opt, index) => (
            <button
              key={index}
              className="popup-option-btn"
              onClick={() => onSelect(opt.value)}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PopupModal;
