const EditCustomOutput = ({ register, errors, index,
  outputName, outputValue, outputUnit }) => {
  
  return (
    <div className="custom-inputs">
      {outputValue?.map((val, i) => (
        <div key={index + "-editout-" + i}>
          <div className="form-inputs">
            <label htmlFor={`name-output-edit-${i}`}>{i + 1}. Name: </label>
            <input 
              id={`name-output-edit-${i}`}
              type="text"
              {...register(`outputName.${i}`)}
              defaultValue={outputName?.[i]}
            />
            {errors?.outputName?.[i] && <p className="errors">{errors?.outputName?.[i]?.message}</p>}
          </div>
          <div className="form-inputs">
            <label htmlFor={`value-output-${i}`}>{i + 1}. Value: </label>
            <input 
              id={`value-output-${i}`}
              type="text"
              {...register(`outputValue.${i}`)}
              defaultValue={val}
            />
            {errors?.outputValue?.[i] && <p className="errors">{errors?.outputValue?.[i]?.message}</p>}
          </div>
          <div className="form-inputs">
            <label htmlFor={`unit-output-${i}`}>{i + 1}. Unit: </label>
            <input 
              id={`unit-output-${i}`}
              type="text"
              {...register(`outputUnit.${i}`)}
              defaultValue={outputUnit?.[i]}
            />
            {errors?.outputUnit?.[i] && <p className="errors">{errors?.outputUnit?.[i]?.message}</p>}
          </div>
        </div>
      ))}
    </div>
  )
}

export default EditCustomOutput