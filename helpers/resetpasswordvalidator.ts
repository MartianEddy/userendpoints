import Joi from "joi";

export const resetPasswordSchema = Joi.object({
    password: Joi.string().required().min(6).max(20)
})