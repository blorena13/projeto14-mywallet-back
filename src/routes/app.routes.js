import { Router } from "express";
import usuarioRouter from "./usuario.routes.js";
import transacoesRouter from "./transacoes.routes.js";

const router = Router();

router.use(usuarioRouter);
router.use(transacoesRouter);

export default router;

//refatorado