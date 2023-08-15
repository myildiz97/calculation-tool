import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { IoMdAddCircleOutline } from "react-icons/io";

const Admin = () => {
  const navigate = useNavigate();

  const [user, setUser] = useState({});
  const [name, setName] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios.get("/")
      .then(({ data }) => data?.role === "Admin" ? setUser(data) : navigate("/login"))
      .catch((err) => console.log(err));
  }, []);

  const handleNewPage = async () => {
    if (name) {
      try {
        const { data } = await axios.get(`/admin?configName=${name}`);
        const { configName, error } = data;
        if (error) setError(error);
        if (configName) {
          setError(null);
          navigate(`/admin/add/${configName}`);
        };
      } catch (error) {
        console.error(error);
      }
    };
  };

  return (
    <div className="wrapper">
      <h1 className="wrapper-heading">Admin Panel</h1>
      {user && <h2 className="wrapper-heading">Welcome {user.fullName}!</h2>}
      <hr className="page-hr"/>
      <div className="add-pages">
        <input 
          type="text"
          placeholder="Enter config name"
          onChange={(e) => setName(e.target.value)}
        />
        <IoMdAddCircleOutline className="new-page-btn" size="40" onClick={handleNewPage} />
      </div>
      <hr className="page-hr"/>
      {error && <p className="errors">{error}</p>}
    </div>
  );
};

export default Admin;