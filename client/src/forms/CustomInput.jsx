const CustomInput = ({ inputNumbers=["0"], register, errors, index }) => {
  return (
    <div className="custom-inputs">
      {inputNumbers.map((input, i) => (
        <div key={index + "-" + i}>
          <div className="form-inputs">
            <label htmlFor={`placeholder-${i}`}>{i + 1}. Placeholder: </label>
            <input 
              id={`placeholder-${i}`}
              type="text"
              {...register(`placeholder.${index}.${i}`)}
              placeholder="Enter custom placeholder..."
            />
            {errors?.placeholder?.[index]?.[i] && <p className="errors">{errors?.placeholder?.[index]?.[i]?.message}</p>}
          </div>
          <div className="form-inputs">
            <label htmlFor={`variable-${i}`}>{i + 1}. Variable: </label>
            <input 
              id={`variable-${i}`}
              type="text"
              {...register(`variableName.${index}.${i}`)}
              placeholder="varX"
            />
            {errors?.variableName?.[index]?.[i] && <p className="errors">{errors?.variableName?.[index]?.[i]?.message}</p>}
          </div>
        </div>
      ))}
    </div>
  );
};

export default CustomInput;