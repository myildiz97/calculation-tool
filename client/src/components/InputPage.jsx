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
  image: z.array(z
    .any()
    .refine((files) => files?.length !== 0, "Image is required.")
    .refine((files) => files?.[0]?.size <= MAX_FILE_SIZE, `Max file size is 50MB.`)
    .refine(
      (files) => ACCEPTED_IMAGE_TYPES.includes(files?.[0]?.type),
      ".jpg, .jpeg, .png and .webp files are accepted."
    )),
  title: z.array(z
    .string()
    .nonempty("Title is required!")),
  description: z.array(z
    .string()
    .nonempty("Description is required!")),
  placeholder: z.array(z.array(z
    .string()
    .nonempty("Placeholder is required!")
  )),
  variableName: z.array(z.array(z
    .string()
    .nonempty("Variable is required!")
    .refine((value) => isNaN(Number(value)), "Variable name cannot be just a number")
  )),
});

const InputPage = ({ inputPageNumber }) => {
  // const navigate = useNavigate();

  const [numberOfVars, setNumberOfVars] = useState(Array.from({ length: inputPageNumber }, () => null));
  const [inputNumbers, setInputNumbers] = useState(Array.from({ length: inputPageNumber }, () => []));
  const [numberError, setNumberError] = useState(Array.from({ length: inputPageNumber }, () => null));

  const { handleSubmit, register, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = (data) => {
    console.log(data);
  };

  const handleVarChange = (index, value) => {
    const newVars = [...numberOfVars];
    newVars[index] = value;
    setNumberOfVars(newVars);
  };

  const handleErrorChange = (index, value) => {
    const newErrors = [...numberError];
    newErrors[index] = value;
    setNumberError(newErrors);
  };

  const handleInputNums = (index, value) => {
    const newInputNums = [...inputNumbers];
    newInputNums[index] = value;
    setInputNumbers(newInputNums);
  };

  const checkInputNums = inputNumbers.filter(i => i.length > 0).length !== inputPageNumber.length;

  return (
    <>
      {
        checkInputNums ? (
          inputPageNumber.map((page, index) => (
            <div key={"page" + index} className="form-inputNums">
              <label htmlFor="inputNumber">Enter the number of variable inputs for page {index + 1}: </label>
              <div>
                <input type="number" id="inputNumber" placeholder="3" min="0" onChange={(e) => handleVarChange(index, e.target.value)} />
                <button onClick={() => {
                  if (!numberOfVars[index]) handleErrorChange(index, "Input number must be entered");
                  if (numberOfVars[index] < 0) {
                    handleErrorChange(index, "Input number cannot be negative!");
                  } else {
                    const array = Array.from({ length: numberOfVars[index] }, (_, i) => i.toString());
                    handleInputNums(index, array);
                  }
              }}>Set Variables</button>
              </div>
              {numberError[index] && <p className="errors">{numberError[index]}</p>}
            </div>
          ))
        ) : (
          inputPageNumber.map((page, index) => {

            return (
              <div className="input-page" key={"pages - " + index}>
                <h2>Configurations of Page {index + 1}</h2>
                <br />
                <form noValidate onSubmit={handleSubmit(onSubmit)} className="input-page-form">
                  <ImageContainer
                    register={register}
                    errors={errors}
                    inputPageNumber={inputPageNumber} 
                    index={index}
                    />
                  <FormInput
                    register={register}
                    errors={errors}
                    name={"title"}
                    placeholder={"How many rooms and bathrooms are there in your home?"}
                    index={index}
                    />
                  <FormInput
                    register={register}
                    errors={errors}
                    name={"description"}
                    placeholder={"Fill in the following details about your home."}
                    index={index}
                    />
                  <CustomInput register={register} errors={errors} inputNumbers={inputNumbers[index]} index={index} />
                  {inputPageNumber.length === index + 1 ? <button type="submit">Submit</button> : <hr className="page-hr" />}
                </form>
              </div>
            )
          })
        )
      }
    </>
  );
};

export default InputPage;