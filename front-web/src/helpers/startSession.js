module.exports = function(user) {
  // Store user in local browser session
  sessionStorage.setItem("user", JSON.stringify(user));
};