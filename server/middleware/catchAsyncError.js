const catchAsyncError = (TheFunc) => (req, res, next) => {
  Promise.resolve(TheFunc(req, res, next)).catch(next);
};

export default catchAsyncError;
