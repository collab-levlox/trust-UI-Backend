/**
 * Wrap async Express route handlers and forward errors to next()
 *
 * @param {(req: import('express').Request,
 *          res: import('express').Response,
 *          next: import('express').NextFunction) => Promise<any>} fn
 *
 * @returns {(req: import('express').Request,
 *            res: import('express').Response,
 *            next: import('express').NextFunction) => void}
 */

module.exports = function catchAsync(fn) {
  return function (req, res, next) {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};
