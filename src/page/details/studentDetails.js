import React, { useEffect, useState } from "react";
import { Info } from "lucide-react";
import "./studentDetail.css";
import { useNavigate } from "react-router-dom";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../../firebase/firebase.config";
import { useAuth } from "../../context/AuthContext";

export default function StudentDetailsForm() {
  const { currentUser, profile, refreshProfile } = useAuth();
  const [formData, setFormData] = useState({
    currentClass: "",
    goal: "",
    mobile: "",
    state: "",
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const classOptions = ["Class 9", "Class 10", "Class 11", "Class 12", "Droppers"];
  const goalOptions = ["JEE", "NEET", "Boards"];

  const stateOptions = [
    "Andhra Pradesh","Karnataka","Kerala","Tamil Nadu","Telangana","Maharashtra",
    "Gujarat","Rajasthan","Delhi","Uttar Pradesh","Bihar","West Bengal",
    "Madhya Pradesh","Punjab","Haryana","Jharkhand","Odisha","Chhattisgarh",
    "Uttarakhand","Himachal Pradesh","Assam","Goa","Other",
  ];

  useEffect(() => {
    if (!profile) return;
    setFormData((prev) => ({
      currentClass: profile.currentClass || prev.currentClass,
      goal: profile.goal || profile.examType || prev.goal,
      mobile: profile.mobile || profile.contactNumber || prev.mobile,
      state: profile.state || prev.state,
    }));
  }, [profile]);

  const handleSubmit = async () => {
    setError("");
    if (!formData.currentClass || !formData.goal) {
      setError("Class and goal (JEE / NEET / Boards) are required.");
      return;
    }
    if (formData.mobile && (formData.mobile.length !== 10 || !/^\d+$/.test(formData.mobile))) {
      setError("Enter a valid 10-digit mobile number, or leave it blank.");
      return;
    }
    if (!currentUser?.uid) {
      setError("Please sign in again.");
      return;
    }

    setSaving(true);
    try {
      await setDoc(
        doc(db, "users", currentUser.uid),
        {
          currentClass: formData.currentClass,
          goal: formData.goal,
          examType: formData.goal,
          mobile: formData.mobile || "",
          contactNumber: formData.mobile || "",
          state: formData.state || "",
          email: currentUser.email || "",
          name: currentUser.displayName || profile?.name || "",
          role: profile?.role || "student",
          updatedAt: new Date(),
        },
        { merge: true }
      );
      await refreshProfile();
      navigate("/", { replace: true });
    } catch (err) {
      console.error(err);
      setError("Could not save details. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="sd-container">
      <div className="sd-wrapper">
        <h1 className="sd-title">Fill your Details</h1>
        <p className="sd-subtitle">Class and goal are required so we can show the right content.</p>

        <div className="sd-grid">
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

          <div>
            <label className="sd-label">
              Goal (JEE / NEET / Boards) <Info size={16} className="sd-info" />
            </label>

            <div className="sd-goal-buttons">
              {goalOptions.map((g) => (
                <button
                  key={g}
                  type="button"
                  onClick={() => setFormData({ ...formData, goal: g })}
                  className={`sd-goal-btn ${formData.goal === g ? "active" : ""}`}
                >
                  {g}
                </button>
              ))}
            </div>
          </div>

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

        {error ? <p className="sd-error">{error}</p> : null}

        <div className="sd-actions">
          <button
            type="button"
            className="sd-btn-submit"
            onClick={handleSubmit}
            disabled={saving}
          >
            {saving ? "Saving…" : "Continue"}
          </button>
        </div>
      </div>
    </div>
  );
}
