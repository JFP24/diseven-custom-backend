import mongoose from "mongoose";

const ProyectoSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
  name:   { type: String, required: true, trim: true, minlength: 2, maxlength: 80 },
}, { timestamps: true, collection: "proyectos" });

// Un nombre de proyecto no se puede repetir para el MISMO usuario
ProyectoSchema.index({ userId: 1, name: 1 }, { unique: true });

export default mongoose.model("Proyecto", ProyectoSchema);
