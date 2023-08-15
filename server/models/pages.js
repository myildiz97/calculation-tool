import mongoose from "mongoose";

const pagesSchema = new mongoose.Schema({
  configName: String,
  image: [ { type: String }, ],
  title: [ { type: String }, ],
  description: [ { type: String }, ],
  placeholder: [ { type: Array }, ],
  variableName: [ { type: Array }, ],
  outputName: [ { type: String }, ],
  outputValue: [ { type: String }, ],
  outputUnit: [ { type: String }, ],
  calculation: [ { type: String }, ],
});

const pagesModel = mongoose.model("Pages", pagesSchema);

export default pagesModel;