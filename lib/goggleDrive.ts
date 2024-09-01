import { google } from 'googleapis';
import streamifier from 'streamifier';

export const uploadToGoogleDrive = async (fileName: string, fileBuffer: Buffer) => {
  const auth = new google.auth.GoogleAuth({
    keyFile: 'stackbuld.json',
    scopes: ['https://www.googleapis.com/auth/drive.file'],
  });

  const driveService = google.drive({ version: 'v3', auth });

  const fileMetadata = {
    name: fileName,
    parents: ['1qxPugcDkyHAbFFIZv3WMiKhSB5TqExSg'], 
  };

  const media = {
    mimeType: 'image/jpeg',
    body: streamifier.createReadStream(fileBuffer),
  };

  const file = await driveService.files.create({
    requestBody: fileMetadata,
    media,
    fields: 'id',
  });

  return file.data.id;
};
