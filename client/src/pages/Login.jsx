import { useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();

  const [userData, setUserData] = useState({
    email: "",
    password: "",
  });

  const loginUser = async (e) => {
    e.preventDefault();

    const { email, password } = userData;

    try {
      const { data } = await axios.post("/login", { email, password });

      if (data.error) {
        toast.error(data.error);
      } else {
        setUserData({});
        toast.success("Login is successfull!");
        navigate("/admin");
      };

    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <form onSubmit={loginUser}>
        <label htmlFor="login-email">Email</label>
        <input 
          id="login-email"
          type="email"
          placeholder="example@mail.com"
          value={userData.email}
          onChange={(e) => setUserData({...userData, email: e.target.value})}
        />
        <label htmlFor="login-pass">Password</label>
        <input 
          id="login-pass"
          type="password" 
          placeholder="********"
          value={userData.password}
          onChange={(e) => setUserData({...userData, password: e.target.value})}
        />
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;