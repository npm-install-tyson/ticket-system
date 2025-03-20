import axios from "axios";

const apiUrl = import.meta.env.VITE_API_URL

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
