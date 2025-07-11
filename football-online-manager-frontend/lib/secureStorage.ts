import CryptoJS from "crypto-js";
import Cookies from "js-cookie";

const CRYPTO_KEY: string = process.env.NEXT_PUBLIC_CRYPTO_KEY || "your-secure-encryption-key"; 

export const secureStorage = {
  getItem: (name: string): string | null => {
    const data: string | undefined = Cookies.get(name);
    if (!data) return null;
    try {
      const decrypted: string = CryptoJS.AES.decrypt(data, CRYPTO_KEY).toString(CryptoJS.enc.Utf8);
      return decrypted || null;
    } catch {
      return null;
    }
  },
  setItem: (name: string, value: string): void => {
    const encrypted: string = CryptoJS.AES.encrypt(value, CRYPTO_KEY).toString();
    Cookies.set(name, encrypted, { expires: 7, secure: false, sameSite: 'strict' }); 
  },
  removeItem: (name: string): void => {
    Cookies.remove(name);
  },
};