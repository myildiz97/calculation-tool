import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import axios from "axios";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import EditCustomInput from '../editForms/EditCustomInput.jsx';
import EditCustomOutput from '../editForms/EditCustomOutput.jsx';
import EditHeader from '../editForms/EditHeader.jsx';
import EditImage from '../editForms/EditImage.jsx';
import EditCalculation from '../editForms/EditCalculation.jsx';
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
  calculation: z.array(z
    .string()
    .nonempty("Calculation setting is required!")),
});

const EditPageComp = ({ page }) => {
  const { _id , image, title, description, placeholder,
   variableName, outputName, outputValue, outputUnit,
   calculation } = page;

  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);

  const { handleSubmit, register, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data) => {
    setIsLoading(true);

    const { image, title, description, placeholder, variableName, 
      outputName, outputValue, outputUnit, calculation } = data;

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
      formData.append("calculation", calculation[i]);
    }

    try {
      const { data } = await axios.put(`/admin/edit/${_id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        }});

      if (data.error) {
        toast.error(data.error);
        setIsLoading(false);
      } else {
        toast.success("Pages are successfully modified!");
        navigate("/app");
      };

    } catch (error) {
      setIsLoading(false);
      console.error(error);
    }

  };

  return (
    <>
      {image.map((p, index) => (
        <div className="edit-single-page" key={`edit-single-${index}`}>
          <h2 className="input-page-heading">
            Configuration of 
            {index + 1 !== image.length ? ` Page ${index + 1}` : " Output Page"}
          </h2>
          <br />
          <form noValidate onSubmit={handleSubmit(onSubmit)} className="input-page-form">
            <EditImage 
              register={register}
              errors={errors}
              image={image}
              index={index}
            />
            <EditHeader
              register={register}
              errors={errors}
              name={"title"}
              defaultValue={title?.[index]}
              index={index}
            />
            <EditHeader
              register={register}
              errors={errors}
              name={"description"}
              defaultValue={description?.[index]}
              index={index}
            />
            {
              index + 1 !== image.length 
              ?
               <EditCustomInput
                  register={register} 
                  errors={errors} 
                  index={index}
                  placeholder={placeholder?.[index][0]}
                  variableName={variableName?.[index][0]}
                />
              :
                <EditCustomOutput
                  register={register} 
                  errors={errors} 
                  index={index}
                  outputName={outputName}
                  outputValue={outputValue}
                  outputUnit={outputUnit}
                />
              }

            {image?.length === index + 1 
              ? (
                <>
                  <hr className="page-hr" />
                  <EditCalculation
                    register={register}
                    errors={errors}
                    outputValue={outputValue}
                    calculation={calculation}
                  />
                  <button type="submit" className="page-btn">
                    {isLoading  
                      ? <div className="loader"></div>
                      : "Update"}
                  </button> 
                </>
              )
              : <hr className="page-hr" />}
          </form>
        </div>
      ))}
    </>
  );
};

export default EditPageComp;