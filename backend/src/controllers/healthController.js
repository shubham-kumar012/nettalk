// Health check controller to verify backend status
const getHealthStatus = (req, res) => {
  res.status(200).json({
    status: 'ok',
    message: 'NetTalk backend server is running successfully',
    timestamp: new Date().toISOString()
  });
};

module.exports = {
  getHealthStatus
};
