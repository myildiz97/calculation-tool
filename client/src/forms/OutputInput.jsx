const OutputInput = ({ inputNumbers=["0"], register, errors, index }) => {

  return (
    <div className="custom-inputs">
      {inputNumbers.map((input, i) => (
        <div key={index + "--" + i}>
          <div className="form-inputs">
            <label htmlFor={`name-output-${i}`}>{i + 1}. Name: </label>
            <input 
              id={`name-output-${i}`}
              type="text"
              {...register(`outputName[${i}]`)}
              placeholder="Sale price"
            />
            {errors?.outputName?.[i] && <p className="errors">{errors?.outputName?.[i]?.message}</p>}
          </div>
          <div className="form-inputs">
            <label htmlFor={`value-output-${i}`}>{i + 1}. Value: </label>
            <input 
              id={`value-output-${i}`}
              type="text"
              {...register(`outputValue[${i}]`)}
              placeholder="(varX+varY)*100"
            />
            {errors?.outputValue?.[i] && <p className="errors">{errors?.outputValue?.[i]?.message}</p>}
          </div>
          <div className="form-inputs">
            <label htmlFor={`unit-output-${i}`}>{i + 1}. Unit: </label>
            <input 
              id={`unit-output-${i}`}
              type="text"
              {...register(`outputUnit[${i}]`)}
              placeholder="meter"
            />
            {errors?.outputUnit?.[i] && <p className="errors">{errors?.outputUnit?.[i]?.message}</p>}
          </div>
        </div>
      ))}
    </div>
  );
};

export default OutputInput;