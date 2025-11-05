import mongoose from "mongoose";

const PlantillaSchema = new mongoose.Schema({
  userId:     { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
  projectId:  { type: mongoose.Schema.Types.ObjectId, ref: "Proyecto", required: true, index: true },
  placeName:  { type: String, required: true, trim: true, minlength: 1, maxlength: 100 },
  plateMode:  { type: String, default: "sencilla" },
  preview:       { type: String, default: null },
  previewThumb:  { type: String, default: null },
  snapshot:      { type: Object, required: true },
  savedAt:       { type: Date, default: Date.now },
}, { timestamps: true, collection: "plantillas" });

// (projectId + placeName) único. Como cada project pertenece a un user,
// esto evita duplicados dentro del proyecto del usuario.
PlantillaSchema.index({ projectId: 1, placeName: 1 }, { unique: true });

export default mongoose.model("Plantilla", PlantillaSchema);
