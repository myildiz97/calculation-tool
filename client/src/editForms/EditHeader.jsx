const EditHeader = ({ register, errors, name, defaultValue, type="text", index }) => {
  return (
    <div className="form-inputs">
      <label htmlFor={`input-page-edit-${name}`}>{name.charAt(0).toUpperCase() + name.slice(1)}: </label>
      <input
        id={`input-page-edit-${name}`}
        type={type}
        {...register(`${name}[${index}]`)} 
        defaultValue={defaultValue}
      />
      {errors?.[name]?.[index] && <p className="errors">{errors?.[name]?.[index].message}</p>}
    </div>
  );
};
export default EditHeader;