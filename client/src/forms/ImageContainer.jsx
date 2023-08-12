import { AiFillFileAdd } from "react-icons/ai";
import { useState } from "react";

const ImageContainer = ({ register, errors, inputPageNumber, index }) => {

  const [backgroundImage, setBackgroundImage] = useState(Array.from({ length: inputPageNumber }, () => null));

  const handleImage = (index, value) => {
    const newImage = [...backgroundImage];
    newImage[index] = value;
    setBackgroundImage(newImage);
  };

  return (
    <div className="form-inputs">
      <div 
        className="image-container" 
        style={{ backgroundImage: `url(${backgroundImage[index]})` }}
      >
        <label htmlFor={`imageInput-${index}`} className="upload-button">
          <AiFillFileAdd />
        </label>
        <input
          type="file"
          id={`imageInput-${index}`}
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

export default ImageContainer;