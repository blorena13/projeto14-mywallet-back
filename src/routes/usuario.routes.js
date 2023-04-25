import { Router } from "express";
import { signIn, signUp } from "../controllers/usuario.controller.js";
import { usuarioSchema } from "../schemas/usuarios.schemas.js";
import { validateSchema } from "../middlewares/validateSchema.middleware.js";
import { loginSchema } from "../schemas/login.schemas.js";

const usuarioRouter = Router();

usuarioRouter.post("/cadastro", validateSchema(usuarioSchema), signUp);
usuarioRouter.post("/login", validateSchema(loginSchema) ,signIn);

export default usuarioRouter;

//refatorado