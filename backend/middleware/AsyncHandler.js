const AsyncHandler = (controller) => (req, res, next) => 
Promise.resolve(controller(req, res, next)).catch(next);

export default AsyncHandler;