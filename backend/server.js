const express = require("express");
const http = require("http");
const WebSocket = require("ws");
const { exec } = require("child_process");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
// const { Gemini } = require("@google/generative-ai"); // Commented out unused package
const { GoogleGenerativeAI } = require("@google/generative-ai"); // Adjusted for the right import
const say=require('say')



const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

app.use(cors());
app.use(express.json());

// Initialize Google Generative AI
const genAI = new GoogleGenerativeAI("api key");
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

wss.on("connection", (ws) => {
  console.log("Client connected");

  ws.on("message", async (message) => {
    const text = message.toString();
    console.log("Received:", text);

    try {
      // Query Gemini model
      const result = await model.generateContent( text); // Corrected API call
      console.log(result.response.text());
      const aiResponse = result.response.text(); // Corrected the way to access the text

      ws.send(JSON.stringify({ text: aiResponse }));
      say.speak(aiResponse);
      // Convert response to speech using gTTS
      // const ttsFilePath = path.join(__dirname, "response.mp3");
      // exec(`gtts-cli "${aiResponse}" --output "${ttsFilePath}"`, (err) => {
      //   if (err) {
      //     console.error("Error generating speech:", err);
      //     ws.send(JSON.stringify({ text: "Error in TTS processing" }));
      //     return;
      //   }
      //   const audioStream = fs.readFileSync(ttsFilePath);
      //   ws.send(audioStream);
      // });
    } catch (error) {
      console.error("Error processing request:", error);
      ws.send(JSON.stringify({ text: "Sorry, something went wrong." }));
    }
  });

  ws.on("close", () => console.log("Client disconnected"));
});

server.listen(5000, () => console.log("Server running on port 5000"));















// const express = require("express");
// const http = require("http");
// const WebSocket = require("ws");
// const { exec } = require("child_process");
// const cors = require("cors");
// const path = require("path");
// const fs = require("fs");
// const { GoogleGenerativeAI } = require("@google/generative-ai");

// const app = express();
// const server = http.createServer(app);
// const wss = new WebSocket.Server({ server });
// const say=require('say')
// app.use(cors());
// app.use(express.json());

// // Initialize Google Generative AI
// const genAI = new GoogleGenerativeAI("AIzaSyBShWuq3-XNtDWCGJDR9tQsk083mfAUNe0");
// const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// wss.on("connection", (ws) => {
//   console.log("Client connected");

//   ws.on("message", async (message) => {
//     const text = message.toString();
//     console.log("Received:", text);

//     try {
//       // Query Gemini model
//       const result = await model.generateContentStream(text);

//       // console.log(result)
//       // say.speak(JSON.parse({result}))



//       for await (const chunk of result.stream) {
//         const chunkText = chunk.text();
//         console.log("Sending chunk:", chunkText);

//         // Send text chunk to client
//         ws.send(JSON.stringify({ text: chunkText }));
//         say.speak(chunkText);

//         // // Convert chunk to speech using gTTS
//         // const ttsFilePath = path.join(__dirname, "response_chunk.mp3");
//         // exec(`gtts-cli "${chunkText}" --output "${ttsFilePath}"`, (err) => {
//         //   if (err) {
//         //     console.error("Error generating speech:", err);
//         //     ws.send(JSON.stringify({ text: "Error in TTS processing" }));
//         //     return;
//         //   }
//         //   const audioStream = fs.readFileSync(ttsFilePath);
//         //   ws.send(audioStream, { binary: true });
//         // });
//       }
//     } catch (error) {
//       console.error("Error processing request:", error);
//       ws.send(JSON.stringify({ text: "Sorry, something went wrong." }));
//     }
//   });

//   ws.on("close", () => console.log("Client disconnected"));
// });

// server.listen(5000, () => console.log("Server running on port 5000"));