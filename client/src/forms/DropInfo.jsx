import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from "react-hot-toast";
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import axios from 'axios';

const schema = z.object({
  name: z
    .string()
    .nonempty("Name is required!"),
  surname: z
    .string()
    .nonempty("Surname is required!"),
  phone: z
    .string()
    .regex(/^(\+\d{1,2}\s?)?0?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{2}[\s.-]?\d{2}$/, "Invalid phone number!")
    .nonempty("Phone number is required!"),
});

const DropInfo = () => {
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);

  const { handleSubmit, register, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = async ({ name, surname, phone }) => {
    setIsLoading(true);
    try {
      const { data } = await axios.post("/api/customers/create/", { name, surname, phone });
      if (data.error) {
        toast.error(data?.error);
        setIsLoading(false);
      } else {
        toast.success("Your info successfully sent us!");
        setTimeout(() => navigate("/apps"), 2000);
      };
    } catch (error) {
      setIsLoading(false);
      console.error(error);
    }
  }

  return (
    <div className="drop-info-form-wrapper">
      <hr className="page-hr" style={{marginTop: "20px"}} />
      <h2 style={{color: "#fff", margin: "20px 0"}}>For more information, please fill in the form below...</h2>
      <form noValidate onSubmit={handleSubmit(onSubmit)} className="drop-info-form">
        <div className="form-inputs">
          <label htmlFor="drop-name">Name: </label>
          <input 
            id="drop-name" 
            type="text" 
            {...register("name")}
            placeholder="Mehmet" 
          />
          {errors?.name && <p className="errors">{errors?.name?.message}</p>}
        </div>
        <div className="form-inputs">
          <label htmlFor="drop-surname">Surname: </label>
          <input 
            id="drop-surname" 
            type="text" 
            {...register("surname")} 
            placeholder="Yıldız"
          />
          {errors?.surname && <p className="errors">{errors?.surname?.message}</p>}
        </div>
        <div className="form-inputs">
          <label htmlFor="drop-phone">Phone Number: </label>
          <input 
            id="drop-phone" 
            type="tel" 
            {...register("phone")} 
            placeholder="(+90) 555 123 45 67"
          />
          {errors?.phone && <p className="errors">{errors?.phone?.message}</p>}
        </div>
        <button type="submit">
          {isLoading
            ? <div className="loader"></div>
            : "Submit"}
        </button>
      </form>
    </div>
  );
};

export default DropInfo;