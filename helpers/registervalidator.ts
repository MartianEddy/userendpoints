import Joi from "joi";

 export const Registerschema=Joi.object({
    fullname:Joi.string().required(),
    email:Joi.string().email(),
    password:Joi.string().required().min(6).max(20)
})