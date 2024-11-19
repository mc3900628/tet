import { json } from "@sveltejs/kit";
import crypto from 'crypto';

// TODO: name function with semantically appropriate name
export async function POST({ request }) {
  try {
    const formData = await request.formData();
    const file = formData.get('file');
    const fileBuffer = Buffer.from(await file.arrayBuffer());
    const hash = crypto.createHash('sha256');
    hash.update(fileBuffer);
    const fileHash = hash.digest('hex');

    return json({ fileHash });
  } catch (error) {
    return json({ error: "undefined error message" }, { status: 500 });
  }
}

