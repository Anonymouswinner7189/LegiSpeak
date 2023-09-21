const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const multer = require("multer");
const OpenAI = require("openai");
const dotenv = require("dotenv");
const readlineSync = require("readline-sync");
const colors = require("colors");
const { PDFDocument } = require('pdf-lib');
const { readFile, writeFile } = require('fs').promises;
const cors = require("cors");
const path = require('path');
dotenv.config();

const openai = new OpenAI({
  apiKey: "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",
});

import("node-fetch").then((nodeFetch) => {
    const fetch = nodeFetch.default;
});

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(express.static('views'));
app.use(express.json());
app.use(
  cors({
    credentials: true,
    origin: "http://localhost:3000",
  })
);

app.set("view engine","ejs");

// mongoose.connect("mongodb://localhost:27017/SIHDB", {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// });

// const ocrSchema = new mongoose.Schema({
//     text: String,
// });

// const OcrModel = mongoose.model("Ocr", ocrSchema);
// const Simplified = mongoose.model("Ocr", ocrSchema);

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

app.post("/rental",(req,res)=>{
    res.sendFile("/public/rental_agreement.html", { root: __dirname });
});

app.post("/nda",(req,res)=>{
    res.sendFile("/public/nda.html", { root: __dirname });
});

app.post("/fill1",(req,res)=>{
  const name1 = req.body.name1;
  const name2 = req.body.name2;
  const name3 = req.body.name3;
  const name4 = req.body.name4;
  const name5 = req.body.name5;
  const name6 = req.body.name6;
  const name7 = req.body.name7;
  const name8 = req.body.name8;
  const name9 = req.body.name9;
  const name10 = req.body.name10;
  const name11 = req.body.name11;
  const name12 = req.body.name12;
  const name13 = req.body.name13;
  const name14 = req.body.name14;

  async function createPdf(input, output, data) {
    try {
      const pdfDoc = await PDFDocument.load(await readFile(input));
      const form = pdfDoc.getForm();
      const nf = 14;
    
      for (let i = 1; i <= nf; i++) {
        form.getTextField(i.toString()).setText(data['name' + i]);
      }

      const pdfBytes = await pdfDoc.save();
  
      await writeFile(output, pdfBytes);
      console.log('PDF created!');
    } catch (err) {
      console.log(err);
      throw err;
    }
  }

  try {
    const outputPdfBuffer = createPdf('WillAgreement.pdf', 'output1.pdf', {
      name1,
      name2,
      name3,
      name4,
      name5,
      name6,
      name7,
      name8,
      name9,
      name10,
      name11,
      name12,
      name13,
      name14,
    });

    res.status(200).send('PDF created successfully');
  } catch (error) {
    console.error(error);
    res.status(500).send('PDF creation failed');
  }

});

app.post("/fill2",(req,res)=>{
  const name1 = req.body.name1;
  const name2 = req.body.name2;
  const name3 = req.body.name3;
  const name4 = req.body.name4;
  const name5 = req.body.name5;
  const name6 = req.body.name6;
  const name7 = req.body.name7;
  const name8 = req.body.name8;
  const name9 = req.body.name9;
  const name10 = req.body.name10;

  async function createPdf(input, output, data) {
    try {
      const pdfDoc = await PDFDocument.load(await readFile(input));
      const form = pdfDoc.getForm();
      const nf = 10;
    
      for (let i = 1; i <= nf; i++) {
        form.getTextField(i.toString()).setText(data['name' + i]);
      }

      const pdfBytes = await pdfDoc.save();
  
      await writeFile(output, pdfBytes);
      console.log('PDF created!');
    } catch (err) {
      console.log(err);
      throw err;
    }
  }

  try {
    const outputPdfBuffer = createPdf('Rental.pdf', 'output2.pdf', {
      name1,
      name2,
      name3,
      name4,
      name5,
      name6,
      name7,
      name8,
      name9,
      name10,
    });

    res.status(200).send('PDF created successfully');
  } catch (error) {
    console.error(error);
    res.status(500).send('PDF creation failed');
  }

});

app.post("/fill3",(req,res)=>{
  const name1 = req.body.name1;
  const name2 = req.body.name2;
  const name3 = req.body.name3;
  const name4 = req.body.name4;
  const name5 = req.body.name5;
  const name6 = req.body.name6;
  const name7 = req.body.name7;

  async function createPdf(input, output, data) {
    try {
      const pdfDoc = await PDFDocument.load(await readFile(input));
      const form = pdfDoc.getForm();
      const nf = 7;
    
      for (let i = 1; i <= nf; i++) {
        form.getTextField(i.toString()).setText(data['name' + i]);
      }

      const pdfBytes = await pdfDoc.save();
  
      await writeFile(output, pdfBytes);
      console.log('PDF created!');
    } catch (err) {
      console.log(err);
      throw err;
    }
  }

  try {
    const outputPdfBuffer = createPdf('NDA.pdf', 'output3.pdf', {
      name1,
      name2,
      name3,
      name4,
      name5,
      name6,
      name7,
    });

    res.status(200).send('PDF created successfully');
  } catch (error) {
    console.error(error);
    res.status(500).send('PDF creation failed');
  }

});

app.get("/download1",(req,res)=>{
  const filePath = path.join(__dirname, '/', 'output1.pdf');
  res.download(filePath, (err) => {
    if (err) {
      // Handle errors, such as file not found
      console.error(`Error downloading the file: ${err.message}`);
      res.status(404).send('File not found');
    } else {
      console.log('File downloaded successfully');
    }
  });
});

app.get("/download2",(req,res)=>{
  const filePath = path.join(__dirname, '/', 'output2.pdf');
  res.download(filePath, (err) => {
    if (err) {
      // Handle errors, such as file not found
      console.error(`Error downloading the file: ${err.message}`);
      res.status(404).send('File not found');
    } else {
      console.log('File downloaded successfully');
    }
  });
});

app.get("/download3",(req,res)=>{
  const filePath = path.join(__dirname, '/', 'output3.pdf');
  res.download(filePath, (err) => {
    if (err) {
      // Handle errors, such as file not found
      console.error(`Error downloading the file: ${err.message}`);
      res.status(404).send('File not found');
    } else {
      console.log('File downloaded successfully');
    }
  });
});

app.listen(3000, () => {
  console.log("Server started running on port 3000");
});
