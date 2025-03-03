import axios from "axios";
import { HOST_API_URL } from "../../util/variables";

const token = localStorage.getItem("token");

export const getData = async (path: string) => {
  try {
    const response = await axios.get(`${HOST_API_URL}/${path}`, {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const postData = async (path: string, data: any) => {
  try {
    const response = await axios.post(`${HOST_API_URL}/${path}`, data, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    return await response;
  } catch (error) {
    console.error("Error posting data:", error);
    return null;
  }
};

export const putData = async (path: string, data: any) => {
  try {
    const response = await axios.put(`${HOST_API_URL}/${path}`, data, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    return await response;
  } catch (error) {
    console.error("Error updating data:", error);
    return null;
  }
};

export const deleteData = async (path: string) => {
  try {
    await axios.delete(`${HOST_API_URL}/${path}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (error) {
    console.error("Error deleting data:", error);
  }
};

export const postEventData = async (path: string, data: any) => {
  try {
    const response = await axios.post(`${HOST_API_URL}/${path}`, data, {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    return await response;
  } catch (error) {
    console.error("Error posting event data:", error);
    return null;
  }
};
