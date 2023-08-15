const EditCustomInput = ({ placeholder, variableName, register, errors, index }) => {

  const phArr = placeholder.split(",");
  const varArr = variableName.split(",");

  return (
    <div className="custom-inputs">
      {phArr.map((ph, i) => (
        <div key={index + "-edit-" + i}>
          <div className="form-inputs">
            <label htmlFor={`placeholder-ph-${i}`}>{i + 1}. Placeholder: </label>
            <input 
              id={`placeholder-ph-${i}`}
              type="text"
              {...register(`placeholder.${index}.${i}`)}
              defaultValue={ph}
            />
            {errors?.placeholder?.[index]?.[i] && <p className="errors">{errors?.placeholder?.[index]?.[i]?.message}</p>}
          </div>
          <div className="form-inputs">
            <label htmlFor={`variable-var-${i}`}>{i + 1}. Variable: </label>
            <input 
              id={`variable-var-${i}`}
              type="text"
              {...register(`variableName.${index}.${i}`)}
              defaultValue={varArr?.[i]}
            />
            {errors?.variableName?.[index]?.[i] && <p className="errors">{errors?.variableName?.[index]?.[i]?.message}</p>}
          </div>
        </div>
      ))}
    </div>
  );
};

export default EditCustomInput;