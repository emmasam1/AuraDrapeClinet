import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

const AppContext = createContext();

const BASE_URL = "https://auradrape.onrender.com";

export const AppProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const [token, setToken] = useState(
    sessionStorage.getItem("token") || null
  );

  const [loading, setLoading] = useState(false);

  /* ---------------- LOAD USER ---------------- */
  useEffect(() => {
    const storedUser = sessionStorage.getItem("user");

    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  /* ---------------- LOGIN ---------------- */
  const login = async (email, password) => {
    try {
      setLoading(true);

      const response = await fetch(
        `${BASE_URL}/api/auth/login`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            email,
            password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message);
      }

      setUser(data.user);
      setToken(data.token);

      /* Save to Session Storage */
      sessionStorage.setItem(
        "user",
        JSON.stringify(data.user)
      );

      sessionStorage.setItem(
        "token",
        data.token
      );

      return {
        success: true,
        message: data.message,
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- SIGNUP ---------------- */
  const signup = async (
    name,
    email,
    password
  ) => {
    try {
      setLoading(true);

      const response = await fetch(
        `${BASE_URL}/api/auth/register`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            name,
            email,
            password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message);
      }

      return {
        success: true,
        message: data.message,
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- LOGOUT ---------------- */
  const logout = () => {
    setUser(null);
    setToken(null);

    sessionStorage.removeItem("user");
    sessionStorage.removeItem("token");
  };

  return (
    <AppContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        signup,
        logout,
        BASE_URL,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);