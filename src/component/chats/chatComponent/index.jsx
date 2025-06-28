// chatComponent.js
import axios from 'axios';

export const fetchChats = async (user_id) => {
  try {
    const formData = new FormData();
    formData.append('api_secret_key', 'Zagasm2025!Api_Key_Secret');
    formData.append('user_id', user_id);
    formData.append('offset', '0');

    const response = await axios.post(
      'https://zagasm.com/includes/ajax/chat/get_conversations.php',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }
    );

    if (response.data.success && Array.isArray(response.data.conversations)) {
      return response.data.conversations.map((c) => ({
        id: c.user_id,
        name: c.name?.trim() || c.name_list || 'Unknown',
        message: c.message_orginal,
        avatar: c.picture,
        status: c.seen === "1" ? 'read' : 'unread',
        time: c.time,
      }));
    }

    return [];
  } catch (error) {
    console.error('Error fetching chats:', error);
    return [];
  }
};
