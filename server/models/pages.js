import mongoose from "mongoose";

const pagesSchema = new mongoose.Schema({
  image: [ { type: String }, ],
  title: [ { type: String }, ],
  description: [ { type: String }, ],
  placeholder: [ { type: Array }, ],
  variableName: [ { type: Array }, ],
});

const pagesModel = mongoose.model("Pages", pagesSchema);

export default pagesModel;