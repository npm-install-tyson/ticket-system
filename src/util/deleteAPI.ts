import axios from "axios";

const deleteData = async (url: string) => {
  try {
    await axios.delete(url);
  } catch (err) {
    return null;
  }
};

export default deleteData;
