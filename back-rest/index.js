var express = require('express')
 
var app = express()
 
app.get('/index', function(req, res) {
  res.json({result: "It's alive!"})
})
 
app.listen(4000)