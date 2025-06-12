
import "./Accountstyle.css";
import { useState } from "react";
import $ from "jquery";
import { useAuth } from "../../../../pages/auth/AuthContext";
import { showToast } from "../../../ToastAlert";
// import { FaEye, FaEyeSlash } from "react-icons/fa"; 
const EyeIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M10 12.5C11.3807 12.5 12.5 11.3807 12.5 10C12.5 8.61929 11.3807 7.5 10 7.5C8.61929 7.5 7.5 8.61929 7.5 10C7.5 11.3807 8.61929 12.5 10 12.5Z" fill="#666" />
    <path d="M0 10C0 10 4 3 10 3C16 3 20 10 20 10C20 10 16 17 10 17C4 17 0 10 0 10ZM10 14.5C11.933 14.5 13.5 12.933 13.5 11C13.5 9.067 11.933 7.5 10 7.5C8.067 7.5 6.5 9.067 6.5 11C6.5 12.933 8.067 14.5 10 14.5Z" fill="#666" />
  </svg>
);

const EyeSlashIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M2.5 3.75L16.25 17.5" stroke="#666" strokeWidth="2" strokeLinecap="round" />
    <path d="M8.5565 7.2945C8.2135 7.5195 7.9095 7.8005 7.6535 8.1255C7.0805 8.8525 6.75 9.7635 6.75 10.75C6.75 12.6835 8.317 14.25 10.25 14.25C11.237 14.25 12.148 13.9195 12.875 13.3465C13.2005 13.0905 13.4815 12.7865 13.7065 12.4435" stroke="#666" strokeWidth="2" strokeLinecap="round" />
    <path d="M5.2815 5.2815C3.7375 6.4095 2.5535 7.9635 1.75 9.75C1.75 9.75 4.75 16.25 10.25 16.25C11.8165 16.25 13.2645 15.8425 14.5315 15.1565" stroke="#666" strokeWidth="2" strokeLinecap="round" />
    <path d="M12.25 6.25C13.5915 6.793 14.7355 7.7355 15.5625 8.9375C16.75 10.75 16.75 10.75 16.75 10.75C16.75 10.75 14.875 5.875 10.25 5.875C9.7795 5.875 9.322 5.917 8.875 5.995" stroke="#666" strokeWidth="2" strokeLinecap="round" />
  </svg>
);
export const ChangeEmailTemplate = ({ onClose }) => {
  return (
    <>
      <div className=" changeEmailTemplateFormSection">
        <div>
          {" "}
          {/* <h2>Email address</h2> */}
          <p>
            We'll send a verification email to the email address you provide to
            confirm that it's really you.{" "}
          </p>
        </div>
        <form className="emailform">
          <div>
            <label
              style={{ fontSize: "15px" }}
              className="label"
              htmlFor="password"
            >
              Password
            </label>
            <input
              placeholder="Password"
              className="form-control"
              type="password"
              id="password"
              required
            />
          </div>
          <div>
            <label
              style={{ fontSize: "15px" }}
              className="label"
              htmlFor="email"
            >
              Email address
            </label>
            <input
              placeholder="New email"
              className="form-control"
              type="email"
              id="email"
              required
            />
          </div>
          <div className="button  ">
            <button className=" btn submit_btn">Save</button>
            <button onClick={onClose} className="btn cancel_btn ml-1">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </>
  );
};
export const ChangePasswordTemplate = ({ onClose }) => {
  const { user, logout } = useAuth();

  const [formData, setFormData] = useState({
    current_password: "",
    new_password: "",
    confirm_password: "",
    logout_status: false
  });

  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false
  });
  const togglePasswordVisibility = (field) => {
    setShowPassword(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };
  const [errors, setErrors] = useState({
    current_password: "",
    new_password: "",
    confirm_password: ""
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", message: "" });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));

    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = { current_password: "", new_password: "", confirm_password: "" };
    let isValid = true;

    // Password validation regex
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;

    // Current password validation
    if (!formData.current_password) {
      newErrors.current_password = "Current password is required.";
      isValid = false;
    }

    // New password validation
    if (!formData.new_password) {
      newErrors.new_password = "New password is required.";
      isValid = false;
    } else if (!passwordRegex.test(formData.new_password)) {
      newErrors.new_password = "Password must be at least 6 characters, include one uppercase letter, one number, and one special character.";
      isValid = false;
    }

    // Confirm password validation
    if (!formData.confirm_password) {
      newErrors.confirm_password = "Please confirm your new password.";
      isValid = false;
    } else if (formData.new_password !== formData.confirm_password) {
      newErrors.confirm_password = "Passwords do not match.";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      setMessage({ type: "", message: "" });

      const data = new FormData();
      data.append("current_password", formData.current_password);
      data.append("new_password", formData.new_password);
      // data.append("logout_all_devices", formData.logout_status ? "1" : "0");
      data.append("user_id", user.user_id);

      $.ajax({
        url: import.meta.env.VITE_API_URL + "auth/change_user_password",
        type: "POST",
        data: data,
        processData: false,
        contentType: false,
        timeout: 3000000,
        success: function (response) {
          setLoading(false);
          const responseData = JSON.parse(response);

          if (responseData.status === "OK") {
            showToast.info(responseData.api_message);
            onClose(); // Close the modal on success
            if (formData.logout_status == '1') {
              logout();
            }
          } else {
            setMessage({
              type: "danger",
              message: responseData.api_message || "Password change failed."
            });
          }
        },
        error: function (xhr, status, error) {
          setLoading(false);
          setMessage({
            type: "danger",
            message: xhr.responseJSON?.api_message ||
              "An error occurred while changing password. Please try again."
          });
        }
      });
    } catch (error) {
      console.error(error);
      setLoading(false);
      setMessage({
        type: "danger",
        message: "An unexpected error occurred. Please try again."
      });
    }
  };

  return (
    <div className="changePasswordtemplateFormSection">
      <form className="emailform" onSubmit={handleSubmit}>
        {/* ... (keep existing message display) */}

        <div className="form-group">
          <label style={{ fontSize: "20px" }} className="label" htmlFor="current_password">
            Current Password
          </label>
          <div className="password-input-container">
            <input
              placeholder="Current password"
              className={`form-control ${errors.current_password ? "is-invalid" : ""}`}
              type={showPassword.current ? "text" : "password"}
              id="current_password"
              name="current_password"
              value={formData.current_password}
              onChange={handleChange}

              disabled={loading}
            />
            <span
              className="password-toggle-icon"
              onClick={() => togglePasswordVisibility('current')}
            >
              {showPassword.current ? <EyeSlashIcon /> : <EyeIcon />}
            </span>
          </div>
          {errors.current_password && (
            <div className="invalid-feedback">{errors.current_password}</div>
          )}
        </div>

        <div className="form-group">
          <label style={{ fontSize: "20px" }} className="label" htmlFor="new_password">
            New Password
          </label>
          <div className="password-input-container">
            <input
              placeholder="New password"
              className={`form-control ${errors.new_password ? "is-invalid" : ""}`}
              type={showPassword.new ? "text" : "password"}
              id="new_password"
              name="new_password"
              value={formData.new_password}
              onChange={handleChange}

              disabled={loading}
            />
            <span
              className="password-toggle-icon"
              onClick={() => togglePasswordVisibility('new')}
            >
              {showPassword.new ? <EyeSlashIcon /> : <EyeIcon />}
            </span>
          </div>
          {errors.new_password && (
            <div className="invalid-feedback">{errors.new_password}</div>
          )}
        </div>

        <div className="form-group">
          <label style={{ fontSize: "20px" }} className="label" htmlFor="confirm_password">
            Confirm Password
          </label>
          <div className="password-input-container">
            <input
              placeholder="Confirm password"
              className={`form-control ${errors.confirm_password ? "is-invalid" : ""}`}
              type={showPassword.confirm ? "text" : "password"}
              id="confirm_password"
              name="confirm_password"
              value={formData.confirm_password}
              onChange={handleChange}

              disabled={loading}
            />
            <span
              className="password-toggle-icon"
              onClick={() => togglePasswordVisibility('confirm')}
            >
              {showPassword.confirm ? <EyeSlashIcon /> : <EyeIcon />}
            </span>
          </div>
          {errors.confirm_password && (
            <div className="invalid-feedback">{errors.confirm_password}</div>
          )}
        </div>


        <div className="checkbox">
          <label htmlFor="logout_status" style={{ fontSize: "15px" }}>
            <input
              type="checkbox"
              id="logout_status"
              name="logout_status"
              checked={formData.logout_status}
              onChange={handleChange}
              disabled={loading}
            />
            <i className="check-box"></i>Changing your password logs you out of
            all browsers on your device
          </label>
        </div>

        <hr />

        <div className="button">
          <button
            type="submit"
            className="btn submit_btn"
            disabled={loading}
          >
            {loading ? "Processing..." : "Save"}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="btn cancel_btn ml-1"
            disabled={loading}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>

  );
};
export const DeleteAccounttemplate = ({ onClose }) => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const { user } = useAuth();
  const handleSubmit = (e) => {
    e.preventDefault();
    if (user.username == e.target.username.value) {


      try {
        setLoading(true);
        setMessage({ type: "", text: "" });

        const formData = new FormData();
        formData.append("user_id", user.user_id);
        formData.append("reason", e.target.reason_for_leaving.value);
        formData.append("username", e.target.username.value);
        formData.append("password", e.target.password.value);
        formData.append("leave_status", "pending");
        formData.append("confirm_deletion", e.target.logout_staus.checked ? "1" : "0");

        $.ajax({
          url: import.meta.env.VITE_API_URL + "auth/delete_account",
          type: "POST",
          data: formData,
          processData: false,
          contentType: false,
          timeout: 30000,
          success: function (response) {
            const responseData = typeof response === 'string' ? JSON.parse(response) : response;
            // console.log(response);
            if (responseData.status === "OK") {
              setMessage({
                type: "success",
                text: "Account deletion request submitted successfully."
              });
              // Clear user data and redirect after delay
              // setTimeout(() => {
              //   localStorage.clear();
              //   window.location.href = "/";
              // }, 2000);
            } else {
              setMessage({
                type: "danger",
                text: responseData.api_message || "Failed to process deletion request."
              });
            }
            setLoading(false);
          },
          error: function (xhr, status, error) {
            setMessage({
              type: "danger",
              text: xhr.responseJSON?.api_message ||
                "An error occurred while processing your request. Please try again."
            });
            setLoading(false);
          }
        });
      } catch (error) {
        console.error(error);
        setMessage({
          type: "danger",
          text: "An unexpected error occurred. Please try again."
        });
        setLoading(false);
      }
    } else {
        setMessage({
          type: "danger",
          text: "Invalid Credentials"
        });
    }

  };

  return (
    <div className="delete-account-container">
      {message.text && (
        <div className={`alert alert-${message.type}`}>
          {message.text}
        </div>
      )}

      <div className="delete-header">
        <h5>We're sorry to see you go.</h5>
        <p className="delete-warning">
          Once you delete your account, your profile, username, comments,
          posts and messages are permanently removed from POKI village and
          it's communities.
        </p>
      </div>

      <form className="emailform" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="reason_for_leaving" className="form-label">
            Reason for leaving (optional)
          </label>
          <textarea
            className="form-control"
            id="reason_for_leaving"
            name="reason_for_leaving"
            disabled={loading}
          />
        </div>

        <div className="form-group">
          <label htmlFor="username" className="form-label">
            Username
          </label>
          <input
            className="form-control"
            type="text"
            id="username"
            name="username"
            required
            disabled={loading}
          />
        </div>

        <div className="form-group">
          <label htmlFor="password" className="form-label">
            Password
          </label>
          <input
            className="form-control"
            type="password"
            id="password"
            name="password"
            required
            disabled={loading}
          />
        </div>
        <div className="checkbox">
          <label htmlFor="logout_staus" style={{ fontSize: "15px" }}>
            <input
              type="checkbox"
              id="logout_staus"
              name="logout_staus"
              disabled={loading}
            />
            <i className="check-box"></i> I understand that deleted accounts aren't recoverable
          </label>
        </div>

        <hr />

        <div className="form-actions">
          <button
            type="submit"
            className="btn btn-danger submit-btn"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                Processing...
              </>
            ) : "Delete Account"}
          </button>

          <button
            type="button"
            onClick={onClose}
            className="btn btn-secondary cancel-btn"
            disabled={loading}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

