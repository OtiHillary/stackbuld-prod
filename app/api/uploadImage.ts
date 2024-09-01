import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const { file } = req.body;

      // Create a unique filename
      const filename = Date.now() + '-' + file.name;

      // Write the file to the public folder
      await fs.promises.writeFile(`public/uploads/${filename}`, file);

      res.status(200).json({ message: 'File uploaded successfully', filename });
    } catch (error) {
      console.error('Error uploading file:', error);
      res.status(500).json({ message: 'Error uploading file' });
    }
  } else {
    res.status(405).end();
  }
}