import React, { useState, useEffect } from "react";
import "./editProfileStyling.css";
import { Link } from "react-router-dom";
import SideBarNav from "../../pageAssets/SideBarNav";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {
  FiMail,
  FiCheckCircle,
  FiAlertCircle,
  FiLock,
  FiPhone,
} from "react-icons/fi";
import axios from "axios";
import { useAuth } from "../../auth/AuthContext";
import default_profilePicture from "../../../assets/avater_pix.avif";
import SetPasswordModal from "../../../component/Profile/SetPasswordModal";
import { showSuccess, showError } from "../../../component/ui/toast";

function EditProfile() {
  const { user, login, token } = useAuth();
  console.log(user)

  const [phoneNumber, setPhoneNumber] = useState("");
  const [recoveryPhoneNumber, setRecoveryPhoneNumber] = useState("");
  const [emailVerified, setEmailVerified] = useState(false);
  const [emailTwoVerified, setEmailTwoVerified] = useState(false);
  const [phoneVerified, setPhoneVerified] = useState(false);
  const [phoneTwoVerified, setPhoneTwoVerified] = useState(false);

  const [uploading, setUploading] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [passwordOpen, setPasswordOpen] = useState(false);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    about: "",
    email: "",
    email_two: "",
    gender: "",
  });

  const [dobDate, setDobDate] = useState(null);

  const Default_user_image = user?.profileUrl
    ? user.profileUrl
    : default_profilePicture;
  const [profileImage, setProfileImage] = useState(Default_user_image);

  // Helpers
  const getCountryCode = (phone) =>
    phone ? phone.match(/^\+(\d{1,3})/)?.[0] : "";
  const getLocalNumber = (phone) =>
    phone ? phone.replace(/^\+\d{1,3}/, "") : "";

  const parseDOB = (dobStr) => {
    if (!dobStr) return null;
    // Accept "MM/DD/YYYY" or ISO
    const parts = dobStr.includes("/") ? dobStr.split("/") : null;
    if (parts && parts.length === 3) {
      const [mm, dd, yyyy] = parts.map((p) => parseInt(p, 10));
      return new Date(yyyy, mm - 1, dd);
    }
    const asDate = new Date(dobStr);
    return isNaN(asDate) ? null : asDate;
  };

  const formatDOB = (d) => {
    if (!d) return "";
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    const yyyy = d.getFullYear();
    return `${mm}/${dd}/${yyyy}`; // matches your sample "08/08/2005"
  };

  // Prefill from user
  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        about: user.about || "",
        email: user.email || "",
        email_two: user.email2 || "",
        gender: user.gender || "",
        phone_two: user.phoneNumber2 || "",
      });
      setPhoneNumber(user.phoneNumber || "");
      setRecoveryPhoneNumber(user.phoneNumber2 || "");
      setEmailVerified(!!user.email_verified);
      setEmailTwoVerified(!!user.email_two_verified);
      setPhoneVerified(!!user.phone_verified);
      setPhoneTwoVerified(!!user.phone_two_verified);
      setProfileImage(user.profileUrl || Default_user_image);
      setDobDate(parseDOB(user.dob));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePictureChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const form = new FormData();
    form.append("profile_url", file);

    try {
      setUploading(true);
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/v1/profile/image/edit`,
        form,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (res.status === 200) {
        showSuccess(res.data?.message || "Profile image updated!");
        login({ user: res.data.user, token });
        setProfileImage(res.data.user.profileUrl);
      }
    } catch (err) {
      console.error("Failed to upload profile picture:", err);
      showError(
        err?.response?.data?.message || "Failed to upload profile image."
      );
    } finally {
      setUploading(false);
    }
  };

  const handleUpdateProfile = async () => {
    // Basic validations
    if (!formData.firstName.trim()) return showError("First name is required");
    if (!formData.lastName.trim()) return showError("Last name is required");
    if (!formData.email.trim()) return showError("Email is required");
    if (!phoneNumber) return showError("Primary phone number is required");

    const countryCode = getCountryCode(phoneNumber);
    const localNumber = getLocalNumber(phoneNumber);

    const recCountryCode = getCountryCode(recoveryPhoneNumber);
    const recLocalNumber = getLocalNumber(recoveryPhoneNumber);

    try {
      setUpdating(true);
      const data = new FormData();
      data.append("first_name", formData.firstName);
      data.append("last_name", formData.lastName);
      data.append("about", formData.about || "");

      // Primary email / phone (existing)
      data.append("email", formData.email);
      data.append("phone", localNumber);
      data.append("country_code_one", countryCode);

      // Recovery email (append both common variants just in case)
      if (formData.email_two) {
        data.append("email_two", formData.email_two);
      }

      // Recovery phone (append common variants)
      if (recoveryPhoneNumber) {
        data.append("phone_two", recLocalNumber);
        if (recCountryCode) {
          data.append("country_code_two", recCountryCode);
        }
      }

      // DOB + Gender
      data.append("dob", formatDOB(dobDate) || "");
      data.append("gender", formData.gender || "");

      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/v1/profile/edit`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (res.status === 200) {
        showSuccess(res.data?.message || "Profile updated successfully!");
        login({ user: res.data.user, token });
      }
    } catch (err) {
      console.error("Failed to update profile:", err);
      showError(err?.response?.data?.message || "Failed to update profile.");
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="container-flui m-0 p-0">
      <SideBarNav />

      {/* Page wrapper */}
      <div className="page_wrapper">
        {/* Header */}
        <div className="tw:max-w-7xl tw:mx-auto tw:px-4 md:tw:px-6 lg:tw:px-8 tw:py-4">
          <h1 className="tw:text-[22px] tw:font-semibold tw:text-gray-800 tw:mb-3">
            Profile Settings
          </h1>
        </div>

        {/* Content */}
        <div className="tw:max-w-7xl tw:mx-auto tw:px-4 md:tw:px-6 lg:tw:px-8 tw:pb-24 tw:md:pb-16">
          <div className="row">
            {/* Left: Photo Card */}
            <div className="col-12 col-lg-3 tw:mb-4 lg:tw:mb-0">
              <div className="tw:bg-white tw:rounded-2xl tw:p-4 tw:border tw:border-gray-100 tw:shadow-sm lg:tw:sticky lg:tw:top-6">
                <div className="tw:md:aspect-3/4 tw:w-full tw:rounded-2xl tw:overflow-hidden tw:relative tw:mb-3">
                  <img
                    src={profileImage}
                    alt="Profile"
                    loading="lazy"
                    className="tw:w-full tw:h-full tw:object-cover"
                  />
                  {uploading && (
                    <div className="profile-loader-overlay">
                      <div className="profile-spinner" />
                    </div>
                  )}
                </div>

                <label
                  htmlFor="upload_pix"
                  className="tw:inline-flex tw:w-full tw:text-center tw:justify-center tw:items-center tw:gap-2 tw:rounded-xl tw:bg-gray-100 hover:tw:bg-gray-200 tw:transition tw:py-2.5 tw:text-sm tw:font-medium tw:text-gray-800 tw:cursor-pointer"
                >
                  Update photo
                  <input
                    id="upload_pix"
                    type="file"
                    accept="image/*"
                    className="tw:hidden"
                    onChange={handlePictureChange}
                  />
                </label>
              </div>
            </div>

            {/* Right: Form Card */}
            <div className="col-12 col-lg-9">
              <div className="tw:bg-white tw:rounded-2xl tw:p-4 md:tw:p-6 tw:border tw:border-gray-100 tw:shadow-sm">
                {/* Names */}
                <div className="row">
                  <div className="col-12 col-md-6 tw:mb-4">
                    <label className="tw:block tw:text-sm tw:font-medium tw:text-gray-700 tw:mb-1">
                      First Name
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      className="tw:w-full tw:h-11 tw:rounded-xl tw:border tw:border-gray-200 focus:tw:border-primary focus:tw:ring-2 focus:tw:ring-primary/20 tw:outline-none tw:px-3"
                      placeholder="First name"
                    />
                  </div>
                  <div className="col-12 col-md-6 tw:mb-4">
                    <label className="tw:block tw:text-sm tw:font-medium tw:text-gray-700 tw:mb-1">
                      Last Name
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      className="tw:w-full tw:h-11 tw:rounded-xl tw:border tw:border-gray-200 focus:tw:border-primary focus:tw:ring-2 focus:tw:ring-primary/20 tw:outline-none tw:px-3"
                      placeholder="Last name"
                    />
                  </div>
                </div>

                {/* About Me */}
                <div className="row">
                  <div className="col-12 tw:mb-4">
                    <label className="tw:block tw:text-sm tw:font-medium tw:text-gray-700 tw:mb-1">
                      About Me
                    </label>
                    <textarea
                      name="about"
                      value={formData.about}
                      onChange={handleChange}
                      rows={4}
                      placeholder="Write a description about you..."
                      className="tw:w-full tw:rounded-xl tw:border tw:border-gray-200 focus:tw:border-primary focus:tw:ring-2 focus:tw:ring-primary/20 tw:outline-none tw:px-3 tw:py-2"
                    />
                  </div>
                </div>

                {/* Email (Primary) */}
                <div className="row">
                  <div className="col-12 col-md-6 tw:mb-4">
                    <label className="tw:block tw:text-sm tw:font-medium tw:text-gray-700 tw:mb-1">
                      Email
                    </label>
                    <div className="tw:relative">
                      <FiMail className="tw:absolute tw:left-3 tw:top-[38%] -tw:translate-y-1/2 tw:text-gray-400" />
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        readOnly={emailVerified}
                        placeholder="Enter your email"
                        className={`tw:w-full tw:h-11 tw:rounded-xl tw:border tw:outline-none tw:px-9 ${
                          emailVerified
                            ? "tw:bg-gray-100 tw:text-gray-500 tw:border-gray-200"
                            : "tw:border-gray-200 focus:tw:border-primary focus:tw:ring-2 focus:tw:ring-primary/20"
                        }`}
                      />
                      <div className="tw:absolute tw:right-2 tw:top-[26%] -tw:translate-y-1/2">
                        {emailVerified ? (
                          <span className="tw:inline-flex tw:items-center tw:gap-1 tw:text-xs tw:font-medium tw:text-emerald-700 tw:bg-emerald-50 tw:px-2.5 tw:py-1 tw:rounded-full">
                            <FiCheckCircle /> Verified
                          </span>
                        ) : (
                          <span className="tw:inline-flex tw:items-center tw:gap-1 tw:text-xs tw:font-medium tw:text-amber-700 tw:bg-amber-50 tw:px-2.5 tw:py-1 tw:rounded-full">
                            <FiAlertCircle /> Unverified
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Recovery Email */}
                  <div className="col-12 col-md-6 tw:mb-4">
                    <label className="tw:block tw:text-sm tw:font-medium tw:text-gray-700 tw:mb-1">
                      Recovery Email
                    </label>
                    <div className="tw:relative">
                      <FiMail className="tw:absolute tw:left-3 tw:top-[38%] -tw:translate-y-1/2 tw:text-gray-400" />
                      <input
                        type="email"
                        name="email_two"
                        value={formData.email_two}
                        onChange={handleChange}
                        readOnly={emailTwoVerified}
                        placeholder="Add a backup email"
                        className={`tw:w-full tw:h-11 tw:rounded-xl tw:border tw:outline-none tw:px-9 ${
                          emailTwoVerified
                            ? "tw:bg-gray-100 tw:text-gray-500 tw:border-gray-200"
                            : "tw:border-gray-200 focus:tw:border-primary focus:tw:ring-2 focus:tw:ring-primary/20"
                        }`}
                      />
                      <div className="tw:absolute tw:right-2 tw:top-[26%] -tw:translate-y-1/2">
                        {emailTwoVerified ? (
                          <span className="tw:inline-flex tw:items-center tw:gap-1 tw:text-xs tw:font-medium tw:text-emerald-700 tw:bg-emerald-50 tw:px-2.5 tw:py-1 tw:rounded-full">
                            <FiCheckCircle /> Verified
                          </span>
                        ) : (
                          <span className="tw:inline-flex tw:items-center tw:gap-1 tw:text-xs tw:font-medium tw:text-amber-700 tw:bg-amber-50 tw:px-2.5 tw:py-1 tw:rounded-full">
                            <FiAlertCircle /> Unverified
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Phones */}
                <div className="row">
                  <div className="col-12 col-md-6 tw:mb-4">
                    <label className="tw:block tw:text-sm tw:font-medium tw:text-gray-700 tw:mb-1">
                      Phone Number
                    </label>
                    <div className="tw:w-full tw:rounded-xl tw:border tw:border-gray-200 focus-within:tw:border-primary focus-within:tw:ring-2 focus-within:tw:ring-primary/20 tw:px-2 tw:py-1.5">
                      <PhoneInput
                        international
                        defaultCountry="NG"
                        value={phoneNumber}
                        onChange={setPhoneNumber}
                        className="phone-input"
                      />
                    </div>
                    {phoneVerified ? (
                      <span className="tw:inline-flex tw:items-center tw:gap-1 tw:text-xs tw:font-medium tw:text-emerald-700 tw:bg-emerald-50 tw:px-2.5 tw:py-1 tw:rounded-full tw:mt-2">
                        <FiCheckCircle /> Verified
                      </span>
                    ) : (
                      <span className="tw:inline-flex tw:items-center tw:gap-1 tw:text-xs tw:font-medium tw:text-amber-700 tw:bg-amber-50 tw:px-2.5 tw:py-1 tw:rounded-full tw:mt-2">
                        <FiAlertCircle /> Unverified
                      </span>
                    )}
                  </div>

                  {/* Recovery Phone */}
                  <div className="col-12 col-md-6 tw:mb-4">
                    <label className="tw:block tw:text-sm tw:font-medium tw:text-gray-700 tw:mb-1">
                      Recovery Phone
                    </label>
                    <div className="tw:w-full tw:rounded-xl tw:border tw:border-gray-200 focus-within:tw:border-primary focus-within:tw:ring-2 focus-within:tw:ring-primary/20 tw:px-2 tw:py-1.5">
                      <PhoneInput
                        international
                        defaultCountry="NG"
                        value={recoveryPhoneNumber}
                        onChange={setRecoveryPhoneNumber}
                        className="phone-input"
                      />
                    </div>
                    {phoneTwoVerified ? (
                      <span className="tw:inline-flex tw:items-center tw:gap-1 tw:text-xs tw:font-medium tw:text-emerald-700 tw:bg-emerald-50 tw:px-2.5 tw:py-1 tw:rounded-full tw:mt-2">
                        <FiCheckCircle /> Verified
                      </span>
                    ) : (
                      <span className="tw:inline-flex tw:items-center tw:gap-1 tw:text-xs tw:font-medium tw:text-amber-700 tw:bg-amber-50 tw:px-2.5 tw:py-1 tw:rounded-full tw:mt-2">
                        <FiAlertCircle /> Unverified
                      </span>
                    )}
                  </div>
                </div>

                {/* DOB + Gender */}
                <div className="row">
                  <div className="col-12 col-md-6 tw:mb-4">
                    <label className="tw:block tw:text-sm tw:font-medium tw:text-gray-700 tw:mb-1">
                      Date of Birth
                    </label>
                    <div className="tw:w-full tw:h-11 tw:rounded-xl tw:border tw:border-gray-200 tw:flex tw:items-center tw:px-3 focus-within:tw:border-primary focus-within:tw:ring-2 focus-within:tw:ring-primary/20">
                      <DatePicker
                        selected={dobDate}
                        onChange={(d) => setDobDate(d)}
                        dateFormat="MM/dd/yyyy"
                        placeholderText="MM/DD/YYYY"
                        showMonthDropdown
                        showYearDropdown
                        dropdownMode="select"
                        maxDate={new Date()}
                        className="tw:w-full tw:outline-none"
                      />
                    </div>
                  </div>

                  <div className="col-12 col-md-6 tw:mb-4">
                    <label className="tw:block tw:text-sm tw:font-medium tw:text-gray-700 tw:mb-1">
                      Gender
                    </label>
                    <select
                      name="gender"
                      value={formData.gender}
                      onChange={handleChange}
                      className="tw:w-full tw:h-11 tw:rounded-xl tw:border tw:border-gray-200 focus:tw:border-primary focus:tw:ring-2 focus:tw:ring-primary/20 tw:outline-none tw:px-3"
                    >
                      <option value="">Select gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>

                {/* Actions */}
                <div className="tw:mt-2 tw:flex tw:items-center tw:justify-end">
                  <button
                    style={{
                      borderRadius: 20,
                    }}
                    onClick={handleUpdateProfile}
                    disabled={updating}
                    className="tw:inline-flex tw:items-center tw:justify-center tw:rounded-xl tw:bg-primary hover:tw:bg-primary/90 tw:text-white tw:font-medium tw:h-11 tw:px-5 tw:transition disabled:tw:opacity-60"
                  >
                    {updating ? "Updating..." : "Update"}
                  </button>
                </div>

                {/* Divider */}
                <div className="tw:h-px tw:bg-gray-100 tw:my-6" />

                {/* Password Row */}
                <button
                  onClick={() => setPasswordOpen(true)}
                  className="tw:flex tw:items-center tw:justify-between tw:w-full tw:rounded-xl tw:border tw:border-gray-100 hover:tw:border-gray-200 tw:bg-gray-50 hover:tw:bg-gray-100 tw:px-4 tw:py-3 tw:transition"
                >
                  <span className="tw:flex tw:items-center tw:gap-2 tw:text-gray-800">
                    <FiLock className="tw:text-gray-500" />
                    <span className="tw:font-medium">Set Password</span>
                  </span>
                  <span className="tw:text-gray-400 tw:text-lg">›</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* tiny inline loader CSS kept, but most styles moved to file */}
      <style>{`
        .profile-loader-overlay {
          position: absolute; inset: 0;
          display: flex; align-items: center; justify-content: center;
          background: rgba(255,255,255,0.35);
        }
        .profile-spinner {
          width: 30px; height: 30px;
          border: 3px solid #e5e7eb; border-top-color: #8F07E7;
          border-radius: 50%; animation: spin 0.9s linear infinite;
        }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>

      <SetPasswordModal
        open={passwordOpen}
        onClose={() => setPasswordOpen(false)}
      />
    </div>
  );
}

export default EditProfile;
