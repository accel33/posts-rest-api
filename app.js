const express = require("express");

const feedRoutes = require("./routes/feed");

const app = express();

app.use("/feed", feedRoutes);

// We could do routes in here using, app.use / app.post / app.put('/path') etc. But we will use the express router again

app.listen(8080);
