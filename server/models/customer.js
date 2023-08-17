import mongoose from "mongoose";

const customerSchema = new mongoose.Schema({
  name: String,
  surname: String,
  phone: String,
}, {
  timestamps: true,
});

const customerModel = mongoose.model("Customers", customerSchema);

export default customerModel;