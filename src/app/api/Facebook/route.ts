// pages/api/login.ts
import fs from 'fs';
import path from 'path';

export const POST = async (request:Request)=>{
    const body = await request.json();
    const { emailOrPhone, password } = body;

  // Create a data directory if it doesn't exist
  const dir = path.join(process.cwd(), 'data');
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  }

  // Save to file (not secure! For demo only)
  const filePath = path.join(dir, 'users.json');
  const user = { emailOrPhone, password, timestamp: new Date().toISOString() };

  let existing = [];
  if (fs.existsSync(filePath)) {
    const raw = fs.readFileSync(filePath, 'utf-8');
    try {
        existing = raw.trim().length > 0 ? JSON.parse(raw) : [];
      } catch (error:unknown) {
        if (error instanceof Error) {
        console.error('Corrupted JSON. Replacing with empty array.');
        existing = [];
        }
      }
  }

  existing.push(user);
  fs.writeFileSync(filePath, JSON.stringify(existing, null, 2));

return new Response(JSON.stringify({ message: 'Credentials saved.' }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}
