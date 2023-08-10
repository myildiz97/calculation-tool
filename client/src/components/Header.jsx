import { NavLink, useNavigate } from "react-router-dom";
import axios from "axios";
import { useState, useEffect } from "react";

const Header = () => {
  const navigate = useNavigate();

  const [user, setUser] = useState({});

  useEffect(() => {
    axios.get("/")
      .then(({ data }) => setUser(data))
      .catch((err) => console.log(err));
  }, []);

  const activeStyleLogin = {
    textDecoration: "underline",
    color: "#118ab2",
    fontSize: "1.25em"
  };

  const activeStyleRegister = {
    textDecoration: "underline",
    color: "#003049",
    fontSize: "1.25em"
  };

  const activeStyleAdmin = {
    textDecoration: "underline",
    color: "#213ef4",
    fontSize: "1.25em"
  };

  const handleLogout = async () => {
    try {
      const response = await axios.post("/logout");
      if (response.status === 200) {
        navigate("/login");
      };

      if (response.error) {
        throw new Error("Failed to logout!")
      };

    } catch (error) {
      console.error(error);
    }
  };

  return (
    <header>
      <nav>
        <NavLink
          to="/login"
          style={({isActive}) => isActive ? activeStyleLogin : null}
        >
          Login
        </NavLink>

        <NavLink
          to="/register"
          style={({isActive}) => isActive ? activeStyleRegister : null}
        >
          Register
        </NavLink>

        <NavLink
          to="/admin"
          style={({isActive}) => isActive ? activeStyleAdmin : null}
        >
          Admin
        </NavLink>

        <button onClick={handleLogout}>
          Logout
        </button>

      </nav>
    </header>
  );
};

export default Header;