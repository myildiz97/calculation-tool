import { useState } from "react";
import { AiFillFileAdd } from "react-icons/ai";

const EditImage = ( { register, errors, image, index }) => {
  const [backgroundImage, setBackgroundImage] = useState(Array.from({ length: image }, () => null));

  const handleImage = async (index, value) => {
    const newImage = [...backgroundImage];
    newImage[index] = value;
    setBackgroundImage(newImage);
  };

  const baseUrlImg = "http://localhost:5050";

  return (
    <div className="form-inputs">
      <div 
        className="image-container" 
        style={{ backgroundImage: backgroundImage[index] ? `url(${backgroundImage[index]})` : `url(${baseUrlImg}${image?.[index]})` }}
      >
        <label htmlFor={`imageInput-edit-${index}`} className="upload-button">
          <AiFillFileAdd />
        </label>
        <input
          type="file"
          id={`imageInput-edit-${index}`}
          accept="image/*"
          {...register(`image.${index}`, { 
            required: true,
            onChange: (e) => handleImage(index, URL.createObjectURL(e.target.files[0]))
          })}
        />
      </div>
      {errors?.image?.[index] && <p className="errors">{errors?.image?.[index]?.message}</p>}
    </div>
  );
};

export default EditImage;