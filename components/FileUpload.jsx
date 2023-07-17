// import React, { useRef, useState } from 'react';
//
// const FileUpload = () => {
//     const [url, setUrl] = useState("");
//     const [file, setFile] = useState(null);
//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         let formData = new FormData();
//         formData.append("file", file.data);
//         const response = await fetch("/api/upload", {
//             method: "POST",
//             body: formData,
//         });
//
//         const responseWithBody = await response.json();
//         if (response) setUrl(responseWithBody.publicUrl);
//     };
//
//     const handleFileChange = (e) => {
//         const img = {
//             preview: URL.createObjectURL(e.target.files[0]),
//             data: e.target.files[0],
//         };
//         setFile(img);
//     };
//     return (
//         <form onSubmit={handleSubmit}>
//             <input type="file" name="file" onChange={handleFileChange}></input>
//             <button type="submit">Submit</button>
//             <p>{url}</p>
//         </form>
//     );
// }
//
// export default FileUpload;
