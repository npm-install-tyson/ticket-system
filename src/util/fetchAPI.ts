const fetchData = async (url: string, setItems: any) => {
  try {
    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch show times");
    }

    const data = await response.json();
    setItems(data);
  } catch (err: any) {
    return err;
  }
};

export default fetchData;
