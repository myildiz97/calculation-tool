const Calculation = ({ register, errors, outputVars }) => {

  return (
    <>
      <h2 className="input-page-heading">Calculation Settings</h2>
      {
        outputVars?.every(o => o.length > 0) && outputVars?.map((outputVar, index) => (
          <div className="form-inputs" key={outputVar + index}>
            <label htmlFor={`calc${index}`}>{outputVar}= </label>
            <input 
              id={`calc${index}`} 
              type="text"
              {...register(`calculation.${index}`)} 
              placeholder="(x+y)/200"
            />
            {errors?.calculation?.[index] && <p className="errors">{errors?.calculation?.[index].message}</p>}
          </div>
        ))
      }
    </>
  );
};

export default Calculation;