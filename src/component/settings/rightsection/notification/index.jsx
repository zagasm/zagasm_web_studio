import "./style.css";
import { useState, useEffect } from "react";
import $ from "jquery";
import { useAuth } from "../../../../pages/auth/AuthContext";

export const NotificationSection = () => {
  const { user } = useAuth();
  const [settings, setSettings] = useState({
    community_notify: false,
    post_notify: false,
    comment_notify: false,
    profile_status: false,
    stay_anonymous: false
  });
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ type: "", message: "" });

  // Fetch settings on component mount
  useEffect(() => {
    const fetchSettings = () => {
      const formData = new FormData();
      formData.append("user_id", user.user_id);
      try {
        setLoading(true);
        setMessage({ type: "", message: "" });
        $.ajax({
          url: import.meta.env.VITE_API_URL + "auth/notification_privacy_settings",
          type: "POST",
          data: formData,
          processData: false,
          contentType: false,
          timeout: 30000,
          success: function (response) {
            setLoading(false);
            const responseData = typeof response === 'string' ? JSON.parse(response) : response;
            if (responseData.status === "OK") {
              setSettings(responseData.data);
            } else {
              setSettings([]);

              setMessage({
                type: "danger",
                message: responseData.api_message || "Failed to load settings."
              });
            }
          },
          error: function (xhr, status, error) {
            setLoading(false);
            setMessage({
              type: "danger",
              message: xhr.responseJSON?.api_message ||
                "An error occurred while loading settings. Please try again."
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

    fetchSettings();
  }, []);
  // Handle setting toggle
  const handleToggle = (settingName) => {
    const newValue = !settings[settingName];

    try {
      setLoading(true);
      setMessage({ type: "", message: "" });

      const formData = new FormData();
      formData.append("setting_name", settingName);
      formData.append("setting_value", newValue ? "1" : "0");
      formData.append("user_id", user.user_id);

      $.ajax({
        url: import.meta.env.VITE_API_URL + "auth/update_user_settings",
        type: "POST",
        data: formData,
        processData: false,
        contentType: false,
        timeout: 30000,
        success: function (response) {
          console.log(response);
          setLoading(false);
          const responseData = typeof response === 'string' ? JSON.parse(response) : response;
          if (responseData.status === "OK") {
            setSettings(prev => ({
              ...prev,
              [settingName]: newValue
            }));
          } else {
            setMessage({
              type: "danger",
              message: responseData.api_message || "Failed to update setting."
            });
          }
        },
        error: function (xhr, status, error) {
          setLoading(false);
          setMessage({
            type: "danger",
            message: xhr.responseJSON?.api_message ||
              "An error occurred while updating setting. Please try again."
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
  if (loading) {
    return <div className="text-center py-4">Loading settings...</div>;
  }

  // if (message.message) {
  //   return (
  //     <div className={`alert alert-${message.type || 'danger'} my-3`}>
  //       {message.message}
  //     </div>
  //   );
  // }

  return (
    <div className="tab-content p-0 m-0">
      {/* General Setting Tab */}
      <div className="tab-pane fade show active" id="gen-setting">
        <div className="account-delet account-general m-0 p-0 pb-4">
          <h4>Notification</h4>
          <hr />
          <div className="item_setting mt-3">
            <div style={{
              display: "flex",
              justifyItems: "space-between",
              margin: '0px'
            }}>
              <span style={{ width: '100%' }}>
                <h6>Communities notification</h6>
              </span>
              <span
                className="setting-row text-right border-none"
                style={{ border: "none", margin: '0px' }}
              >
                <input
                  type="checkbox"
                  id="community_notify"
                  checked={settings.community_notify}
                  onChange={() => handleToggle('community_notify')}
                  disabled={loading}
                />
                <label
                  htmlFor="community_notify"
                  data-on-label="ON"
                  data-off-label="OFF"
                ></label>
              </span>
            </div>
            <span style={{ margin: '0px' }}>you will get a notification if there is a new community added</span>
          </div>

          <div className="item_setting">
            <div style={{
              display: "flex",
              justifyItems: "space-between",
              margin: '0px'
            }}>
              <span style={{ width: '100%' }}>
                <h6>Communities post notification</h6>
              </span>
              <span
                className="setting-row text-right border-none"
                style={{ border: "none", margin: '0px' }}
              >
                <input
                  type="checkbox"
                  id="post_notify"
                  checked={settings.post_notify}
                  onChange={() => handleToggle('post_notify')}
                  disabled={loading}
                />
                <label
                  htmlFor="post_notify"
                  data-on-label="ON"
                  data-off-label="OFF"
                ></label>
              </span>
            </div>
            <span style={{ margin: '0px' }}>you will get a notification if there is a new post in the community you belong to</span>
          </div>

          <div className="item_setting">
            <div style={{
              display: "flex",
              justifyItems: "space-between",
              margin: '0px'
            }}>
              <span style={{ width: '100%' }}>
                <h6>Comment on post notification</h6>
              </span>
              <span
                className="setting-row text-right border-none"
                style={{ border: "none", margin: '0px' }}
              >
                <input
                  type="checkbox"
                  id="comment_notify"
                  checked={settings.comment_notify}
                  onChange={() => handleToggle('comment_notify')}
                  disabled={loading}
                />
                <label
                  htmlFor="comment_notify"
                  data-on-label="ON"
                  data-off-label="OFF"
                ></label>
              </span>
            </div>
            <span style={{ margin: '0px' }}>you will get a notification if any villagers comment on your post</span>
          </div>
        </div>

        <div className="account-delet account-general m-0 p-0">
          <h4>Privacy</h4>
          <hr />
          <div className="item_setting">
            <div style={{
              display: "flex",
              justifyItems: "space-between",
              margin: '0px'
            }}>
              <span style={{ width: '100%' }}>
                <h6>Show profile</h6>
              </span>
              <span
                className="setting-row text-right border-none"
                style={{ border: "none", margin: '0px' }}
              >
                <input
                  type="checkbox"
                  id="profile_status"
                  checked={settings.profile_status}
                  onChange={() => handleToggle('profile_status')}
                  disabled={loading}
                />
                <label
                  htmlFor="profile_status"
                  data-on-label="ON"
                  data-off-label="OFF"
                ></label>
              </span>
            </div>
            <span style={{ margin: '0px' }}>if switch on, villager will be able to see your profile details</span>
          </div>

          <div className="item_setting">
            <div style={{
              display: "flex",
              justifyItems: "space-between",
              margin: '0px'
            }}>
              <span style={{ width: '100%' }}>
                <h6>Stay anonymous</h6>
              </span>
              <span
                className="setting-row text-right border-none"
                style={{ border: "none", margin: '0px' }}
              >
                <input
                  type="checkbox"
                  id="stay_anonymous"
                  checked={settings.stay_anonymous}
                  onChange={() => handleToggle('stay_anonymous')}
                  disabled={loading}
                />
                <label
                  htmlFor="stay_anonymous"
                  data-on-label="ON"
                  data-off-label="OFF"
                ></label>
              </span>
            </div>
            <span style={{ margin: '0px' }}>if switch on, your contact name/details will not be visible to villagers, you can only be identify with your poki Identification number</span>
          </div>
        </div>
      </div>
    </div>
  );
};