import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Admin = () => {
  const navigate = useNavigate();

  const [user, setUser] = useState({});

  useEffect(() => {
    axios.get("/")
      .then(({ data }) => data?.role === "Admin" ? setUser(data) : navigate("/login"))
      .catch((err) => console.log(err));
  }, []);

  return (
    user && <div className="wrapper">{user.email}</div>
  );
};

export default Admin;