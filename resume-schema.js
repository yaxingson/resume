import Joi from 'joi'

const resumeSchema = Joi.object({
  basics: Joi.object({
    name: Joi.string(),
    label: Joi.string(),
    email: Joi.string().email(),
    phone: Joi.string()
  })

})

export default resumeSchema
