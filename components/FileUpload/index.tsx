"use client"

import React, {useEffect, useState} from 'react';

const FileUploader = () => {
    const [selectedFile, setSelectedFile] = useState<any>(null);

    const handleFileChange = (e: any) => {
        const file = e.target.files[0];
        setSelectedFile(file);
    };

    const handleDragOver = (e: any) => {
        e.preventDefault();
    };

    const handleDrop = (e: any) => {
        e.preventDefault();

        const file = e.dataTransfer.files[0];
        setSelectedFile(file);
    };

    useEffect(() => {
        if (selectedFile) {
            let formData = new FormData();
            formData.append("file", selectedFile, selectedFile.name);

            let requestOptions = {
                method: 'POST',
                body: formData,
                redirect: 'follow'
            };

            // @ts-ignore
            fetch("http://204.236.168.71:8000/mlops/query_rag", requestOptions)
                .then(response => response.text())
                .then(result => console.log(result))
                .catch(error => console.log('error', error));
        }
    }, [selectedFile])

    // console.log(selectedFile?.files)

    return (
        <div>
            <h2>PDF File Uploader</h2>
            <input type="file" accept=".pdf" onChange={handleFileChange} />

            <div
                style={{
                    border: '2px dashed #ccc',
                    padding: '20px',
                    marginTop: '20px',
                }}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
            >
                <p>Drag & Drop a PDF file here</p>
            </div>

            {selectedFile && (
                <div>
                    <h3>Selected File:</h3>
                    <p>{selectedFile.name}</p>
                </div>
            )}
        </div>
    );
};

export default FileUploader;
