import { getCookie, setCookie, removeCookie } from "typescript-cookie";


const cookiesStorage = {
  getItem: (name: string) => {
    const cookieAuth = getCookie(name);
    if (cookieAuth) {
      try {
        // Safely parse the cookie value and cast it to the correct type
        const parsedData = JSON.parse(cookieAuth);
        return parsedData.state.token; // Safely access the `state.token` property
      } catch {
        // In case JSON parsing fails, return null
        return null;
      }
    } else {
      return null;
    }
  },
  setItem: (name: string, value: string) => {
    setCookie(name, value, { expires: 1 });
  },
  removeItem: (name: string) => {
    removeCookie(name);
  },
};

export default cookiesStorage;
