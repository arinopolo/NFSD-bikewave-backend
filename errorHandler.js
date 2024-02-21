const errorHandler = (err, req, res, next) => {
  console.error("Error:", err);
  res
    .status(500)
    .json({ error: "Internal Server Error:", err, success: false });
};

module.exports = errorHandler;
