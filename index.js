const fs = require("fs");
const express = require("express");
const axios = require("axios");
const path = require("path");

const app = express();
const port = process.env.PORT || 8000;

app.use(express.json());
app.use("/public", express.static(path.join(__dirname, "static")));
app.set("view engine", "ejs");

// utilities
const handleGetImages = (data) => {
  return axios.get(`http://xkcd.com/${data}/info.0.json`);
};

// requests

app.get("/", async (req, res) => {
  let rawData = fs.readFileSync("nr.json");
  let data = JSON.parse(rawData);
  const newData = data.map(async (el) => {
    const res = await handleGetImages(el.number);
    return res.data.img;
  });
  Promise.all(newData).then((result) => {
    res.render("index", { data: { imagesArray: result } });
  });
});

app.listen(port, () => console.log(`Listening on  localhot:${port}`));
