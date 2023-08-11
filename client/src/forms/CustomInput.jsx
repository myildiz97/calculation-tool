const CustomInput = ({ inputNumbers=["0"], register, errors }) => {
  return (
    <div className="custom-inputs">
      {inputNumbers.map((input, index) => (
        <div key={index}>
          <div className="form-inputs">
            <label htmlFor={`placeholder-${index}`}>{index + 1}. Placeholder: </label>
            <input 
              id={`placeholder-${index}`}
              type="text"
              {...register(`placeholder.${index}`)}
              placeholder="Enter custom placeholder..."
            />
            {errors?.placeholder?.[index] && <p className="errors">{errors?.placeholder?.[index]?.message}</p>}
          </div>
          <div className="form-inputs">
            <label htmlFor={`variable-${index}`}>{index + 1}. Variable: </label>
            <input 
              id={`variable-${index}`}
              type="text"
              {...register(`variableName.${index}`)}
              placeholder="Enter custom placeholder..."
            />
            {errors?.variableName?.[index] && <p className="errors">{errors?.variableName?.[index]?.message}</p>}
          </div>
        </div>
      ))}
    </div>
  );
};

export default CustomInput;