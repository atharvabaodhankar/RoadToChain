import * as fs from "fs";
import * as path from "path";
import matter from "gray-matter";
import { BedrockRuntimeClient, InvokeModelCommand } from "@aws-sdk/client-bedrock-runtime";
import { Index } from "@upstash/vector";

// Load .env.local
const envPath = path.join(process.cwd(), ".env.local");
if (fs.existsSync(envPath)) {
  const lines = fs.readFileSync(envPath, "utf-8").split("\n");
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const idx = trimmed.indexOf("=");
    if (idx !== -1) {
      const key = trimmed.slice(0, idx).trim();
      let val = trimmed.slice(idx + 1).trim();
      if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
        val = val.slice(1, -1);
      }
      process.env[key] = val;
    }
  }
}

const CONTENT_DIR = path.join(process.cwd(), "content");
const BIBLE_PATH = path.join(process.cwd(), "web3_curriculum_bible.md");

const vectorIndex = new Index({
  url: process.env.UPSTASH_VECTOR_REST_URL,
  token: process.env.UPSTASH_VECTOR_REST_TOKEN,
});

const bedrockClient = new BedrockRuntimeClient({
  region: process.env.AWS_REGION || "ap-south-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
  },
});

async function getEmbedding(text: string): Promise<number[]> {
  const command = new InvokeModelCommand({
    modelId: process.env.BEDROCK_EMBEDDING_MODEL_ID || "amazon.titan-embed-text-v2:0",
    contentType: "application/json",
    accept: "application/json",
    body: JSON.stringify({
      inputText: text.slice(0, 8000), // Titan v2 input limit is ~8k tokens
      dimensions: 1024,
      normalize: true,
    }),
  });

  const response = await bedrockClient.send(command);
  const result = JSON.parse(new TextDecoder().decode(response.body));
  return result.embedding;
}

interface CurriculumChunk {
  id: string;
  text: string;
  metadata: {
    title: string;
    trackSlug?: string;
    moduleSlug?: string;
    lessonSlug?: string;
    url: string;
    section: string;
    tags?: string[];
  };
}

function chunkMarkdown(rawContent: string, maxChunkLen = 900): Array<{ section: string; text: string }> {
  const lines = rawContent.split("\n");
  const chunks: Array<{ section: string; text: string }> = [];
  let currentSection = "General";
  let currentBuffer: string[] = [];

  for (const line of lines) {
    if (line.startsWith("# ") || line.startsWith("## ") || line.startsWith("### ")) {
      if (currentBuffer.length > 0) {
        const text = currentBuffer.join("\n").trim();
        if (text.length > 50) {
          chunks.push({ section: currentSection, text });
        }
        currentBuffer = [];
      }
      currentSection = line.replace(/^#+\s*/, "").trim();
    } else {
      currentBuffer.push(line);
      const joined = currentBuffer.join("\n");
      if (joined.length >= maxChunkLen) {
        chunks.push({ section: currentSection, text: joined.trim() });
        currentBuffer = [];
      }
    }
  }

  if (currentBuffer.length > 0) {
    const text = currentBuffer.join("\n").trim();
    if (text.length > 50) {
      chunks.push({ section: currentSection, text });
    }
  }

  return chunks;
}

async function collectChunks(): Promise<CurriculumChunk[]> {
  const chunks: CurriculumChunk[] = [];

  // 1. Traverse content/
  if (fs.existsSync(CONTENT_DIR)) {
    const trackDirs = fs.readdirSync(CONTENT_DIR);
    for (const trackDir of trackDirs) {
      const trackPath = path.join(CONTENT_DIR, trackDir);
      if (!fs.statSync(trackPath).isDirectory()) continue;

      const moduleDirs = fs.readdirSync(trackPath);
      for (const moduleDir of moduleDirs) {
        const modulePath = path.join(trackPath, moduleDir);
        if (!fs.statSync(modulePath).isDirectory()) continue;

        const files = fs.readdirSync(modulePath);
        for (const file of files) {
          if (!file.endsWith(".mdx")) continue;
          const slug = file.replace(/\.mdx$/, "");
          const raw = fs.readFileSync(path.join(modulePath, file), "utf-8");
          const { data, content } = matter(raw);

          const lessonTitle = data.title || slug;
          const canonicalUrl = `/learn/${trackDir}/${moduleDir}/${slug}`;
          const rawChunks = chunkMarkdown(content);

          rawChunks.forEach((rc, i) => {
            chunks.push({
              id: `${trackDir}-${moduleDir}-${slug}-${i}`,
              text: `[Lesson: ${lessonTitle}] [Section: ${rc.section}]\n${rc.text}`,
              metadata: {
                title: lessonTitle,
                trackSlug: trackDir,
                moduleSlug: moduleDir,
                lessonSlug: slug,
                url: canonicalUrl,
                section: rc.section,
                tags: Array.isArray(data.tags) ? data.tags : [],
              },
            });
          });
        }
      }
    }
  }

  // 2. Index curriculum bible overview
  if (fs.existsSync(BIBLE_PATH)) {
    const rawBible = fs.readFileSync(BIBLE_PATH, "utf-8");
    const bibleChunks = chunkMarkdown(rawBible, 1200);
    bibleChunks.forEach((bc, i) => {
      chunks.push({
        id: `bible-${i}`,
        text: `[Curriculum Blueprint] [Section: ${bc.section}]\n${bc.text}`,
        metadata: {
          title: `Curriculum Roadmap: ${bc.section}`,
          url: "/curriculum",
          section: bc.section,
          tags: ["roadmap", "curriculum", "overview"],
        },
      });
    });
  }

  return chunks;
}

async function runIndex() {
  console.log("Collecting curriculum chunks...");
  const chunks = await collectChunks();
  console.log(`Found ${chunks.length} chunks to index across RoadToChain.`);

  const batchSize = 10;
  let successCount = 0;

  for (let i = 0; i < chunks.length; i += batchSize) {
    const batch = chunks.slice(i, i + batchSize);
    console.log(`Embedding & uploading batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(chunks.length / batchSize)}...`);

    const vectorsToUpsert = [];
    for (const item of batch) {
      try {
        const vector = await getEmbedding(item.text);
        vectorsToUpsert.push({
          id: item.id,
          vector,
          data: item.text,
          metadata: item.metadata,
        });
      } catch (err: any) {
        console.error(`Error embedding ${item.id}:`, err.message || err);
      }
    }

    if (vectorsToUpsert.length > 0) {
      await vectorIndex.upsert(vectorsToUpsert);
      successCount += vectorsToUpsert.length;
    }

    // Small breather to prevent any throttling
    await new Promise((r) => setTimeout(r, 200));
  }

  console.log(`\n🎉 Ingestion complete! Successfully indexed ${successCount}/${chunks.length} vectors in Upstash Vector.`);
  const info = await vectorIndex.info();
  console.log("Updated Vector Index Info:", info);
}

runIndex().catch((err) => {
  console.error("Index failed:", err);
  process.exit(1);
});
