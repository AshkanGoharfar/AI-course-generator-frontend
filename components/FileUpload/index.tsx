"use client"

import React, {useEffect, useState} from 'react';

const FileUploader = () => {
    const [selectedFile, setSelectedFile] = useState<any>(null);
    const [generatedCourse, setGeneratedCourse] = useState<any>(null)
    const [loading, setLoading] = useState(false)
    const [elapsedTime, setElapsedTime] = useState<any>(null)

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

    }, [selectedFile])

    const generateCourseWithGPT4Vision = () => {
        if (selectedFile) {
            let start = Date.now()
            setLoading(true)
            let formData = new FormData();
            formData.append("file", selectedFile, selectedFile.name);

            let requestOptions = {
                method: 'POST',
                body: formData,
                redirect: 'follow'
            };

            // @ts-ignore
            fetch(process.env.GPT4_API_URL, requestOptions)
                .then(response => response.text())
                .then(result => {
                    let end = Date.now()
                    setElapsedTime(end - start)
                    setGeneratedCourse(JSON.parse(result).result)
                    setLoading(false)
                })
                .catch(error => console.log('error', error));
        }
    }

    const generateCourseWithRAG = () => {
        if (selectedFile) {
            let start = Date.now()
            setLoading(true)
            let formData = new FormData();
            formData.append("file", selectedFile, selectedFile.name);

            let requestOptions = {
                method: 'POST',
                body: formData,
                redirect: 'follow'
            };

            // @ts-ignore
            fetch(process.env.RAG_API_URL, requestOptions)
                .then(response => response.text())
                .then(result => {
                    let end = Date.now()
                    setElapsedTime(end - start)
                    setGeneratedCourse(JSON.parse(result).result)
                    setLoading(false)
                })
                .catch(error => console.log('error', error));
        }
    }

    return (
        <div>
            <div style={{ marginBottom: "2rem", fontSize: "1.5rem", fontWeight: "700" }}>This demo only creates 3 slides based on <a style={{ color: "blue", textDecoration: "underline" }} target="_blank" href="https://github.com/aicam/AI_course_generator/blob/master/mlops/templates/basic.json">basic</a> template</div>
            {elapsedTime ? (<div style={{ marginBottom: "2rem", fontSize: "1.5rem", fontWeight: "700" }}><strong style={{ color: "red" }}>Elapsed Time:</strong> {elapsedTime /1000} Seconds</div>) : (<></>)}
            {
                !generatedCourse ? loading ? (
                    <div>is processing ....</div>
                ) : (
                    <div>
                        <h2>Upload a PDF file here</h2>
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


                        {
                            selectedFile ? (
                                <>
                                    <div style={{
                                        display: "flex",
                                        flexDirection: "row",
                                        justifyContent: "center",
                                        fontSize: "1.7rem",
                                        fontWeight: "700",
                                        textAlign: "center",
                                        marginTop: "2rem"
                                    }}>Generate Course</div>
                                    <div style={{
                                        display: "flex",
                                        flexDirection: "row",
                                        justifyContent: "space-between",
                                        gap: "2rem"
                                    }}>
                                        <button style={{
                                            border: "1px solid black",
                                            display: "flex",
                                            flexDirection: "row",
                                            justifyContent: "center",
                                            padding: "1rem",
                                            borderRadius: "30px",
                                            marginTop: "1rem"
                                        }} onClick={generateCourseWithGPT4Vision}>
                                            Use GPT4 Vision
                                        </button>
                                        <button style={{
                                            border: "1px solid black",
                                            display: "flex",
                                            flexDirection: "row",
                                            justifyContent: "center",
                                            padding: "1rem",
                                            borderRadius: "30px",
                                            marginTop: "1rem"
                                        }} onClick={generateCourseWithRAG}>
                                            Use RAG
                                        </button>
                                    </div>
                                </>
                            ) : (<></>)
                        }
                    </div>
                ) : (
                    <div style={{
                        display: "flex",
                        justifyContent: "start",
                        alignItems: "start",
                        flexDirection: "column"
                    }}
                    >
                        <div style={{ marginBottom: "1rem" }}>********************************************************************</div>
                        <div><strong>Slide title:</strong> {generatedCourse.slides[0]?.header?.output?.answer}</div>
                        <div>********************************************************************</div>
                        {
                            generatedCourse?.slides && generatedCourse.slides.length &&  generatedCourse.slides.map((slide: any, index: number) => (
                                <div key={index} style={{
                                    display: "flex",
                                    justifyContent: "start",
                                    alignItems: "start",
                                    flexDirection: "column",
                                    marginTop: "1rem"
                                }}>
                                    <div><strong>Slide title:</strong> {
                                        index === 0 ? "Agenda" : slide?.header?.output?.answer
                                    }</div>
                                    <div><strong>Slide Content:</strong></div>
                                    {
                                        slide?.body && slide.body.length &&  slide.body.map((slideContent: any, contentIndex: number) => (
                                            <div key={contentIndex}>
                                                {
                                                    slideContent.component_name === "shortdescription" ? (
                                                        <div>{slideContent.output.answer}</div>
                                                    ) : slideContent.component_name === "bulletpoints" ? (
                                                        <div>{slideContent?.output?.answer.replaceAll(".", "").split(slideContent.delimiter) && slideContent?.output?.answer.split(slideContent.delimiter).length && slideContent?.output?.answer.split(slideContent.delimiter).map((bulletPoint: any, bulletPointIndex: number) => (
                                                            <>
                                                            {
                                                                bulletPoint.replaceAll(".", "") ? (<div key={bulletPointIndex}>* {bulletPoint.replaceAll(".", "").replaceAll("-", "")}</div>) : (<></>)
                                                            }
                                                            </>
                                                        ))}</div>
                                                    ) : (<></>)
                                                }
                                            </div>
                                        ))

                                    }
                                    <div>
                                        <strong>Slide Voiceover: </strong>
                                        {slide?.header?.output?.transcript}
                                        {
                                            slide?.body && slide.body.length &&  slide.body.map((slideContent: any, contentIndex: number) => (
                                                <div key={contentIndex}>
                                                    {slideContent.output.transcript}
                                                </div>
                                            ))

                                        }
                                    </div>
                                    <div>********************************************************************</div>
                                </div>
                            ))
                        }
                    </div>
                )
            }
        </div>
    )
};

export default FileUploader;
