import { GetObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { r2 } from "./r2";

const BUCKET = process.env.R2_BUCKET_NAME!;
const KEY = "courses.json";

async function streamToString(stream: any) {
  const chunks: any[] = [];
  for await (const chunk of stream) chunks.push(chunk);
  return Buffer.concat(chunks).toString("utf-8");
}

export async function getCourses() {
  try {
    const res = await r2.send(
      new GetObjectCommand({
        Bucket: BUCKET,
        Key: KEY,
      })
    );

    const body = await streamToString(res.Body);
    return JSON.parse(body);
  } catch (err) {
    // if file doesn't exist
    return { courses: [] };
  }
}

export async function saveCourses(data: any) {
  await r2.send(
    new PutObjectCommand({
      Bucket: BUCKET,
      Key: KEY,
      Body: JSON.stringify(data, null, 2),
      ContentType: "application/json",
    })
  );
}