import {
  InputLabel,
  MenuItem,
  Select,
  TextField,
  FormControl,
} from "@mui/material";
import DatePicker from "react-datepicker";
import { FiAlertCircle, FiCheckCircle, FiLock, FiMail } from "react-icons/fi";
import PhoneInput from "react-phone-input-2";

export default function ProfileInfoCard({
  formData,
  onChange,
  phoneNumber,
  setPhoneNumber,
  recoveryPhoneNumber,
  setRecoveryPhoneNumber,
  emailVerified,
  emailTwoVerified,
  phoneVerified,
  phoneTwoVerified,
  dobDate,
  setDobDate,
  updating,
  setPasswordOpen,
  setVerifyOpen,
}) {
  return (
    <div className="tw:bg-white tw:rounded-3xl tw:px-2 tw:md:px-6 tw:py-7 tw:border tw:border-gray-100 tw:shadow-sm tw:space-y-6">
      <span className="tw:text-sm tw:font-medium tw:text-gray-700">
        Edit Profile Info
      </span>

      {/* Names */}
      <div className="tw:grid tw:grid-cols-1 tw:md:grid-cols-2 tw:gap-4 tw:mt-4">
        <TextField
          label="First Name"
          name="firstName"
          value={formData.firstName}
          onChange={onChange}
          fullWidth
          size="medium"
          variant="outlined"
          sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px" } }}
        />
        <TextField
          label="Last Name"
          name="lastName"
          value={formData.lastName}
          onChange={onChange}
          fullWidth
          size="medium"
          variant="outlined"
          sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px" } }}
        />
      </div>

      {/* Email row */}
      <div className="tw:grid tw:grid-cols-1 tw:md:grid-cols-2 tw:gap-4">
        {/* Primary email */}
        <div>
          <TextField
            label="Email Address"
            name="email"
            value={formData.email}
            onChange={onChange}
            fullWidth
            size="medium"
            variant="outlined"
            disabled={emailVerified}
            InputProps={{
              startAdornment: <FiMail className="tw:mr-2 tw:text-gray-400" />,
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "12px",
                backgroundColor: emailVerified ? "#f3f4f6" : "white",
              },
            }}
          />
          <div className="tw:mt-1">
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

        {/* Recovery email – no status badge */}
        <div>
          <TextField
            label="Recovery Email"
            name="email_two"
            value={formData.email_two}
            onChange={onChange}
            fullWidth
            size="medium"
            variant="outlined"
            disabled={emailTwoVerified}
            InputProps={{
              startAdornment: <FiMail className="tw:mr-2 tw:text-gray-400" />,
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "12px",
                backgroundColor: emailTwoVerified ? "#f3f4f6" : "white",
              },
            }}
          />
        </div>
      </div>

      {/* Phones */}
      <div className="tw:grid tw:grid-cols-1 tw:md:grid-cols-2 tw:gap-4">
        {/* Primary phone – read-only + status */}
        <div>
          <label className="tw:block tw:text-xs tw:font-medium tw:text-gray-700 tw:mb-1">
            Phone Number
          </label>
          <div className="tw:w-full tw:rounded-2xl tw:bg-[#f3f4f6] tw:px-3 tw:py-2 tw:opacity-80">
            <PhoneInput
              value={phoneNumber}
              onChange={setPhoneNumber}
              country={"ng"}
              disabled
              inputStyle={{
                width: "100%",
                border: "none",
                background: "transparent",
                paddingLeft: 120
              }}
              buttonStyle={{ background: "transparent", border: "none" }}
            />
          </div>
          {/* <div className="tw:mt-1">
            {phoneVerified ? (
              <span className="tw:inline-flex tw:items-center tw:gap-1 tw:text-xs tw:font-medium tw:text-emerald-700 tw:bg-emerald-50 tw:px-2.5 tw:py-1 tw:rounded-full">
                <FiCheckCircle /> Verified
              </span>
            ) : (
              <span className="tw:inline-flex tw:items-center tw:gap-1 tw:text-xs tw:font-medium tw:text-amber-700 tw:bg-amber-50 tw:px-2.5 tw:py-1 tw:rounded-full">
                <FiAlertCircle /> Unverified
              </span>
            )}
          </div> */}
        </div>

        {/* Recovery phone – editable, no status */}
        <div>
          <label className="tw:block tw:text-xs tw:font-medium tw:text-gray-700 tw:mb-1">
            Recovery Phone
          </label>
          <div className="tw:w-full tw:rounded-2xl tw:bg-[#f3f4f6] tw:px-3 tw:py-2">
            <PhoneInput
              value={recoveryPhoneNumber}
              onChange={setRecoveryPhoneNumber}
              country={"ng"}
              inputStyle={{
                width: "100%",
                border: "none",
                background: "transparent",
              }}
              buttonStyle={{ background: "transparent", border: "none" }}
            />
          </div>
        </div>
      </div>

      {/* DOB + Gender */}
      <div className="tw:grid tw:grid-cols-1 tw:md:grid-cols-2 tw:gap-4">
        <div>
          <label className="tw:block tw:text-xs tw:font-medium tw:text-gray-700 tw:mb-1">
            Date of Birth
          </label>
          <div className="tw:w-full tw:h-11 tw:rounded-2xl tw:border tw:border-gray-200 tw:flex tw:items-center tw:px-3 focus-within:tw:border-primary focus-within:tw:ring-2 focus-within:tw:ring-primary/20">
            <DatePicker
              selected={dobDate}
              onChange={(d) => setDobDate(d)}
              dateFormat="MM/dd/yyyy"
              placeholderText="MM/DD/YYYY"
              showMonthDropdown
              showYearDropdown
              dropdownMode="select"
              maxDate={new Date()}
              className="tw:w-full tw:outline-none tw:text-sm"
            />
          </div>
        </div>

        <FormControl
          fullWidth
          size="medium"
          sx={{
            "& .MuiOutlinedInput-root": { borderRadius: "12px" },
          }}
        >
          <InputLabel id="gender-label">Gender</InputLabel>
          <Select
            labelId="gender-label"
            label="Gender"
            name="gender"
            value={formData.gender}
            onChange={onChange}
          >
            <MenuItem value="">
              <em>Prefer not to say</em>
            </MenuItem>
            <MenuItem value="male">Male</MenuItem>
            <MenuItem value="female">Female</MenuItem>
            <MenuItem value="other">Other</MenuItem>
          </Select>
        </FormControl>
      </div>

      {/* About me */}
      <TextField
        label="About Me"
        name="about"
        value={formData.about}
        onChange={onChange}
        fullWidth
        multiline
        minRows={3}
        variant="outlined"
        size="medium"
        placeholder="Tell organisers a bit about yourself..."
        sx={{
          "& .MuiOutlinedInput-root": { borderRadius: "12px" },
        }}
      />

      {/* Security rows */}
      <div className="tw:pt-4 tw:space-y-3">
        <button
          type="button"
          onClick={() => setPasswordOpen(true)}
          className="tw:flex tw:items-center tw:justify-between tw:w-full tw:rounded-2xl tw:border tw:border-gray-100 tw:hover:border-gray-200 tw:bg-gray-50 tw:hover:bg-gray-100 tw:px-4 tw:py-3 tw:transition"
        >
          <span className="tw:flex tw:items-center tw:gap-2 tw:text-gray-800">
            <FiLock className="tw:text-gray-500" />
            <span className="tw:font-medium tw:text-sm">Set Password</span>
          </span>
          <span className="tw:text-gray-400 tw:text-lg">›</span>
        </button>
      </div>
    </div>
  );
}
