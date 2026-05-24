import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import axios from "axios";

import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AppContext = createContext();

const BASE_URL = "https://auradrape.onrender.com";

export const AppProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(
    sessionStorage.getItem("token") || null
  );

  const [loading, setLoading] = useState(false);

  const [designs, setDesigns] = useState([]);

  /* ===============================
     LOAD USER
  =============================== */
  useEffect(() => {
    const storedUser = sessionStorage.getItem("user");

    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  /* ===============================
     AUTH HEADERS
  =============================== */
  const authConfig = () => ({
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  /* ===============================
     LOGIN
  =============================== */
  const login = async (email, password) => {
    try {
      setLoading(true);

      const { data } = await axios.post(
        `${BASE_URL}/api/auth/login`,
        { email, password }
      );

      setUser(data.user);
      setToken(data.token);

      sessionStorage.setItem("user", JSON.stringify(data.user));
      sessionStorage.setItem("token", data.token);

      toast.success(data.message || "Login successful");

      return { success: true };
    } catch (error) {
      const message = error?.response?.data?.message || error.message;
      toast.error(message);

      return { success: false, message };
    } finally {
      setLoading(false);
    }
  };

  /* ===============================
     SIGNUP
  =============================== */
  const signup = async (name, email, password) => {
    try {
      setLoading(true);

      const { data } = await axios.post(
        `${BASE_URL}/api/auth/register`,
        { name, email, password }
      );

      // SAVE USER TO SESSION AFTER SIGNUP
      const newUser = { name, email };
      setUser(newUser);
      sessionStorage.setItem("user", JSON.stringify(newUser));

      toast.success(data.message || "Account created");

      return { success: true };
    } catch (error) {
      const message = error?.response?.data?.message || error.message;
      toast.error(message);

      return { success: false, message };
    } finally {
      setLoading(false);
    }
  };

  /* ===============================
     LOGOUT
  =============================== */
  const logout = () => {
    setUser(null);
    setToken(null);

    sessionStorage.removeItem("user");
    sessionStorage.removeItem("token");

    toast.success("Logged out");
  };

  /* ===============================
     CREATE DESIGN
  =============================== */
  const createDesign = async (design) => {
    try {
      const { data } = await axios.post(
        `${BASE_URL}/api/designs`,
        design
      );

      toast.success("Design saved");

      setDesigns((prev) => [data.design, ...prev]);

      return data;
    } catch (error) {
      const message = error?.response?.data?.message || error.message;
      toast.error(message);
    }
  };

  /* ===============================
     GET ALL DESIGNS
  =============================== */
  const getDesigns = async () => {
    try {
      const { data } = await axios.get(
        `${BASE_URL}/api/designs`
      );

      setDesigns(data.designs);

      return data.designs;
    } catch (error) {
      toast.error("Failed to load designs");
    }
  };

  /* ===============================
     UPDATE DESIGN
  =============================== */
  const updateDesign = async (id, design) => {
    try {
      const { data } = await axios.put(
        `${BASE_URL}/api/designs/${id}`,
        design
      );

      toast.success("Design updated");

      setDesigns((prev) =>
        prev.map((item) =>
          item._id === id ? data.design : item
        )
      );

      return data;
    } catch (error) {
      const message = error?.response?.data?.message || error.message;
      toast.error(message);
    }
  };

  /* ===============================
     DELETE DESIGN
  =============================== */
  const deleteDesign = async (id) => {
    try {
      await axios.delete(
        `${BASE_URL}/api/designs/${id}`
      );

      toast.success("Design deleted");

      setDesigns((prev) =>
        prev.filter((item) => item._id !== id)
      );
    } catch (error) {
      toast.error("Delete failed");
    }
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

        designs,
        createDesign,
        getDesigns,
        updateDesign,
        deleteDesign,

        BASE_URL,
      }}
    >
      {children}

      <ToastContainer
        position="top-right"
        autoClose={3000}
        theme="dark"
      />
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);