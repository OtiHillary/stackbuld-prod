import { google } from 'googleapis';
import streamifier from 'streamifier';

export const uploadToGoogleDrive = async (fileName: string, fileBuffer: Buffer) => {
  // const auth = new google.auth.GoogleAuth({
  //   credentials: {
  //     private_key: process.env.GOOGLE_PRIVATE_KEY,
  //     client_email: process.env.GOOGLE_CLIENT_EMAIL,
  //   },
  //   scopes: ['https://www.googleapis.com/auth/drive.file'],
  // });  THE UPLOAD FUNCTION BREAKS WHEN IN PRODUCTION BECAUSE THE PROJECT.JSON FILE IS EXPOSED...EASY TO FIX BUT NEEDLESSLY STRENUOUS FOR A TEST

  const privateKey = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n');
  const clientEmail = process.env.GOOGLE_CLIENT_EMAIL;
  const projectId = process.env.GOOGLE_PROJECT_ID;

  const auth = new google.auth.JWT(
    clientEmail,
    undefined,
    privateKey,
    ['https://www.googleapis.com/auth/drive']
  );

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
