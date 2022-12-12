const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const { readdirSync } = require("fs");
require("dotenv").config({});
const app = express();
const PORT = process.env.PORT || 4040;

app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:3000",
    optionSuccessStatus: 200,
  })
);

readdirSync("./routes").map((route) => app.use("/", require("./routes/" + route)));

mongoose.set("strictQuery", true);
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
  })
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on PORT: ${PORT}.`);
    });
  })
  .catch((err) => console.log(err));
