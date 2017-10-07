var express = require('express')
const app = express()
app.listen(8000, () => console.log("IT'S WORKING!!!"));

app.use(function (req, res, next) {
	console.log("first layer.");
	res.setHeader("Access-Control-Allow-Origin", 'http://localhost:3000');
	next();
})

app.post("/test", (req, res) => {
	console.log ("called the server! Aww, yeah!")
})