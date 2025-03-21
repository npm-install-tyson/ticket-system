import axios from "axios";

const apiUrl = import.meta.env.VITE_API_URL

/**
 * Fetches data from the specified API endpoint.
 * 
 * @param path - The API endpoint path to fetch data from.
 * @returns A Promise that resolves to the fetched data, or null if an error occurs.
 */
export const getData = async (path: string) => {
  const token = localStorage.getItem("token");
  try {
    const response = await axios.get(`${apiUrl}/${path}`, {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: token && `Bearer ${token}`,
      },
      withCredentials: true
    });
    return response.data;
  } catch (error) {
    console.log(error);
    return null;
  }
};

/**
 * Sends a POST request to the specified API endpoint with the provided data.
 * 
 * @param path - The API endpoint path to send the POST request to.
 * @param data - The data to be sent in the request body.
 * @param contentType - The content type of the request (default: "application/json").
 * @returns A Promise that resolves to the response from the server, or the error if one occurs.
 */
export const postData = async (
  path: string,
  data: any,
  contentType = "application/json"
) => {
  const token = localStorage.getItem("token");
  try {
    const response = await axios.post(`${apiUrl}/${path}`, data, {
      headers: {
        "Content-Type": contentType,
        Accept: "application/json",
        Authorization: token && `Bearer ${token}`,
      },
      withCredentials: true
    });

    return await response;
  } catch (error) {
    return error;
  }
};

/**
 * Sends a PUT request to update data at the specified API endpoint.
 * 
 * @param path - The API endpoint path to send the PUT request to.
 * @param data - The updated data to be sent in the request body.
 * @param contentType - The content type of the request (default: "application/json").
 * @returns A Promise that resolves to the response from the server, or null if an error occurs.
 */
export const putData = async (path: string, data: any, contentType = "application/json") => {
  const token = localStorage.getItem("token");
  try {
    const response = await axios.put(`${apiUrl}/${path}`, data, {
      headers: {
        "Content-Type": contentType,
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
      withCredentials: true
    });
    return await response;
  } catch (error) {
    console.error("Error updating data:", error);
    return null;
  }
};

/**
 * Sends a DELETE request to remove data at the specified API endpoint.
 * 
 * @param path - The API endpoint path to send the DELETE request to.
 * @returns A Promise that resolves when the delete operation is complete. Does not return any data.
 */
export const deleteData = async (path: string) => {
  const token = localStorage.getItem("token");
  try {
    await axios.delete(`${apiUrl}/${path}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      withCredentials: true
    });
  } catch (error) {
    console.error("Error deleting data:", error);
  }
};
