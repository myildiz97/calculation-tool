import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import axios from "axios";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from 'react';
import { USER_ROLES } from '../../../server/constants/constans';

const schema = z.object({
  email: z
    .string()
    .nonempty("Email is required!")
    .regex(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i, "Invalid email address"),
  password: z
    .string()
    .nonempty("Password is required!")
    .min(8, "Password should be at least 8 characters"),
});

const Login = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    axios.get("/api/users/currentuser/")
      .then(({ data }) => {
        data?.role === USER_ROLES[1] && navigate("/admin")
      })
      .catch((err) => console.error(err));
  }, [])

  const { handleSubmit, register, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = async ({ email, password }) => {
    setIsLoading(true);
    try {
      const { data } = await axios.post("/api/users/login/", { email, password });
      if (data.error) {
        toast.error(data?.error);
        setIsLoading(false);
      } else {
        toast.success("Login is successfull!");
        data?.role === USER_ROLES[1] ? navigate("/admin") : setTimeout(() => navigate(0), 2000);
      };

    } catch (error) {
      setIsLoading(false);
      console.error(error);
    }
  };

  return (
    <div className="wrapper">
      <h1 className="form-h1">Login</h1>
      <form noValidate onSubmit={handleSubmit(onSubmit)} className="log-reg-form">
        <div className="form-inputs">
          <label htmlFor="login-email">Email: </label>
          <input 
            id="login-email" 
            type="email" 
            {...register("email")}
            placeholder="example@mail.com" 
          />
          {errors?.email && <p className="errors">{errors?.email?.message}</p>}
        </div>
        <div className="form-inputs">
          <label htmlFor="login-pass">Password: </label>
          <input 
            id="login-pass" 
            type="password" 
            {...register("password")} 
            placeholder="********"
          />
          {errors?.password && <p className="errors">{errors?.password?.message}</p>}
        </div>
        <button type="submit">
          {isLoading
            ? <div className="loader"></div>
            : "Login"}
        </button>
      </form>
    </div>
  );
};

export default Login;