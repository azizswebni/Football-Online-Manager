import cookiesStorage from "./cookieStorage";

export default async function clearStorages(): Promise<void> {
  // Clear localStorage (synchronous operation)
  localStorage.clear();

  // Clear all cookies (handle async operations properly)
  const cookies = document.cookie.split(";");
  const clearPromises = cookies.map(async (cookie) => {
    const [name] = cookie.split("=");
    await cookiesStorage.removeItem(name.trim());
  });

  // Wait for all cookie clearing operations to complete
  await Promise.all(clearPromises);
}
