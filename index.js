const express = require('express');
const app = express();
port = 2007;

const authRoutes = require("./routes/auth.router")

app.use(express.json());
app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
    res.send("Hello, World!");
});
console.log("TC up!");
app.listen(port);