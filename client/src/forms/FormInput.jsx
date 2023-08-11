const FormInput = ({ register, errors, name, placeholder, type="text" }) => {
  return (
    <div className="form-inputs">
      <label htmlFor={`input-page-${name}`}>{name.charAt(0).toUpperCase() + name.slice(1)}: </label>
      <input 
        id={`input-page-${name}`} 
        type={type}
        {...register(name)} 
        placeholder={placeholder}
      />
      {errors?.[name] && <p className="errors">{errors?.[name]?.message}</p>}
    </div>
  );
};
export default FormInput;