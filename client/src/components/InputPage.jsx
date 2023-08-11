import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
// import axios from "axios";
// import { toast } from "react-hot-toast";
// import { useNavigate } from "react-router-dom";
import { useState } from 'react';
// import ImageContainer from "./ImageContainer";
import { AiFillFileAdd } from "react-icons/ai";

const MAX_FILE_SIZE = 5000000;
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

const schema = z.object({
  image: z
    .any()
    .refine((files) => files?.length !== 0, "Image is required.")
    .refine((files) => files?.[0]?.size <= MAX_FILE_SIZE, `Max file size is 50MB.`)
    .refine(
      (files) => ACCEPTED_IMAGE_TYPES.includes(files?.[0]?.type),
      ".jpg, .jpeg, .png and .webp files are accepted."
    ),
  title: z.string(),
  description: z.string(),
  placeholder: z.string(),
  variableName: z.string(),
});

const InputPage = () => {
  // const navigate = useNavigate();
  const [backgroundImage, setBackgroundImage] = useState(null);

  const { handleSubmit, register, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = (data) => {
    setBackgroundImage(URL.createObjectURL(data.image[0]));
    console.log(data);
  };
  
  return (
    <div className="input-page">
      <form noValidate onSubmit={handleSubmit(onSubmit)} className="input-page-form">
        <div className="form-inputs">
          <div 
            className="image-container" 
            style={{ backgroundImage: `url(${backgroundImage})` }}
          >
            <label htmlFor="imageInput" className="upload-button">
              <AiFillFileAdd />
            </label>
            <input
              type="file"
              id="imageInput"
              accept="image/*"
              {...register("image", { 
                required: true,
                onChange: (e) => {
                  setBackgroundImage(URL.createObjectURL(e.target.files[0]))
                }
              })}
            />
          </div>
          {errors?.image && <p className="errors">{errors?.image?.message}</p>}
        </div>
        <div className="form-inputs">
          <label htmlFor="input-page-titles">Title: </label>
          <input 
            id="input-page-title" 
            type="text" 
            {...register("title")} 
            placeholder="How many rooms and bathrooms are there in your home?"
          />
          {errors?.title && <p className="errors">{errors?.title?.message}</p>}
        </div>
        <div className="form-inputs">
          <label htmlFor="input-page-desc">Description: </label>
          <input 
            id="input-page-desc" 
            type="text" 
            {...register("description")} 
            placeholder="Fill in the following details about your home."
          />
          {errors?.description && <p className="errors">{errors?.description?.message}</p>}
        </div>
        <div className="custom-inputs">
          <div className="form-inputs">
            <label htmlFor="input-page-placeholder-1">Placeholder 1: </label>
            <input 
              id="input-page-placeholder-1"
              type="text"
              {...register("placeholder")} 
              placeholder="Enter custom placeholder..."
            />
            {errors?.placeholder && <p className="errors">{errors?.placeholder?.message}</p>}
          </div>
          <div className="form-inputs">
            <label htmlFor="input-page-variable-1">Variable 1: </label>
            <input 
              id="input-page-variable-1"
              type="text"
              {...register("variableName")} 
              placeholder="Enter custom placeholder..."
            />
            {errors?.variableName && <p className="errors">{errors?.variableName?.message}</p>}
          </div>
        </div>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default InputPage;