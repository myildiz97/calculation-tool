import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import InputPage from "../components/InputPage.jsx";

const Admin = () => {
  const navigate = useNavigate();

  const [user, setUser] = useState({});
  const [inputPageNumber, setInputPageNumber] = useState(0);

  useEffect(() => {
    axios.get("/")
      .then(({ data }) => data?.role === "Admin" ? setUser(data) : navigate("/login"))
      .catch((err) => console.log(err));
  }, []);

  return (
    <div className="wrapper">
      <h1>Admin Panel</h1>
      {user && <h2>Welcome {user.fullName}!</h2>}
      <InputPage />
    </div>
  );
};

export default Admin;