import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState({});

  useEffect(() => {
    axios.get("/")
      .then(({ data }) => {
        setUser(data);
        data && navigate("/admin");
      })
      .catch(() => console.error(error));
  }, []);

  return (
    user && <h1>{user.email}</h1>
  );
};

export default Home