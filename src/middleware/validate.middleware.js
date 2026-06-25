// Valida req.body contra un esquema zod. Si falla, responde 400 con detalles.
// Si pasa, reemplaza req.body por los datos ya parseados/saneados.
export const validate = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({
      message: "Datos inválidos",
      errors: result.error.flatten().fieldErrors,
    });
  }
  req.body = result.data;
  next();
};
