// import axios from 'axios';

// const api = axios.create({
//   baseURL: 'http://localhost:5000/api',
// });

// export const sendMessage = async (message) => {
//   try {
//     const response = await api.post('/assistant', { message });
//     return response.data.reply;
//   } catch (error) {
//     console.error('Error in sendMessage:', error); // Debugging
//     throw error;
//   }
// };

import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
});

// Send a message to the AI assistant
export const sendMessage = async (message) => {
  try {
    const response = await api.post('/assistant', { message });
    return response.data.reply;
  } catch (error) {
    console.error('Error in sendMessage:', error);
    throw error;
  }
};

export default api; // Default export (optional)