import { Router } from "express";
import { signIn, signUp } from "../controllers/usuario.controller.js";
import { usuarioSchema } from "../schemas/usuarios.schema.js";
import { validateSchema } from "../middlewares/validateSchema.middleware.js";

const usuarioRouter = Router();

usuarioRouter.post("/cadastro", validateSchema(usuarioSchema), signUp);
usuarioRouter.post("/login", signIn);

export default usuarioRouter;

//refatorado