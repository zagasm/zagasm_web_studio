// import "./style.css";

import { useState, useEffect } from "preact/hooks";
import upload_icon from "../../../../../src/assets/icons/uploadicon.webp";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import "./style.css";
import $ from "jquery";
import { useAuth } from "../../../../pages/auth/AuthContext";
import { showToast } from "../../../ToastAlert";
import LoadingOverlay from "../../../assets/projectOverlay.jsx";
import HTMLFormatter from "../../../assets/HtmlTagFormatter";
export const ChangeWorkAndEducationTemplate = ({ onClose }) => {
  // State for managing work and education entries
  const [workEntries, setWorkEntries] = useState([]);
  const [educationEntries, setEducationEntries] = useState([]);
  const [openWork, setOpenWork] = useState(false);
  const [openEducation, setOpenEducation] = useState(false);
  // State for the current form inputs
  const [currentWork, setCurrentWork] = useState({
    company: "",
    position: "",
    workCity: "",
    workDescription: "",
    workStartDate: "",
    workEndDate: "",
  });
  const [currentEducation, setCurrentEducation] = useState({
    school: "",
    degree: "",
    fieldOfStudy: "",
    educationStartDate: "",
    educationEndDate: "",
  });
  // Handle input changes for work and education
  const handleWorkChange = (e) => {
    const { name, value } = e.target;
    setCurrentWork({ ...currentWork, [name]: value });
  };
  const handleEducationChange = (e) => {
    const { name, value } = e.target;
    setCurrentEducation({ ...currentEducation, [name]: value });
  };
  // Add a new work entry
  const addWorkEntry = () => {
    if (currentWork.company && currentWork.position && currentWork.workStartDate) {
      setWorkEntries([...workEntries, currentWork]);
      setCurrentWork({
        company: "",
        position: "",
        workCity: "",
        workDescription: "",
        workStartDate: "",
        workEndDate: "",
      });
    } else {
      alert("Please fill in all required fields for Work.");
    }
  };
  // Add a new education entry
  const addEducationEntry = () => {
    if (
      currentEducation.school &&
      currentEducation.degree &&
      currentEducation.educationStartDate
    ) {
      setEducationEntries([...educationEntries, currentEducation]);
      setCurrentEducation({
        school: "",
        degree: "",
        fieldOfStudy: "",
        educationStartDate: "",
        educationEndDate: "",
      });
    } else {
      alert("Please fill in all required fields for Education.");
    }
  };
  // Remove a work entry
  const removeWorkEntry = (index) => {
    const updatedWorkEntries = workEntries.filter((_, i) => i !== index);
    setWorkEntries(updatedWorkEntries);
  };
  // Remove an education entry
  const removeEducationEntry = (index) => {
    const updatedEducationEntries = educationEntries.filter((_, i) => i !== index);
    setEducationEntries(updatedEducationEntries);
  };
  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = {
      work: workEntries,
      education: educationEntries,
    };
    console.log("Form Data Submitted:", formData);
    // Add your API call here to save the data to the database
    alert("Data submitted successfully!");
  };

  return (
    <div className=" pr-4 pl-4">
      <form onSubmit={handleSubmit}>
        {/* Work Section */}
        <div className="form-section">
          <h3>Work</h3>
          {workEntries.map((entry, index) => (
            <div key={index} className="entry">
              <div className="entry-details">
                <p>
                  <strong>{entry.position}</strong> at {entry.company} (
                  {entry.workStartDate} - {entry.workEndDate || "Present"})
                </p>
                <p>{entry.workDescription}</p>
              </div>
              <button
                type="button"
                className="btn remove-bt"
                onClick={() => removeWorkEntry(index)}
              >
                &times;
              </button>
            </div>
          ))}
          {openWork == false ? <span className="more-btn" onClick={() => setOpenWork(true)}><i className="fa fa-plus " ></i>Add a workplace</span> : null}
          {/*  */}
          {openWork ? <div className="work_section">
            <div className="form-group">
              <input
                type="text"
                name="company"
                placeholder="Company"
                value={currentWork.company}
                onChange={handleWorkChange}

              />
            </div>
            <div className="form-group">
              <input
                type="text"
                name="position"
                placeholder="Position"
                value={currentWork.position}
                onChange={handleWorkChange}

              />
            </div>
            <div className="form-group">
              <input
                type="text"
                name="workCity"
                placeholder="City/Town"
                value={currentWork.workCity}
                onChange={handleWorkChange}
              />
            </div>
            <div className="form-group">
              <textarea
                name="workDescription"
                placeholder="Description"
                value={currentWork.workDescription}
                onChange={handleWorkChange}
                rows="3"
              />
            </div>
            <div className="row">
              <div className="form-group col-xxl-5 col-lg-5 col-md-5 col-sm-5 col-5">
                <label>Start Date</label>
                <input
                  type="date"
                  name="workStartDate"
                  value={currentWork.workStartDate}
                  onChange={handleWorkChange}

                />
              </div>
              <div className="col-xxl-2 col-lg-2 col-md-2 col-sm-2 col-2" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>To</div>
              <div className="form-group col-xxl-5 col-lg-5 col-md-5 col-sm-5 col-5">
                <label>End Date</label>
                <input
                  type="date"
                  name="workEndDate"
                  value={currentWork.workEndDate}
                  onChange={handleWorkChange}
                />
              </div>
            </div>
            <div className="btn-grou container w-100" style={{ width: '100%', overflow: 'hidden' }}>
              <button
                style={{ background: "#FA6342", border: 'none' }}
                type="button"
                className=" btn text-light"
                onClick={addWorkEntry}
              >
                Add Work workplace Entry
              </button>
              <button
                type="button"
                className=" btn btn-secondary mr-2"
                onClick={() => setOpenWork(false)}
              >
                Cancle
              </button>
            </div>
          </div> : null}

        </div>

        {/* Education Section */}
        <div className="form-section">
          <h3>Education</h3>
          {educationEntries.map((entry, index) => (
            <div key={index} className="entry">
              <div className="entry-details">
                <p>
                  <strong>{entry.degree}</strong> at {entry.school} (
                  {entry.educationStartDate} - {entry.educationEndDate || "Present"})
                </p>
                <p>{entry.fieldOfStudy}</p>
              </div>
              <button
                type="button"
                className="btn remove-btn"
                onClick={() => removeEducationEntry(index)}
              >
                &times;
              </button>
            </div>
          ))}
          {openEducation == false ? <span className="more-btn" onClick={() => setOpenEducation(true)}><i className="fa fa-plus "></i>Add a Education</span> : null}
          {openEducation ? <div>
            <div className="form-group">
              <input
                type="text"
                name="school"
                placeholder="School/University"
                value={currentEducation.school}
                onChange={handleEducationChange}

              />
            </div>
            <div className="form-group">
              <input
                type="text"
                name="degree"
                placeholder="Degree"
                value={currentEducation.degree}
                onChange={handleEducationChange}

              />
            </div>
            <div className="form-group">
              <input
                type="text"
                name="fieldOfStudy"
                placeholder="Field of Study"
                value={currentEducation.fieldOfStudy}
                onChange={handleEducationChange}
              />
            </div>
            <div className="form-group">
              <label>Start Date</label>
              <input
                type="date"
                name="educationStartDate"
                value={currentEducation.educationStartDate}
                onChange={handleEducationChange}

              />
            </div>
            <div className="form-group">
              <label>End Date</label>
              <input
                type="date"
                name="educationEndDate"
                value={currentEducation.educationEndDate}
                onChange={handleEducationChange}
              />
            </div>
            <div className="btn-grou" style={{ width: '100%', overflow: 'hidden' }}>
              <button
                type="button"
                style={{ background: "#FA6342", border: 'none' }}
                className="btn text-light"
                onClick={addEducationEntry}
              >
                Add Education Entry
              </button>
              <button
                type="button"
                className="btn btn-secondary mr-2"
                onClick={() => setOpenEducation(false)}
              >
                Cancle
              </button>
            </div>
          </div> : null}

        </div>

        {/* Buttons */}
        <div className="form-buttons" >

          <button type="button" className="btn cancel-btn" onClick={onClose}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export const ChangePlacesLivedTemplate = ({ onClose }) => {
  // State for managing places lived entries
  const [placesLivedEntries, setPlacesLivedEntries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);
  const [message, setMessage] = useState({ type: "", message: "" });
  const { user } = useAuth();
  // State for the current form inputs
  const [currentPlace, setCurrentPlace] = useState({
    city: "",
    description: "",
    startDate: "",
    endDate: "",
    isCurrent: false,
  });

  // State for validation errors
  const [errors, setErrors] = useState({
    city: "",
    description: "",
    startDate: "",
  });

  // State for editing an existing entry
  const [editIndex, setEditIndex] = useState(null);

  // Fetch places lived data when component mounts
  useEffect(() => {
    setMessage("");
    const fetchPlacesLived = async () => {
      try {
        setLoading(true);
        const data = new FormData();
        data.append("user_id", user.user_id);

        $.ajax({
          url: import.meta.env.VITE_API_URL + "profile/get_user_places",
          type: "POST",
          data: data,
          processData: false,
          contentType: false,
          timeout: 3000000,
          success: function (response) {
            setLoading(false);
            setInitialLoad(false);
            const responseData = JSON.parse(response);

            if (responseData.status === "OK") {
              // Transform API data to match our local format if needed
              const formattedPlaces = responseData.places.map(place => ({
                id: place.place_live_id,
                city: place.city_town,
                description: place.description,
                startDate: place.start_date,
                endDate: place.end_date,
                isCurrent: place.isCurrent
              }));
              setPlacesLivedEntries(formattedPlaces);
            } else {
              setMessage("");
            }
          },
          error: function (xhr, status, error) {
            setLoading(false);
            setInitialLoad(false);
            setMessage({
              type: "danger",
              message: "fetching",
            });
          }
        });
      } catch (error) {
        console.log(error);
        setLoading(false);
        setInitialLoad(false);
        setMessage({
          type: "danger",
          message: "An error occurred while loading data.",
        });
      }
    };

    fetchPlacesLived();
  }, [user.user_id]);

  // Handle input changes for places lived
  const handlePlaceChange = (e) => {
    const { name, value, type, checked } = e.target;

    // Special handling for "Till Date" checkbox
    if (name === "isCurrent" && checked) {
      setCurrentPlace(prev => ({
        ...prev,
        isCurrent: true,
        endDate: "" // Clear end date when "Till Date" is checked
      }));
      return;
    }

    // Special handling for end date input
    if (name === "endDate" && value) {
      setCurrentPlace(prev => ({
        ...prev,
        endDate: value,
        isCurrent: false // Uncheck "Till Date" when end date is selected
      }));
      return;
    }

    // Normal input handling
    setCurrentPlace(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    // Clear the error message when the user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  // Validate the form fields
  const validateForm = () => {
    const newErrors = { city: "", description: "", startDate: "", endDate: "" };
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set to beginning of day for accurate comparison

    // Validate City/Town
    if (!currentPlace.city) {
      newErrors.city = "City/Town is required.";
    } else if (currentPlace.city.length > 20) {
      newErrors.city = "City/Town cannot exceed 20 characters.";
    }

    // Validate Description
    if (currentPlace.description.length > 100) {
      newErrors.description = "Description cannot exceed 100 characters.";
    }

    // Validate Start Date
    if (!currentPlace.startDate) {
      newErrors.startDate = "Start Date is required.";
    } 

    // Validate End Date (only if "Till Date" is not checked)
    if (!currentPlace.isCurrent) {
      if (!currentPlace.endDate) {
        newErrors.endDate = "Please select either an end date or 'Till Date'.";
      } else if (currentPlace.startDate) {
        const startDate = new Date(currentPlace.startDate);
        const endDate = new Date(currentPlace.endDate);
        if (endDate < startDate) {
          newErrors.endDate = "End date cannot be before start date.";
        }
      }
    }

    setErrors(newErrors);
    return Object.values(newErrors).every((error) => !error);
  };

  // Add or update a place lived entry with AJAX
  const addOrUpdatePlaceEntry = () => {
    if (validateForm()) {
      try {
        setLoading(true);
        const data = new FormData();
        // Prepare the data for the request
        data.append("city_town", currentPlace.city);
        data.append("description", currentPlace.description);
        data.append("start_date", currentPlace.startDate);
        data.append("end_date", currentPlace.isCurrent ? "" : currentPlace.endDate);
        data.append("isCurrent", currentPlace.isCurrent);
        data.append("user_id", user.user_id);

        if (editIndex !== null && placesLivedEntries[editIndex]?.id) {
          data.append("place_live_id", placesLivedEntries[editIndex].id);
        }

        const url = editIndex !== null
          ? import.meta.env.VITE_API_URL + "profile/update_place"
          : import.meta.env.VITE_API_URL + "profile/add_place";

        $.ajax({
          url: url,
          type: "POST",
          data: data,
          processData: false,
          contentType: false,
          timeout: 3000000,
          success: function (response) {
            setLoading(false);
            const responseData = JSON.parse(response);
            console.log(responseData.places);
            if (responseData.status === "OK") {
              showToast.info(responseData.api_message);


              if (editIndex !== null) {
                // Update existing entry in state
                const updatedEntries = [...placesLivedEntries];
                updatedEntries[editIndex] = {
                  ...currentPlace,
                  id: responseData.place_live_id || placesLivedEntries[editIndex].id
                };
                setPlacesLivedEntries(updatedEntries);
              } else {
                // Add new entry to state
                setPlacesLivedEntries([...placesLivedEntries, {
                  ...currentPlace,
                  id: responseData.place_live_id
                }]);
              }
              // console.log(placesLivedEntries);
              // fetchPlacesLived();
              // Clear the form
              setCurrentPlace({
                city: "",
                description: "",
                startDate: "",
                endDate: "",
                isCurrent: false,
              });
              setEditIndex(null);
            } else {
              setMessage({
                type: "danger",
                message: responseData.api_message,
              });
            }
          },
          error: function (xhr, status, error) {
            setLoading(false);
            setMessage({
              type: "danger",
              message:
                xhr.responseJSON?.api_message ||
                "An unknown error occurred. Please try again later.",
            });
          }
        });
      } catch (error) {
        console.log(error);
        setLoading(false);
        setMessage({
          type: "danger",
          message: "An unknown error occurred. Please try again later.",
        });
      }
    }
  };

  // Remove a place lived entry with AJAX
  const removePlaceEntry = (index) => {
    try {
      const entryToDelete = placesLivedEntries[index];
  // console.log(entryToDelete.id);
      // If no ID (wasn't saved to server), just remove from local state
      if (!entryToDelete.id) {
        const updatedEntries = placesLivedEntries.filter((_, i) => i !== index);
        setPlacesLivedEntries(updatedEntries);
        showToast.info("Record deleted successfully");
        return;
      }

      setLoading(true);
      const data = new FormData();
      data.append("place_live_id", entryToDelete.id);
      data.append("user_id", user.user_id);
  // console.log(data);
      $.ajax({
        url: import.meta.env.VITE_API_URL + "profile/delete_place",
        type: "POST",
        data: data,
        processData: false,
        contentType: false,
        timeout: 3000000,
        success: function (response) {
          setLoading(false);
          const responseData = JSON.parse(response);
         
          if (responseData.status === "OK") {
            // Remove from local state
            showToast.info(responseData.api_message);

            const updatedEntries = placesLivedEntries.filter((_, i) => i !== index);
            setPlacesLivedEntries(updatedEntries);
          } else {
            setMessage({
              type: "danger",
              message: responseData.api_message,
            });
          }
        },
        error: function (xhr, status, error) {
          setLoading(false);
          setMessage({
            type: "danger",
            message:
              xhr.responseJSON?.api_message ||
              "An unknown error occurred while deleting. Please try again later.",
          });
        }
      });
    } catch (error) {
      console.log(error);
      setLoading(false);
      setMessage({
        type: "danger",
        message: "An unknown error occurred while deleting. Please try again later.",
      });
    }
  };

  // Edit a place lived entry (local state only)
  const editPlaceEntry = (index) => {
    const entryToEdit = placesLivedEntries[index];
    setCurrentPlace({
      city: entryToEdit.city,
      description: entryToEdit.description,
      startDate: entryToEdit.startDate,
      endDate: entryToEdit.endDate,
      isCurrent: entryToEdit.isCurrent,
    });
    setEditIndex(index);
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    onClose();
  };

  if (initialLoad) {
    return (
      <div className="loading-container">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="f">
      <form onSubmit={handleSubmit}>
        {/* Places Lived Section */}
        <div className="form-section">
          <h3>Places Lived</h3>

          {message.message && (
            <div className={`alert alert-${message.type}`}>{message.message}</div>
          )}

          {placesLivedEntries.length === 0 ? (
            // <p className="text-muted">No places added yet</p>
            null
          ) : (
            placesLivedEntries.map((entry, index) => (
              <div key={entry.id || index} className="entry">
                <div className="entry-details">
                  <p>
                    <strong>{entry.city}</strong> (
                    {entry.startDate} - {entry.isCurrent ? "Present" : entry.endDate})
                  </p>
                  {entry.description && <p>{entry.description}</p>}
                </div>
                <div className="entry-actions">
                  <button
                    type="button"
                    className="btn edit-btn"
                    onClick={() => editPlaceEntry(index)}
                    disabled={loading}
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    className="btn remove-bt"
                    onClick={() => removePlaceEntry(index)}
                    disabled={loading}
                  >
                    &times;
                  </button>
                </div>
              </div>
            ))
          )}

          <div>
            <div className="form-group m-0 p-0 mb-4">
              <input
                type="text"
                name="city"
                placeholder="City/Town"
                value={currentPlace.city}
                onChange={handlePlaceChange}
                maxLength={30}
                disabled={loading}
              />
              <div className="character-counter m-0 p-0">
                {30 - currentPlace.city.length} characters remaining
              </div>
              {errors.city && <div className="error-message p-0 m-0">{errors.city}</div>}
            </div>

            <div className="form-group m-0 p-0">
              <textarea
                name="description"
                placeholder="Description (optional)"
                value={currentPlace.description}
                onChange={handlePlaceChange}
                maxLength={200}
                rows="3"
                disabled={loading}
              />
              <div className="character-counter m-0 p-0">
                {200 - currentPlace.description.length} characters remaining
              </div>
              {errors.description && (
                <div className="error-message">{errors.description}</div>
              )}
            </div>

            <div className="form-group">
              <label>Start Date</label>
              <input
                type="date"
                name="startDate"
                value={currentPlace.startDate}
                onChange={handlePlaceChange}
                disabled={loading}
             
              />
              {errors.startDate && (
                <div className="error-message p-0 m-0">{errors.startDate}</div>
              )}
            </div>

            <div className="form-group">
              <label>End Date</label>
              <input
                type="date"
                name="endDate"
                value={currentPlace.endDate}
                onChange={handlePlaceChange}
                disabled={currentPlace.isCurrent || loading}
                min={currentPlace.startDate || new Date().toISOString().split('T')[0]}
              />
              {errors.endDate && (
                <div className="error-message p-0 m-0">{errors.endDate}</div>
              )}

              <div className="checkbox mb-1">
                <label>
                  <input
                    type="checkbox"
                    name="isCurrent"
                    checked={currentPlace.isCurrent}
                    onChange={handlePlaceChange}
                    disabled={loading}
                  />
                  <i className="check-box"></i>
                  Till Date
                </label>
              </div>
            </div>

            <div className="form-group">
              <button
                type="button"
                className="btn btn-primary"
                onClick={addOrUpdatePlaceEntry}
                style={{ background: "#FA6342", border: 'none' }}
                disabled={loading}
              >
                {loading ? "Processing..." :
                  (editIndex !== null ? "Update Entry" : "Add Place Entry")}
              </button>

              <button
                type="button"
                className="btn btn-secondary mr-2"
                onClick={onClose}
                disabled={loading}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};
export const ChangeContactAndBasicInfoTemplate = ({ onClose }) => {
  const { user, login } = useAuth();
  const [message, setMessage] = useState("");
  const [loading, setloading] = useState(false);
  // State for form data
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    username: "",
    phone_number: "",
  });

  // State for validation errors
  const [errors, setErrors] = useState({
    first_name: "",
    last_name: "",
    username: "",
    phone_number: "",
  });

  // State for dropdown visibility
  // Fetch data from the endpoint on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (user) {
          // Convert single language to array if needed
          const userData = {
            ...user
          };
          setFormData(userData);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);
  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear the error message when the user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };
  // Handle phone number change
  const handlephone_numberChange = (value) => {
    setFormData((prev) => ({
      ...prev,
      phone_number: value || "",
    }));

    if (errors.phone_number) {
      setErrors((prev) => ({ ...prev, phone_number: "" }));
    }
  };
  // Validate form fields
  const validateForm = () => {
    const newErrors = {
      first_name: "",
      last_name: "",
      username: "",
      phone_number: ""
    };

    // Validate First Name
    if (!formData.first_name) {
      newErrors.first_name = "First Name is required.";
    }

    // Validate Last Name
    if (!formData.last_name) {
      newErrors.last_name = "Last Name is required.";
    }

    // Validate Username
    if (!formData.username) {
      newErrors.username = "Username is required.";
    }

    // Validate Phone Number
    if (formData.phone_number && !/^\+[1-9]\d{1,14}$/.test(formData.phone_number)) {
      newErrors.phone_number = "Invalid phone number.";
    }



    setErrors(newErrors);
    return Object.values(newErrors).every((error) => !error);
  };
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        setloading(true);
        const data = new FormData();
        data.append("first_name", formData.first_name);
        data.append("last_name", formData.last_name);
        data.append("phone_number", formData.phone_number);
        data.append("username", formData.username);
        data.append("user_id", user.user_id);
        setMessage("");
        $.ajax({
          url: import.meta.env.VITE_API_URL + "profile/edit_contact_info",
          type: "POST",
          data: data,
          processData: false,
          contentType: false,
          timeout: 3000000,
          success: function (response) {
            setloading(false);
            console.log(response);
            const responseData = JSON.parse(response);
            // console.log(responseData.userdata);
            if (responseData.status === "OK") {
              showToast.info(responseData.api_message);
              localStorage.setItem("userdata", JSON.stringify(responseData.userdata));
              login(responseData.userdata); // Pass the 'user' object to the 'login' function
            } else {
              setMessage({
                type: "danger",
                message: responseData.api_message,
              });
            }
          },
          error: function (xhr, status, error) {
            setloading(false);
            setMessage({
              type: "danger",
              message:
                xhr.responseJSON?.api_message ||
                "An unknown error occurred. Please try again later.",
            });
          },
          complete: function () {
            setloading(false);
          },
        });
      } catch (error) {
        console.log(error);
        setloading(false);
        setMessage({
          type: "danger",
          message: "An unknown error occurred. Please try again later.",
        });
      }
    }
  };
  // Get language names from codes


  return (
    <div className="">
      <LoadingOverlay isVisible={loading} />
      <form onSubmit={handleSubmit}>
        {message && (
          <div className={`alert alert-${message.type}`}>{message.message}</div>
        )}
        {/* First Name */}
        <div className="row">
          <div className="form-group col-xxl-6 col-lg-6  col-sm-12">
            <label>First Name</label>
            <input
              type="text"
              name="first_name"
              placeholder="Enter your first name"
              value={formData.first_name}
              onChange={handleInputChange}
            />
            {errors.first_name && (
              <div className="error-message">{errors.first_name}</div>
            )}
          </div>
          {/* Last Name */}
          <div className="form-group col-xxl-6 col-lg-6 col-sm-12">
            <label>Last Name</label>
            <input
              type="text"
              name="last_name"
              placeholder="Enter your last name"
              value={formData.last_name}
              onChange={handleInputChange}
            />
            {errors.last_name && (
              <div className="error-message">{errors.last_name}</div>
            )}
          </div>

          <div className="form-group col-xxl-6 col-lg-6  col-sm-12">
            <label>Username</label>
            <input
              type="text"
              name="username"
              placeholder="Enter your username"
              value={formData.username}
              onChange={handleInputChange}
            />
            {errors.username && (
              <div className="error-message">{errors.username}</div>
            )}
          </div>
          {/* Phone Number */}
          <div className="form-group col-xxl-6 col-lg-6  col-sm-12 m-0 pt-0 mt-0">
            <label className="mb-0 pb-0">Phone Number</label>
            <PhoneInput
              style={{ width: '100%', margin: '0px', padding: '0px' }}
              className="mt-0 pt-0"
              international
              defaultCountry="NG"
              value={formData.phone_number}
              onChange={handlephone_numberChange}
              placeholder="Enter phone number"
            />
            {errors.phone_number && (
              <div className="text-danger small m-0 p-0">{errors.phone_number}</div>
            )}
          </div>
        </div>


        {/* Buttons */}
        <div className="form-buttons">
          <button type="submit" style={{ background: "#FA6342", border: 'none' }} className="btn submit-btn">
            Save Changes
          </button>
          <button type="button" className="btn cancel-btn" onClick={onClose}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export const DescriptionComponent = ({ onClose }) => {
  // State for form data
  const { user, login } = useAuth();
  const [message, setMessage] = useState("");
  const [loading, setloading] = useState(false);
  const [formData, setFormData] = useState({
    descriptions: "",
    nickname: "",
    fav_quote: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (user) {
          // Convert single language to array if needed
          const userData = {
            ...user
          };
          setFormData(userData);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  // State for validation errors
  const [errors, setErrors] = useState({
    descriptions: "",
    nickname: "",
    fav_quote: "",
  });

  // Character limits
  const characterLimits = {
    descriptions: 150,
    nickname: 20,
    fav_quote: 100,
  };

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // Validate character limit
    if (value.length <= characterLimits[name]) {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));

      // Clear the error message when the user starts typing
      if (errors[name]) {
        setErrors((prev) => ({ ...prev, [name]: "" }));
      }
    }
  };

  // Validate form fields
  const validateForm = () => {
    const newErrors = {
      descriptions: "",
      nickname: "",
      fav_quote: "",
    };

    // Validate Short Description
    if (formData.descriptions.length > characterLimits.descriptions) {
      newErrors.descriptions = `Short description cannot exceed ${characterLimits.descriptions} characters.`;
    }

    // Validate nickname
    if (formData.nickname.length > characterLimits.nickname) {
      newErrors.nickname = `nickname cannot exceed ${characterLimits.nickname} characters.`;
    }

    // Validate Favourite Quote
    if (formData.fav_quote.length > characterLimits.fav_quote) {
      newErrors.fav_quote = `Favourite quote cannot exceed ${characterLimits.fav_quote} characters.`;
    }

    setErrors(newErrors);
    return Object.values(newErrors).every((error) => !error); // Return true if no errors
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        setloading(true);
        const data = new FormData();
        data.append("descriptions", formData.descriptions);
        data.append("nickname", formData.nickname);
        data.append("fav_quote", formData.fav_quote);
        data.append("user_id", user.user_id);
        setMessage("");
        $.ajax({
          url: import.meta.env.VITE_API_URL + "profile/edit_user_description",
          type: "POST",
          data: data,
          processData: false,
          contentType: false,
          timeout: 3000000,
          success: function (response) {
            setloading(false);
            console.log(response);
            const responseData = JSON.parse(response);
            // console.log(responseData.userdata);
            if (responseData.status === "OK") {
              showToast.info(responseData.api_message);
              localStorage.setItem("userdata", JSON.stringify(responseData.userdata));
              login(responseData.userdata); // Pass the 'user' object to the 'login' function
            } else {
              setMessage({
                type: "danger",
                message: responseData.api_message,
              });
            }
          },
          error: function (xhr, status, error) {
            setloading(false);
            setMessage({
              type: "danger",
              message:
                xhr.responseJSON?.api_message ||
                "An unknown error occurred. Please try again later.",
            });
          },
          complete: function () {
            setloading(false);
          },
        });
      } catch (error) {
        console.log(error);
        setloading(false);
        setMessage({
          type: "danger",
          message: "An unknown error occurred. Please try again later.",
        });
      }
    }
  };

  return (
    <div className="">
      <LoadingOverlay isVisible={loading} />
      <form onSubmit={handleSubmit}>
        {message && (
          <div style={{ lineHeight: "10px", padding: '0px' }} className={`alert alert-${message.type}`}>{
            <HTMLFormatter >
              {message.message}
            </HTMLFormatter>
          }</div>
        )}        {/* Short Description */}
        <div style={{ marginBottom: "16px" }}>
          <label style={{ display: "block", marginBottom: "8px", fontWeight: "500" }}>
            Short Description About Yourself
          </label>
          <textarea
            name="descriptions"
            placeholder="Write a short description about yourself (optional)"
            value={formData.descriptions}
            onChange={handleInputChange}
            style={{
              width: "100%",
              padding: "8px",
              borderRadius: "4px",
              border: errors.descriptions ? "1px solid red" : "1px solid #ccc",
            }}
            rows="4"
          />
          <div style={{ fontSize: "14px", color: "#666", marginTop: "4px" }}>
            {formData.descriptions.length}/{characterLimits.descriptions} characters
          </div>
          {errors.descriptions && (
            <div style={{ color: "red", fontSize: "14px", marginTop: "4px" }}>
              {errors.descriptions}
            </div>
          )}
        </div>

        {/* nickname */}
        <div style={{ marginBottom: "16px" }}>
          <label style={{ display: "block", marginBottom: "8px", fontWeight: "500" }}>
            nickname
          </label>
          <input
            type="text"
            name="nickname"
            placeholder="Enter your nickname (optional)"
            value={formData.nickname}
            onChange={handleInputChange}
            style={{
              width: "100%",
              padding: "8px",
              borderRadius: "4px",
              border: errors.nickname ? "1px solid red" : "1px solid #ccc",
            }}
          />
          <div style={{ fontSize: "14px", color: "#666", marginTop: "4px" }}>
            {formData.nickname.length}/{characterLimits.nickname} characters
          </div>
          {errors.nickname && (
            <div style={{ color: "red", fontSize: "14px", marginTop: "4px" }}>
              {errors.nickname}
            </div>
          )}
        </div>

        {/* Favourite Quote */}
        <div style={{ marginBottom: "16px" }}>
          <label style={{ display: "block", marginBottom: "8px", fontWeight: "500" }}>
            Favourite Quote
          </label>
          <textarea
            name="fav_quote"
            placeholder="Enter your favourite quote (optional)"
            value={formData.fav_quote}
            onChange={handleInputChange}
            style={{
              width: "100%",
              padding: "8px",
              borderRadius: "4px",
              border: errors.fav_quote ? "1px solid red" : "1px solid #ccc",
            }}
            rows="3"
          />
          <div style={{ fontSize: "14px", color: "#666", marginTop: "4px" }}>
            {formData.fav_quote.length}/{characterLimits.fav_quote} characters
          </div>
          {errors.fav_quote && (
            <div style={{ color: "red", fontSize: "14px", marginTop: "4px" }}>
              {errors.fav_quote}
            </div>
          )}
        </div>

        {/* Submit Button */}
        <div className="row">
          <div className="form-group" >
            <button
              type="submit"
              style={{ background: "#FA6342", border: 'none' }}
              className="submit-btn"
            >
              Submit
            </button>
            <button onClick={onClose} type="button" className="btn cancel_btn ml-1">
              Cancel
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

