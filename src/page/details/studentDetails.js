import React, { useState } from "react";
import { Info } from "lucide-react";
import "./studentDetail.css";
import { useNavigate } from "react-router-dom";

export default function StudentDetailsForm() {
  const [formData, setFormData] = useState({
    currentClass: "",
    goal: "",
    mobile: "",
    state: "",
  });

  const navigate = useNavigate();

  const classOptions = ["Class 9", "Class 10", "Class 11", "Class 12", "Droppers"];

  const stateOptions = [
    "Andhra Pradesh","Karnataka","Kerala","Tamil Nadu","Telangana","Maharashtra",
    "Gujarat","Rajasthan","Delhi","Uttar Pradesh","Bihar","West Bengal",
    "Madhya Pradesh","Punjab","Haryana","Jharkhand","Odisha","Chhattisgarh",
    "Uttarakhand","Himachal Pradesh","Assam","Goa","Other",
  ];

  const handleSubmit = () => {
    if (!formData.currentClass || !formData.goal || !formData.mobile) {
      alert("Please fill all required fields");
      return;
    }
    if (formData.mobile.length !== 10 || !/^\d+$/.test(formData.mobile)) {
      alert("Please enter a valid 10-digit mobile number");
      return;
    }
    alert("Form submitted!");
  };

  const handleCancel = () => {
    setFormData({ currentClass: "", goal: "", mobile: "", state: "" });
  };

  return (
    <div className="sd-container">
      <div className="sd-wrapper">
        <h1 className="sd-title">Fill your Details</h1>
        <p className="sd-subtitle">Help us personalize your learning journey</p>

        <div className="sd-grid">
          
          {/* Current Class */}
          <div>
            <label className="sd-label">
              Current Class <Info size={16} className="sd-info" />
            </label>

            <select
              value={formData.currentClass}
              onChange={(e) =>
                setFormData({ ...formData, currentClass: e.target.value })
              }
              className="sd-select"
            >
              <option value="">Select your class</option>
              {classOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>

          {/* Goal */}
          <div>
            <label className="sd-label">
              Goal (JEE / NEET) <Info size={16} className="sd-info" />
            </label>

            <div className="sd-goal-buttons">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, goal: "JEE" })}
                className={`sd-goal-btn ${
                  formData.goal === "JEE" ? "active" : ""
                }`}
              >
                JEE
              </button>

              <button
                type="button"
                onClick={() => setFormData({ ...formData, goal: "NEET" })}
                className={`sd-goal-btn ${
                  formData.goal === "NEET" ? "active" : ""
                }`}
              >
                NEET
              </button>
            </div>

          </div>

          {/* Mobile Number */}
          <div>
            <label className="sd-label">
              Mobile Number <Info size={16} className="sd-info" />
            </label>

            <input
              type="tel"
              placeholder="Enter your mobile number"
              value={formData.mobile}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, "").slice(0, 10);
                setFormData({ ...formData, mobile: value });
              }}
              className="sd-input"
            />
          </div>

          {/* State */}
          <div>
            <label className="sd-label">
              State <Info size={16} className="sd-info" />
            </label>

            <select
              value={formData.state}
              onChange={(e) =>
                setFormData({ ...formData, state: e.target.value })
              }
              className="sd-select"
            >
              <option value="">Select your state (Optional)</option>
              {stateOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>

          </div>
        </div>

        {/* Buttons */}
        <div className="sd-actions">
          <button type="button" className="sd-btn-cancel" onClick={()=>navigate(-1)}>
            Back
          </button>

          <button type="button" onClick={handleSubmit} className="sd-btn-submit">
            Continue
          </button>
        </div>
      </div>
    </div>
  );
}
