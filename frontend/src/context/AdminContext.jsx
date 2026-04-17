import { createContext, useEffect, useState, useContext } from "react";

export const AdminContext = createContext();

export const AdminProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [loading,setLoading] = useState(true);

  const fetchAdmin = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${import.meta.env.VITE_API_URL}/admin`, {
        credentials: "include",
      });
      const data = await response.json();
      if (response.ok) {
        setAdmin(data);
      } else {
        setAdmin(null);
      }
    } catch (error) {
      console.error("Error fetching admin:", error);
      setAdmin(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdmin();
  }, []);

  return (
    <AdminContext.Provider value={{ admin, setAdmin, loading }}>
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => {
  return useContext(AdminContext);
};
