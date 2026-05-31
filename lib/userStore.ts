import { GetObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { r2 } from "./r2";

const BUCKET = process.env.R2_BUCKET_NAME!;
const KEY = "users.json";

async function streamToString(stream: any) {
  const chunks: any[] = [];
  for await (const chunk of stream) chunks.push(chunk);
  return Buffer.concat(chunks).toString("utf-8");
}

export async function getUsers() {
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
    return { users: [] };
  }
}

export async function saveUser(user: any) {
  const data = await getUsers();
  const existingIndex = data.users.findIndex((u: any) => u.email === user.email);
  
  if (existingIndex >= 0) {
    data.users[existingIndex] = user;
  } else {
    data.users.push(user);
  }

  await r2.send(
    new PutObjectCommand({
      Bucket: BUCKET,
      Key: KEY,
      Body: JSON.stringify(data, null, 2),
      ContentType: "application/json",
    })
  );
}

export async function getUserByEmail(email: string) {
  const data = await getUsers();
  return data.users.find((u: any) => u.email === email);
}

export async function enrollCourse(email: string, courseId: string) {
  const data = await getUsers();
  const userIndex = data.users.findIndex((u: any) => u.email === email);
  
  if (userIndex >= 0) {
    if (!data.users[userIndex].enrolledCourses) {
      data.users[userIndex].enrolledCourses = [];
    }
    
    if (!data.users[userIndex].enrolledCourses.includes(courseId)) {
      data.users[userIndex].enrolledCourses.push(courseId);
    }
    
    await r2.send(
      new PutObjectCommand({
        Bucket: BUCKET,
        Key: KEY,
        Body: JSON.stringify(data, null, 2),
        ContentType: "application/json",
      })
    );
  }
  
  return data.users[userIndex];
}
 
export async function getEnrolledCourses(email: string) {
  const user = await getUserByEmail(email);
  return user?.enrolledCourses || [];
}