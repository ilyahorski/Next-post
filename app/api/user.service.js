export const getNode = async (token) => {
  try {
    const request = await fetch(`${apiLink}/node/2`, { // example URL
      method: "GET",
      credentials: "include",
      headers: {
        Authorization: `Bearer ${token}`,  // <-- add token to request
        "Content-Type": "application/json",
      },
    });
    const json = await request.text();
    if (request.ok) {
      return json
    } else {
      throw json.message;
    }
  } catch (e) {
    throw new Error(e);
  }
};