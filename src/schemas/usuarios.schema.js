import Joi from "joi";

export const usuarioSchema = Joi.object({
    nome: Joi.required(),
    email: Joi.string().email().required(),
    senha: Joi.string().min(3).required()
})

