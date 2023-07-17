// import { Storage } from '@google-cloud/storage';
// const busboy = require('busboy');
//
// const storage = new Storage({
//     projectId: 'argon-surf-393212',
//     keyFilename: '~/argon-surf-393212-e0a735e90918.json',
// });
//
// export const POST = async (request) => {
//     try {
//         if (request.method === 'POST') {
//             const bb = busboy({ headers: request.headers });
//
//             bb.on('file', (file, filename, encoding, mimeType) => {
//                 console.log(`Processing file ${filename}`);
//                 const bucketName = 'next-post-video';
//                 const bucket = storage.bucket(bucketName);
//                 const fileUpload = bucket.file(filename);
//
//                 const blobStream = fileUpload.createWriteStream();
//
//                 blobStream.on('error', (error) => {
//                     console.log('Something is wrong! Unable to upload at the moment.' + error);
//                 });
//
//                 blobStream.on('finish', () => {
//                     const url = `https://storage.googleapis.com/${bucket.name}/${fileUpload.name}`; //image url from firebase server
//                     return new Response(JSON.stringify({ publicUrl: url }), { status: 200 });
//                 });
//
//                 file.pipe(blobStream);
//             });
//
//             bb.on('finish', function() {
//                 console.log('Done parsing form!');
//             });
//
//             request.pipe(bb);
//         } else {
//             return new Response('Method Not Allowed', { status: 405 });
//         }
//     } catch (error) {
//         console.error(error);
//         return new Response('Internal Server Error', { status: 500 });
//     }
// }
