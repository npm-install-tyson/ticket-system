import axios from "axios";
import { HOST_API_URL } from "../../util/variables";

export const getData = async (path: string) => {
  const token = localStorage.getItem("token");
  try {
    const response = await axios.get(`${HOST_API_URL}/${path}`, {
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
    const response = await axios.post(`${HOST_API_URL}/${path}`, data, {
      headers: {
        "Content-Type": contentType,
        Accept: "application/json",
        Authorization: token && `Bearer ${token}`,
      },
      withCredentials: true
    });

    return await response;
  } catch (error) {
    console.error("Error posting data:", error);
    return null;
  }
};

export const putData = async (path: string, data: any, contentType = "application/json") => {
  const token = localStorage.getItem("token");
  try {
    const response = await axios.put(`${HOST_API_URL}/${path}`, data, {
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
    await axios.delete(`${HOST_API_URL}/${path}`, {
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
