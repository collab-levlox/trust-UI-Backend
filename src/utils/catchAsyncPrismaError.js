const { Prisma } = require('@prisma/client');
const AppError = require('./AppError');


const extractFieldFromConstraint = (error) => {
  try {
    const msg =
      error.meta?.driverAdapterError?.cause?.originalMessage;

    if (!msg) return null;

    // Example: Company_phone_key → phone
    const match = msg.match(/"_?(.*?)_(.*?)_key"/i);
    return match?.[2] || null;
  } catch {
    return null;
  }
};

const catchAsyncPrismaError = (error, option = {}) => {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    console.log(error, 'prisma error');

    switch (error.code) {

      case 'P2002': {
        const field =
          extractFieldFromConstraint(error) ||
          'unique field';

        return new AppError(
          `Duplicate value for ${field}`,
          409
        );
      }


      case 'P2003':
        return new AppError(
          'Invalid reference / foreign key constraint failed',
          400
        );

      case 'P2025':
        return new AppError(
          'Record not found',
          404
        );

      case 'P2014':
        return new AppError(
          'Relation violation',
          400
        );

      case 'P2000':
        return new AppError(
          'Input value too long',
          400
        );

      default:
        return new AppError(
          'Database error',
          500
        );
    }
  }

  if (error instanceof Prisma.PrismaClientValidationError) {
    return new AppError(
      'Invalid data provided',
      400
    );
  }

  return error; // non-prisma error
};

module.exports = catchAsyncPrismaError;
