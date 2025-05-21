import mongoose from "mongoose";

const boardSchema = new mongoose.Schema({
  title: String,
  id_user: String,
  pros: [String],
  cons: [String],
});

boardSchema.set("toJSON", {
  transform: (_document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

const boardModel = mongoose.model("board", boardSchema);

export default boardModel;
