import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import axios from "axios";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import CustomInput from '../forms/CustomInput.jsx';
import FormInput from '../forms/FormInput.jsx';
import ImageContainer from '../forms/ImageContainer.jsx';
import OutputInput from '../forms/OutputInput.jsx';
import Calculation from '../forms/Calculation.jsx';
import { MAX_FILE_SIZE, ACCEPTED_IMAGE_TYPES } from '../constants/constants.js';

const schema = z.object({
  image: z.array(z
    .any()
    .refine((files) => files?.length !== 0, "File is required.")
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
  outputName: z.array(z
    .string()
    .nonempty("Output name is required!")),
  outputValue: z.array(z
    .string()
    .nonempty("Value is required!")
    .refine((value) => isNaN(Number(value)), "Output value cannot be just a number")),
  outputUnit: z.array(z
    .string()
    .nonempty("Unit is required!")),
});

const InputPage = ({ inputPageNumber }) => {
  const navigate = useNavigate();

  const [numberOfVars, setNumberOfVars] = useState(new Array(inputPageNumber.length - 1).fill(null));
  const [inputNumbers, setInputNumbers] = useState(new Array(inputPageNumber.length - 1).fill([]));
  const [numberError, setNumberError] = useState(new Array(inputPageNumber.length).fill(null));
  const [btnVars, setBtnVars] = useState(new Array(inputPageNumber.length).fill("Set Variable"));

  const [numberOfOutputs, setNumberOfOutputs] = useState(null);
  const [outputNumbers, setOutputNumbers] = useState([]);

  const [pageVars, setPageVars] = useState(new Array(inputPageNumber.length - 1).fill([]).map(() => []));
  const [outputVars, setOutputVars] = useState([]);
  
  const { handleSubmit, register, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data) => {
    const { image, title, description, placeholder, variableName, 
      outputName, outputValue, outputUnit } = data;

    const formData = new FormData();

    for (let i = 0; i < image.length; i++) {
      formData.append("image", image[i][0]);
      formData.append("title", title[i]);
      formData.append("description", description[i]);
      if (i !== image.length - 1) {
        formData.append("placeholder", placeholder[i]);
        formData.append("variableName", variableName[i]);
      };
    };

    for (let i = 0; i < outputName.length; i++) {
      formData.append("outputName", outputName[i]);
      formData.append("outputValue", outputValue[i]);
      formData.append("outputUnit", outputUnit[i]);
    }
    
    try {
      const { data } = await axios.post("/admin", formData);

      if (data.error) {
        toast.error(data.error);
      } else {
        toast.success("Pages are successfully set!");
        navigate("/app");
      };

    } catch (error) {
      console.error(error);
    }

  };

  const handleChange = (index, value, arr, setArr) => {
    const newArr = [...arr];
    newArr[index] = value;
    setArr(newArr);
  };

  const checkInputNums = inputNumbers.filter(i => i.length > 0).length + (outputNumbers.length > 0 && 1) !== inputPageNumber.length;

  return (
    <>
      {
        checkInputNums ? (
          inputPageNumber.map((page, index) => (
            <div key={"page" + index} className="form-inputNums">
                <label htmlFor={`inputNumber-${index}`}>
                  Enter the number of
                  {index !== inputPageNumber.length - 1 ? 
                    ` variable inputs for page ${index + 1}` :
                    ` outputs for the output page`  
                  }
                </label>
              <div>
                <input 
                  type="number" 
                  id={`inputNumber-${index}`} 
                  placeholder="3" min="0" 
                  onChange={(e) => {
                    if (index !== inputPageNumber.length - 1) {
                      handleChange(index, e.target.value, numberOfVars, setNumberOfVars);
                    } else {
                      setNumberOfOutputs(e.target.value);
                    }
                  }} 
                />
                <button onClick={() => {
                  if (index !== inputPageNumber.length - 1) {
                    if (!numberOfVars[index]) handleChange(index, "Input number must be entered", numberError, setNumberError);
                    if (numberOfVars[index] < 0) {
                      handleChange(index, "Input number cannot be negative!", numberError, setNumberError);
                    } else {
                      const array = Array.from({ length: numberOfVars[index]}, (_, i) => i.toString());
                      handleChange(index, array, inputNumbers, setInputNumbers);
                    };
                  } else {
                    if (!numberOfOutputs) handleChange(index, "Output number must be entered", numberError, setNumberError);
                    if (numberOfOutputs< 0) {
                      handleChange(index, "Output number cannot be negative!", numberError, setNumberError);
                    } else {
                      const array = Array.from({ length: numberOfOutputs}, (_, i) => i.toString());
                      setOutputNumbers(array);
                    };
                  };

                  handleChange(index, "Variable Set", btnVars, setBtnVars);
                  setTimeout(() => handleChange(index, "Set Variable", btnVars, setBtnVars), 3000)
                }}>{btnVars[index]}</button>
              </div>
              {numberError[index] && <p className="errors">{numberError[index]}</p>}
            </div>
          ))
        ) : (
          inputPageNumber.map((page, index) => {

            return (
              <div className="input-page" key={"pages - " + index}>
                <h2 className="input-page-heading">
                  Configuration of 
                  {index + 1 !== inputPageNumber.length ? ` Page ${index + 1}` : " Output Page"}
                </h2>
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
                  {
                    index + 1 !== inputPageNumber.length
                    ? <CustomInput 
                        register={register} 
                        errors={errors} 
                        inputNumbers={inputNumbers[index]} 
                        index={index}
                        pageVars={pageVars}
                        setPageVars={setPageVars}
                      />
                    : <OutputInput 
                        register={register} 
                        errors={errors} 
                        outputNumbers={outputNumbers} 
                        index={index}
                        outputVars={outputVars}
                        setOutputVars={setOutputVars}
                        handleChange={handleChange}
                      />
                  }

                  {inputPageNumber.length === index + 1 
                    ? (
                      <>
                        <hr />
                        <Calculation
                          register={register}
                          errors={errors}
                          pageVars={pageVars}
                          outputVars={outputVars}
                        />
                        <button type="submit" className="page-btn">Submit</button> 
                      </>
                    )
                    : <hr className="page-hr" 
                  />}
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