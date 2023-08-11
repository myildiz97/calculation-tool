// import { useState } from "react";
// import { AiFillFileAdd } from "react-icons/ai";

// const ImageContainer = ({ register, schema }) => {
//   const [backgroundImage, setBackgroundImage] = useState(null);

//   return (
//     <div className={`image-uploader ${backgroundImage ? "has-image" : ""}`}>
//       <div
//         className="image-container"
//         style={{ backgroundImage: `url(${backgroundImage})` }}
//       >
//         {/* {backgroundImage ? null : ( */}
//           {/* <> */}
//             <label htmlFor="imageInput" className="upload-button">
//               <AiFillFileAdd />
//             </label>
//             <input
//               type="file"
//               id="imageInput"
//               accept="image/*"
//               onChange={(e) => setBackgroundImage(URL.createObjectURL(e.target.files[0]))}
//               ref={register(schema)}
//               name="image"
//             />
//           {/* </> */}
//         {/* )} */}
//       </div>
//     </div>
//   );
// };

// export default ImageContainer;