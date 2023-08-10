import { useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState({
    fullName: "",
    email: "",
    password: "",
  });

  const registerUser = async (e) => {
    e.preventDefault();
    
    const { fullName, email, password } = userData;

    try {
      const { data } = await axios.post("/register", { fullName, email, password });

      if (data.error) {
        toast.error(data.error)
      } else {
        setUserData({});
        toast.success("Registration is successfully completed!");
        navigate("/login");
      };

    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <form onSubmit={registerUser}>
        <label htmlFor="register-name">Full Name: </label>
        <input 
          type="text" 
          placeholder="Mehmet Yıldız" 
          id="register-name" 
          value={userData.fullName} 
          onChange={(e) => setUserData({...userData, fullName: e.target.value})} 
        />
        <label htmlFor="register-email">Email: </label>
        <input 
          type="email" 
          placeholder="example@mail.com" 
          id="register-email"
          value={userData.email} 
          onChange={(e) => setUserData({...userData, email: e.target.value})} 
        />
        <label htmlFor="register-pass">Password: </label>
        <input 
          type="password" 
          placeholder="*******" 
          id="register-pass"
          value={userData.password} 
          onChange={(e) => setUserData({...userData, password: e.target.value})} 
        />
        <button type="submit">Submit</button>
      </form>
    </div>
  )
}

export default Register