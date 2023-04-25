import { Router } from "express";
import { postTransacaoTipo, getTransacaoTipo, getTransacao } from "../controllers/transacoes.controller.js";
import { transacaoSchema } from "../schemas/transacoes.schemas.js";
import { validateSchema } from "../middlewares/validateSchema.middleware.js";
import { authValidation } from "../middlewares/auth.middleware.js";

const transacoesRouter = Router();

transacoesRouter.use(authValidation);
transacoesRouter.post("/nova-transacao/:tipo", validateSchema(transacaoSchema), postTransacaoTipo);
transacoesRouter.get("/nova-transacao/:tipo", getTransacaoTipo);
transacoesRouter.get("/nova-transacao", getTransacao);

export default transacoesRouter;