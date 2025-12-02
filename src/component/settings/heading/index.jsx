import React, { useState, useRef, useEffect } from "react";
import ReactCrop from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import ReactModal from "react-modal";
import $ from "jquery"; // Import jQuery
import { useAuth } from "../../../pages/auth/AuthContext";
import { showToast } from "../../ToastAlert";
import { TailSpin } from "react-loader-spinner"; // Import the loader component
import './style.css';
import profileImg from '../../../assets/images/profileImg/profile-img.jpg';
import coverprofileImg from '../../../assets/images/profileImg/profile-cover-image.jpg';
import { UserTypeIcon } from "./usertype";
import { useVillage } from "../../villageSqare/VillageContext";
import { usePost } from "../../posts/PostContext";
import NumberFormatter from "../../assets/ContentSettings";
import { useComment } from "../../Comments/commentContext";
import { showSuccess, showError } from "../../ui/toast";
// Set app element for react-modal (required for accessibility)
ReactModal.setAppElement("#root");

const ProfilePageHeading = () => {
    const [coverPicture, setCoverPicture] = useState(null);
    const [previewImageSrc, setPreviewImageSrc] = useState(null); // Preview image for cropping
    const [crop, setCrop] = useState({ aspect: 1 / 1 }); // Square aspect ratio for profile picture
    const [croppedImage, setCroppedImage] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = useState(false); // Loading state
    const [uploadType, setUploadType] = useState(null); // Track upload type: 'cover' or 'profile'
    const imgRef = useRef(null);
    const { user, login } = useAuth();
    const [imageSrc, setImageSrc] = useState(null); // Actual cover image
    const [profileImageSrc, setProfileImageSrc] = useState(null); // Actual profile image
    const { mycommunityData } = useVillage();
    const { PostData } = usePost();
    const [userTotalPost, setuserTotalPost] = useState(0);
    const [userTotalComment, setuserTotalComment] = useState(0);
    const { MyCommentData, FetchMyComments } = useComment();

    // useEffect(() => {
    //     FetchMyComments();
    //     if (MyCommentData.commentData) {
    //         setuserTotalComment(MyCommentData.commentData.length);

    //     }
    // }, [user])
    // console.log(MyCommentData.commentData.length)
    useEffect(() => {
        if (user.user_id && PostData) {
            // Use filter instead of find to get all matching posts
            const userPosts = PostData.filter(post => post.user_id === user.user_id);


            if (userPosts.length > 0) {
                setuserTotalPost(userPosts.length);
            } else {
                setuserTotalPost(0); // Set to 0 if no posts found
            }
        }
    }, [user.user_id, PostData]);

    useEffect(() => {
        if (user.profile_cover_img_id) {
            setImageSrc(import.meta.env.VITE_API_URL + user.profile_cover_img_id);
        } else {
            setImageSrc(coverprofileImg);
        }

        if (user.profile_image_id) {
            setProfileImageSrc(import.meta.env.VITE_API_URL + user.profile_image_id);
        } else {
            setProfileImageSrc(profileImg);
        }
    }, [user]);

    // Handle file selection for cover picture
    const handleCoverFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                setPreviewImageSrc(reader.result); // Set preview image for cropping
                setCoverPicture(file);
                setUploadType("cover"); // Set upload type to 'cover'
                setIsModalOpen(true);
            };
            reader.onerror = () => {
                showError("Failed to read the file.");
            };
            reader.readAsDataURL(file);
        }
    };

    // Handle file selection for profile picture
    const handleProfileFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                setPreviewImageSrc(reader.result); // Set preview image for cropping
                setCoverPicture(file);
                setUploadType("profile"); // Set upload type to 'profile'
                setIsModalOpen(true);
            };
            reader.onerror = () => {
                showError("Failed to read the file.");
            };
            reader.readAsDataURL(file);
        }
    };

    // Handle crop completion
    const handleCropComplete = (crop) => {
        if (imgRef.current && crop.width && crop.height) {
            const croppedImageUrl = getCroppedImg(imgRef.current, crop);
            setCroppedImage(croppedImageUrl);
        }
    };

    // Get the cropped image as a base64 URL
    const getCroppedImg = (image, crop) => {
        const canvas = document.createElement("canvas");
        const scaleX = image.naturalWidth / image.width;
        const scaleY = image.naturalHeight / image.height;
        canvas.width = crop.width;
        canvas.height = crop.height;
        const ctx = canvas.getContext("2d");

        // Create a circular mask
        ctx.beginPath();
        ctx.arc(crop.width / 2, crop.height / 2, crop.width / 2, 0, Math.PI * 2, true);
        ctx.closePath();
        ctx.clip();

        ctx.drawImage(
            image,
            crop.x * scaleX,
            crop.y * scaleY,
            crop.width * scaleX,
            crop.height * scaleY,
            0,
            0,
            crop.width,
            crop.height
        );

        return canvas.toDataURL("image/jpeg");
    };

    // Convert base64 to a File object
    const base64ToFile = (base64, filename) => {
        const arr = base64.split(",");
        const mime = arr[0].match(/:(.*?);/)[1];
        const bstr = atob(arr[1]);
        let n = bstr.length;
        const u8arr = new Uint8Array(n);
        while (n--) {
            u8arr[n] = bstr.charCodeAt(n);
        }
        return new File([u8arr], filename, { type: mime });
    };

    // Handle upload of the cropped image (for cover picture)
    const handleCoverUpload = () => {
        if (!user) {
            showError("Please login to proceed.");
            return;
        }

        if (croppedImage) {
            setLoading(true); // Start loading

            const file = base64ToFile(croppedImage, "cropped-image.jpg");
            const formData = new FormData();
            formData.append("image", file);
            formData.append("user_id", user.user_id);

            $.ajax({
                url: import.meta.env.VITE_API_URL + "profile/editcoverpicture", // Replace with your server endpoint
                type: "POST",
                data: formData,
                processData: false,
                contentType: false,
                success: function (response) {
                    const responseData = JSON.parse(response);
                    if (responseData.status === "OK") {
                        showSuccess("Cover picture updated successfully!");
                        setImageSrc(croppedImage); // Update the actual cover image
                        setIsModalOpen(false);
                        setPreviewImageSrc(null);
                        localStorage.setItem("userdata", JSON.stringify(responseData.userdata));
                        login(responseData.userdata);
                    } else {
                        showToast.danger(responseData.api_message);
                    }
                },
                error: function (xhr, status, error) {
                    console.error("Upload failed:", error);
                    showError("Failed to upload cover picture.");
                },
                complete: function () {
                    setLoading(false); // Stop loading
                    setUploadType(null); // Reset upload type
                },
            });
        }
    };

    // Handle upload of the cropped image (for profile picture)
    const handleProfileUpload = () => {
        if (!user) {
            showError("Please login to proceed.");
            return;
        }

        if (croppedImage) {
            setLoading(true); // Start loading

            const file = base64ToFile(croppedImage, "cropped-profile-image.jpg");
            const formData = new FormData();
            formData.append("image", file);
            formData.append("user_id", user.user_id);

            $.ajax({
                url: import.meta.env.VITE_API_URL + "profile/editprofilepicture", // Replace with your server endpoint
                type: "POST",
                data: formData,
                processData: false,
                contentType: false,
                success: function (response) {
                    const responseData = JSON.parse(response);
                    if (responseData.status === "OK") {
                        showToast.info("Profile picture updated successfully!");
                        setProfileImageSrc(croppedImage); // Update the actual profile image
                        setIsModalOpen(false);
                        setPreviewImageSrc(null);
                        localStorage.setItem("userdata", JSON.stringify(responseData.userdata));
                        login(responseData.userdata);
                    } else {
                        showToast.danger(responseData.api_message);
                    }
                },
                error: function (xhr, status, error) {
                    console.error("Upload failed:", error);
                    showError("Failed to upload profile picture.");
                },
                complete: function () {
                    setLoading(false); // Stop loading
                    setUploadType(null); // Reset upload type
                },
            });
        }
    };

    // Close the modal and reset preview
    const closeModal = () => {
        setIsModalOpen(false);
        setCoverPicture(null);
        setCroppedImage(null);
        setPreviewImageSrc(null); // Reset preview image
        setUploadType(null); // Reset upload type
    };

    return (
        <div className="user-profile">
            {/* Loader Overlay */}
            {loading && (
                <div
                    style={{
                        position: "fixed",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                        backgroundColor: "rgba(0, 0, 0, 0.5)",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        zIndex: 1000,
                    }}
                >
                    <TailSpin color="#00BFFF" height={80} width={80} /> {/* TailSpin loader */}
                </div>
            )}

            <figure>
                <label htmlFor="edit-pp" className="edit-pp bt btn-light">
                    <span className="fa fa-camera"></span>
                    <input
                        name="cover_picture_file"
                        id="edit-pp"
                        style={{ display: "none" }}
                        type="file"
                        accept="image/*"
                        onChange={handleCoverFileChange}
                    />
                    Edit cover picture
                </label>
                {/* {console.log('imggg',imageSrc)} */}
                <img className="cover_Picture" src={imageSrc} alt="Cover picture" />
            </figure>

            <ReactModal
                isOpen={isModalOpen}
                onRequestClose={closeModal}
                contentLabel="Crop Image Modal"
                style={{
                    content: {
                        top: "50%",
                        left: "50%",
                        right: "auto",
                        bottom: "auto",
                        marginRight: "-50%",
                        transform: "translate(-50%, -50%)",
                        maxWidth: "90%",
                        maxHeight: "90%",
                        overflow: "auto",
                        // width:'60%'
                    },
                }}
            >
                <h5>Crop Your Image</h5>
                <div className="crop-container">
                    <ReactCrop
                        src={previewImageSrc} // Use preview image for cropping
                        crop={crop}
                        onChange={(newCrop) => setCrop(newCrop)}
                        onComplete={handleCropComplete}
                        circularCrop={uploadType === "profile"} // Enable circular crop for profile picture
                    // style={{width:'fit-content'}}
                    >
                        <img
                            ref={imgRef}
                            src={previewImageSrc}
                            alt="Cover picture"
                            style={{
                                maxWidth: "100%",
                                minWidth: '100%',
                                maxHeight: "300px",
                                objectFit: "cover",
                                width: "100%",
                                // borderRadius: uploadType === "profile" ? "10%" : "0", // Apply circular border for profile picture
                            }}
                        />
                    </ReactCrop>
                    <div className="modal-buttons mt-3">
                        <div>
                            <button
                                style={{
                                    // padding: "10px 20px",
                                    background: '#30305b',
                                    color: "#fff",
                                    border: "none",
                                    borderRadius: "4px",
                                    cursor: "pointer",
                                }}
                                onClick={closeModal}
                                className="btn mr-2"
                            >
                                Cancel
                            </button>
                            <button
                                style={{
                                    // padding: "10px 20px",
                                    background: '#FA6342',
                                    color: "#fff",
                                    border: "none",
                                    borderRadius: "4px",
                                    cursor: "pointer",
                                }}
                                onClick={uploadType === "cover" ? handleCoverUpload : handleProfileUpload} // Use the correct upload function
                                className="btn"
                            >
                                Upload
                            </button>
                        </div>
                    </div>
                </div>
            </ReactModal>

            <div className="profile-section">
                <div className="row">
                    <div className="col-xxl-6 col-lg-6 col-md-12">
                        <div className="profile-author">
                            <div className="profile-author-thumb">
                                <img
                                    src={profileImageSrc}
                                    alt="Profile"
                                    style={{ borderRadius: "50%" }} // Circular profile picture
                                />
                                <div className="edit-dp">
                                    <label style={{ border: "none" }} className="fileContainer">
                                        <i className="fa fa-camera"></i>
                                        <input
                                            type="file"
                                            name="Profile_user_picture"
                                            onChange={handleProfileFileChange}
                                        />
                                    </label>
                                </div>
                            </div>
                            <div className="author-content">
                                <h4 style={{ textTransform: "capitalize" }}>
                                    {user && user.last_name + ' ' + user.first_name} <small>({user && user.username})</small> {" "}

                                    <UserTypeIcon userType={user.user_type} />

                                </h4>
                            </div>
                        </div>
                    </div>
                    <div className="col-xxl-6 col-lg-6 col-md-12">
                        <ol className="folw-detail mb-2">
                            <li>
                                <span>Communities</span>
                                <ins><NumberFormatter number={mycommunityData ? (mycommunityData.length) : 0} />  </ins>
                            </li>
                            <li>
                                <span>Comments</span>
                                <ins>{userTotalComment}</ins>
                            </li>
                            <li>
                                <span>Posts</span>
                                <ins><NumberFormatter number={userTotalPost} /></ins>
                            </li>
                        </ol>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfilePageHeading;