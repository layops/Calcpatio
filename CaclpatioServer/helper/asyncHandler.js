/**
 * Wraps an async Express handler so rejected promises are forwarded
 * to the global error handler instead of leaving the request hanging.
 */
module.exports = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};
