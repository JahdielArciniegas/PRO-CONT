import type { userIa } from "@src/lib/types";

const domain = import.meta.env.PUBLIC_DOMAIN || "http://localhost:4321";

export const getUserIa = async (userId: string) => {
  try {
    const response: Response = await fetch(`${domain}/api/useIA`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        userId,
      },
    });
    const data = await response.json();
    if (data.length > 0) return true;
    return false;
  } catch (error) {
    throw error;
  }
};

export const addUserIa = async (userIa: userIa) => {
  try {
    const response: Response = await fetch(`${domain}/api/useIA`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userIa),
    });
    const data = await response.json();
    return data;
  } catch (error) {
    throw error;
  }
};
