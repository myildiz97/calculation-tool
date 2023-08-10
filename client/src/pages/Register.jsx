import axios from "axios";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { USER_ROLES } from "../../../server/constants/constans";

const schema = z.object({
  fullName: z
    .string(),
  email: z
    .string()
    .regex(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i, "Invalid email address"),
  password: z
    .string()
    .min(8, "Password should be at least 8 characters"),
  role: z
    .enum(USER_ROLES, "User role must be selected"),
});

const Register = () => {
  const navigate = useNavigate();

  const { handleSubmit, register, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = async ({ fullName, email, password, role }) => {
    try {
      const { data } = await axios.post("/register", { fullName, email, password, role });

      if (data.error) {
        toast.error(data.error);
      } else {
        toast.success("Registration is successfully completed!");
        navigate("/login");
      };

    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="wrapper">
      <h1 className="form-h1">Register</h1>
      <form noValidate onSubmit={handleSubmit(onSubmit)} className="log-reg-form">
        <div className="form-inputs">
          <label htmlFor="reg-name">Full Name: </label>
          <input 
            id="reg-name" 
            type="text" 
            {...register("fullName")}
            placeholder="Mehmet Yıldız" 
          />
          {errors?.fullName && <p className="errors">{errors?.fullName?.message}</p>}
        </div>
        <div className="form-inputs">
          <label htmlFor="reg-email">Email: </label>
          <input 
            id="reg-email" 
            type="email" 
            {...register("email")} 
            placeholder="example@mail.com"
          />
          {errors?.email && <p className="errors">{errors?.email?.message}</p>}
        </div>
        <div className="form-inputs">
          <label htmlFor="reg-pass">Password: </label>
          <input 
            id="reg-pass" 
            type="password" 
            {...register("password")}
            placeholder="********" 
          />
          {errors?.password && <p className="errors">{errors?.password?.message}</p>}
        </div>
        <div className="form-inputs">
          <label htmlFor="reg-selection">Role: </label>
          <select id="reg-selection" {...register("role")}>
            <option value="" disabled>Set user's role...</option>
            <option value={USER_ROLES[0]}>Customer</option>
            <option value={USER_ROLES[1]}>Admin</option>
          </select>
          {errors?.role && <p className="errors">{errors?.role?.message}</p>}
        </div>
        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default Register;