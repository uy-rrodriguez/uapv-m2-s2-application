module.exports = function() {
  // Remove user from local browser session
  sessionStorage.removeItem("user");
};