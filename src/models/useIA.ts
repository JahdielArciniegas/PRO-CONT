import mongoose from "mongoose";

const useIaSchema = new mongoose.Schema({
  userId: String,
});

useIaSchema.set("toJSON", {
  transform: (_document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

const useIaModel = mongoose.model("useIA", useIaSchema);

export default useIaModel;
