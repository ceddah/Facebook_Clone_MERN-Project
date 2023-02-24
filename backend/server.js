const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const fileUpload = require("express-fileupload");
const { readdirSync } = require("fs");
const path = require("path");
if (process.env.NODE_ENV !== "PRODUCTION") {
  require("dotenv").config({});
}
const app = express();
const PORT = process.env.PORT || 4040;

app.use(express.json());
app.use(cors());
// app.use(
//   cors({
//     origin: "http://localhost:3000",
//     optionSuccessStatus: 200,
//   })
// );
app.use(
  fileUpload({
    useTempFiles: true,
  })
);
const commandDir = path.join(__dirname, "routes");
readdirSync(commandDir).map((route) => app.use("/api/", require("./routes/" + route)));

if (process.env.NODE_ENV === "PRODUCTION") {
  app.use(express.static(path.join(__dirname, "../frontend/build")));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "../frontend/build/index.html"));
  });
}

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
