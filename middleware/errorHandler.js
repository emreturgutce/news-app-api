module.exports = (err, req, res, next) => {
  res.status = res.status < 300 ? 500 : res.status;
  res.json({ message: err.message });
};
