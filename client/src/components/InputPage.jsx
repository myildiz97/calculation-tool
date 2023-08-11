import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
// import axios from "axios";
// import { toast } from "react-hot-toast";
// import { useNavigate } from "react-router-dom";
import CustomInput from '../forms/CustomInput.jsx';
import FormInput from '../forms/FormInput.jsx';
import ImageContainer from '../forms/ImageContainer.jsx';
import { MAX_FILE_SIZE, ACCEPTED_IMAGE_TYPES } from '../constants/constants.js';

const schema = z.object({
  image: z
    .any()
    .refine((files) => files?.length !== 0, "Image is required.")
    .refine((files) => files?.[0]?.size <= MAX_FILE_SIZE, `Max file size is 50MB.`)
    .refine(
      (files) => ACCEPTED_IMAGE_TYPES.includes(files?.[0]?.type),
      ".jpg, .jpeg, .png and .webp files are accepted."
    ),
  title: z
    .string()
    .nonempty("Title is required!"),
  description: z
    .string()
    .nonempty("Description is required!"),
  placeholder: z.array(z
    .string()
    .nonempty("Placeholder is required!")
  ),
  variableName: z.array(z
    .string()
    .nonempty("Variable is required!")
    .refine((value) => isNaN(Number(value)), "Variable name cannot be just a number")
  ),
});

const InputPage = () => {
  // const navigate = useNavigate();

  const [backgroundImage, setBackgroundImage] = useState(null);
  const [numberOfVars, setNumberOfVars] = useState(null);
  const [inputNumbers, setInputNumbers] = useState([]);
  const [numberError, setNumberError] = useState(null);

  const { handleSubmit, register, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = (data) => {
    setBackgroundImage(URL.createObjectURL(data.image[0]));
    console.log(data);
  };

  return (
    <>
      {
        inputNumbers.length < 1 ? (
          <div className="form-inputNums">
            <label htmlFor="inputNumber">Enter the number of variable inputs: </label>
            <div>
              <input type="number" id="inputNumber" placeholder="3" min="0" onChange={(e) => setNumberOfVars(e.target.value)} />
              <button onClick={() => {
                if (!numberOfVars) setNumberError("Input number must be entered");
                if (numberOfVars < 0) {
                  setNumberError("Input number cannot be negative!");
                } else {
                  const array = Array.from({ length: numberOfVars }, (_, index) => index.toString());
                  setInputNumbers(array);
                }
            }}>Get Variables</button>
            </div>
            {numberError && <p className="errors">{numberError}</p>}
          </div>
        ) : (
          <div className="input-page">
            <form noValidate onSubmit={handleSubmit(onSubmit)} className="input-page-form">
              <ImageContainer
                register={register}
                errors={errors}
                backgroundImage={backgroundImage}
                setBackgroundImage={setBackgroundImage}
                />
              <FormInput
                register={register}
                errors={errors}
                name={"title"}
                placeholder={"How many rooms and bathrooms are there in your home?"}
                />
              <FormInput
                register={register}
                errors={errors}
                name={"description"}
                placeholder={"Fill in the following details about your home."}
                />
              <CustomInput register={register} errors={errors} inputNumbers={inputNumbers} />
              <button type="submit">Submit</button>
            </form>
          </div>
        )
      }
    </>
  );
};

export default InputPage;