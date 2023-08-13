import { Link, NavLink, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { useState, useEffect } from "react";

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [user, setUser] = useState(null);
  
  useEffect(() => {
    axios.get("/")
      .then(({ data }) => setUser(data))
      .catch((err) => console.log(err));
  }, [location.pathname]);

  const activeStyleLoginAdmin = {
    textDecoration: "underline",
    color: "#118ab2",
    fontSize: "1.25em"
  };

  const activeStyleRegister = {
    textDecoration: "underline",
    color: "#003049",
    fontSize: "1.25em"
  };

  const handleLogout = async () => {
    try {
      const response = await axios.post("/logout");
      if (response.status === 200) {
        navigate("/login");
        navigate(0);
      } else {
        throw new Error("Failed to logout!");
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <header>
      <nav>
        {!user ? (
          <>
            <NavLink
              to="/login"
              style={({isActive}) => isActive ? activeStyleLoginAdmin : null}
              >
              Login
            </NavLink>

            <NavLink
              to="/register"
              style={({isActive}) => isActive ? activeStyleRegister : null}
              >
              Register
            </NavLink>
          </>
        ) : (
          <>
            <NavLink
              to="/admin"
              style={({isActive}) => isActive ? activeStyleLoginAdmin : null}
            >
              Admin
            </NavLink>
            <Link onClick={handleLogout}>Logout</Link>
          </>
        )}
      </nav>
    </header>
  );
};

export default Header;