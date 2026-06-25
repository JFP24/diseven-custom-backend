// Envuelve un controlador async y reenvía cualquier error a next()
// para que lo gestione el middleware de errores central.
export const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);
