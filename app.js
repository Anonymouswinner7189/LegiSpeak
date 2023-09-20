const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const multer = require("multer");
const OpenAI = require("openai");
const dotenv = require("dotenv");
const readlineSync = require("readline-sync");
const colors = require("colors");
dotenv.config();

const openai = new OpenAI({
  apiKey: "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",
});

import("node-fetch").then((nodeFetch) => {
    const fetch = nodeFetch.default;
});

const app = express();

app.use(express.static('public'));
app.set("view engine","ejs");

mongoose.connect("mongodb://localhost:27017/SIHDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const ocrSchema = new mongoose.Schema({
    text: String,
});

const OcrModel = mongoose.model("Ocr", ocrSchema);
const Simplified = mongoose.model("Ocr", ocrSchema);

const storage = multer.memoryStorage(); // Store file in memory
const upload = multer({ storage: storage });


app.get("/", (req, res) => {
  res.sendFile("/public/index.html", { root: __dirname });
});

app.post("/upload", upload.single("file"), (req, res) => {
  if (!req.file) {
    return res.status(400).send("No file uploaded.");
  }

  const api =
    "https://script.google.com/macros/s/AKfycbxWmRtGosjGT-vFXTJ96dOVGhh8t-bD9FlxgO3pn1EwQKNHAn9ozO2mq5x5xTgqa6py/exec";

  const fileData = req.file.buffer.toString("base64");

  fetch(api, {
    method: "POST",
    body: JSON.stringify({
      file: fileData,
      type: req.file.mimetype,
      name: req.file.originalname,
    }),
  })
    .then((response) => response.text())
    .then((data) => {
      // const ocrResult = new OcrModel({ text: data });
      // ocrResult.save();
      const fun = async (data) => {
        const prompt =
          "Please simplify this legal document for me, as if you were a lawyer. Make it easy to understand for someone without legal knowledge. Explain any difficult words, and clarify the document's purpose and consequences using concise language. Summarise in 250 words.";
      
        // const prompt = "Simplify the sentences of this given text.Summarise in 250 words."
      
        const userInput = data;
      
        const chatCompletion = await openai.chat.completions.create({
          model: "gpt-3.5-turbo",
          messages: [{ role: "user", content: prompt + "\n" + userInput }],
          max_tokens: 100,
        });
      
        res.render("list",{summary : chatCompletion.choices[0].message.content});
      };

      fun(data);

    })
    .catch((error) => {
      console.error("Error during OCR : ", error);
      res.status(500).send("Error during processing.");
    });
});

app.post("/templates",(req,res)=>{
    res.sendFile("/public/templates.html", { root: __dirname });
});

app.post("/will",(req,res)=>{
    res.sendFile("/public/registration.html", { root: __dirname });
});

app.listen(3000, () => {
  console.log("Server started running on port 3000");
});
