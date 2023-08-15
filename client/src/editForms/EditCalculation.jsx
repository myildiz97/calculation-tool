const EditCalculation = ({ register, errors, outputValue, calculation }) => {

  return (
    <>
      <h2 className="input-page-heading">Calculation Settings</h2>
      {
        outputValue?.every(o => o.length > 0) && outputValue?.map((val, index) => (
          <div className="form-inputs" key={val + "edit" + index}>
            <label htmlFor={`calc-edit-${index}`}>{val}= </label>
            <input 
              id={`calc-edit-${index}`} 
              type="text"
              {...register(`calculation.${index}`)} 
              defaultValue={calculation[index]}
            />
            {errors?.calculation?.[index] && <p className="errors">{errors?.calculation?.[index].message}</p>}
          </div>
        ))
      }
    </>
  );
};

export default EditCalculation;