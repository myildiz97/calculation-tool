import { AiFillFileAdd } from "react-icons/ai";

const ImageContainer = ({ register, errors, backgroundImage, setBackgroundImage }) => {
  return (
    <div className="form-inputs">
      <div 
        className="image-container" 
        style={{ backgroundImage: `url(${backgroundImage})` }}
      >
        <label htmlFor="imageInput" className="upload-button">
          <AiFillFileAdd />
        </label>
        <input
          type="file"
          id="imageInput"
          accept="image/*"
          {...register("image", { 
            required: true,
            onChange: (e) => setBackgroundImage(URL.createObjectURL(e.target.files[0]))
          })}
        />
      </div>
      {errors?.image && <p className="errors">{errors?.image?.message}</p>}
    </div>
  );
};

export default ImageContainer;