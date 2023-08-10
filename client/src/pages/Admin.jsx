import { useEffect, useState } from "react";
import axios from "axios";

const Admin = () => {
  const [user, setUser] = useState({});

  useEffect(() => {
    axios.get("/")
      .then(({ data }) => setUser(data))
      .catch((err) => console.log(err));
  }, []);

  return (
    user && <h1>{user.email}</h1>
  );
};

export default Admin;