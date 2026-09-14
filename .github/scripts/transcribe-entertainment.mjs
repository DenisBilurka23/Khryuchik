import { readFile } from "node:fs/promises";
import { basename } from "node:path";

const ENDPOINT = "https://api.openai.com/v1/audio/transcriptions";

const [audioPath, language, model, prompt] = process.argv.slice(2);

if (!audioPath || !model) {
  console.error("usage: transcribe-entertainment.mjs <audio> <language> <model> [prompt]");
  process.exit(2);
}

const apiKey = process.env.OPENAI_API_KEY;

if (!apiKey) {
  console.error("OPENAI_API_KEY is required");
  process.exit(2);
}

const audio = await readFile(audioPath);
const form = new FormData();

form.append("file", new Blob([audio], { type: "audio/mp4" }), basename(audioPath));
form.append("model", model);
form.append("response_format", "vtt");

if (language) {
  form.append("language", language);
}

if (prompt) {
  form.append("prompt", prompt);
}

const response = await fetch(ENDPOINT, {
  method: "POST",
  headers: { Authorization: `Bearer ${apiKey}` },
  body: form,
});

if (!response.ok) {
  const detail = await response.text().catch(() => "");

  console.error(`transcription failed with HTTP ${response.status}: ${detail.slice(0, 300)}`);
  process.exit(1);
}

const vtt = await response.text();

if (!vtt.trimStart().startsWith("WEBVTT")) {
  console.error("transcription did not return a WebVTT body");
  process.exit(1);
}

process.stdout.write(vtt);
