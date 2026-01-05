const AppError = require("../utils/AppError");
const prisma = require("../../prisma");
const catchAsyncPrismaError = require("../utils/catchAsyncPrismaError");

const createCompanyService = async (payload) => {
    try {
        const { parentCompanyId } = payload;

        if (parentCompanyId) {
            const parentCompany = await prisma.company.findUnique({
                where: { id: parentCompanyId },
            });
            if (!parentCompany) {
                throw new AppError("Parent company not found", 404);
            }
        }

        return await prisma.company.create({ data: payload });
    } catch (err) {
        console.log(err.meta, 'erro');

        throw catchAsyncPrismaError(err);
    }
};


const companyUpdateService = async (payload) => {
    try {
        const { id } = payload;

        const company = await prisma.company.findUnique({
            where: { id },
        });
        if (!company) {
            throw new AppError("Company not found", 404);
        }

        return await prisma.company.update({ where: { id }, data: payload });
    } catch (err) {
        throw catchAsyncPrismaError(err);
    }
}


module.exports = { createCompanyService, companyUpdateService };