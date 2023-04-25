import Joi from "joi";

export const transacaoSchema = Joi.object({
    valor: Joi.number().positive().required(),
    descricao: Joi.required(),
    tipo: Joi.string().valid("entrada", "saida"),
})