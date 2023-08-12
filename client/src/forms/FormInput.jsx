const FormInput = ({ register, errors, name, placeholder, type="text", index }) => {
  return (
    <div className="form-inputs">
      <label htmlFor={`input-page-${name}`}>{name.charAt(0).toUpperCase() + name.slice(1)}: </label>
      <input 
        id={`input-page-${name}`} 
        type={type}
        {...register(`${name}[${index}]`)} 
        placeholder={placeholder}
      />
      {errors?.[name]?.[index] && <p className="errors">{errors?.[name]?.[index].message}</p>}
    </div>
  );
};
export default FormInput;