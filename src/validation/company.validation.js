const Joi = require('joi');

const createCompanySchema = Joi.object({
  name: Joi.string()
    .min(2)
    .max(255)
    .required(),

  address1: Joi.string()
    .min(5)
    .max(500)
    .required(),

  address2: Joi.string()
    .min(5)
    .max(500)
    .optional()
    .allow(null, ''),

  logoUrl: Joi.string()
    .uri()
    .optional()
    .allow(null, ''),

  email: Joi.string()
    .email()
    .required(),

  phone: Joi.string()
    .pattern(/^[6-9]\d{9}$/)
    .required(),

  gstinNumber: Joi.string()
    .pattern(/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z][1-9A-Z]Z[0-9A-Z]$/)
    .optional()
    .allow(null, ''),

  sacNumber: Joi.string()
    .pattern(/^\d{6}$/)
    .optional()
    .allow(null, ''),

  panNumber: Joi.string()
    .pattern(/^[A-Z]{5}[0-9]{4}[A-Z]$/)
    .optional()
    .allow(null, ''),

  esicNumber: Joi.string()
    .optional()
    .allow(null, ''),

  epfNumber: Joi.string()
    .optional()
    .allow(null, ''),

  serviceTaxNumber: Joi.string()
    .optional()
    .allow(null, ''),

  websiteLink: Joi.string()
    .uri()
    .optional()
    .allow(null, ''),

  documets: Joi.array()
    .items(Joi.string())
    .default([]),
  parentCompanyId: Joi.number()
    .optional()
});


const updateCompanySchema = Joi.object({
  name: Joi.string()
    .min(2)
    .max(255),

  address1: Joi.string()
    .min(5)
    .max(500),

  address2: Joi.string()
    .min(5)
    .max(500)
    .allow(null, ''),

  logoUrl: Joi.string()
    .uri()
    .allow(null, ''),

  email: Joi.string()
    .email(),

  phone: Joi.string()
    .pattern(/^[6-9]\d{9}$/),

  gstinNumber: Joi.string()
    .pattern(/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z][1-9A-Z]Z[0-9A-Z]$/)
    .allow(null, ''),

  sacNumber: Joi.string()
    .pattern(/^\d{6}$/)
    .allow(null, ''),

  panNumber: Joi.string()
    .pattern(/^[A-Z]{5}[0-9]{4}[A-Z]$/)
    .allow(null, ''),

  esicNumber: Joi.string()
    .allow(null, ''),

  epfNumber: Joi.string()
    .allow(null, ''),

  serviceTaxNumber: Joi.string()
    .allow(null, ''),

  websiteLink: Joi.string()
    .uri()
    .allow(null, ''),

  documets: Joi.array()
    .items(Joi.string())
})
.min(1); // 🔥 must update at least one field


module.exports = {
  createCompanySchema,
  updateCompanySchema,
};