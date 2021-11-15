import axios from 'axios';
import React, { useEffect, useState } from 'react'
import './index.css'

const chunkSize = 10 * 1024; //KB
export default function MultipleUp() {

    const [dropzoneActive, setDropzoneActive] = useState(false);
    // tổng files
    const [files, setFiles] = useState([]);
    // vị trí file hiện tại
    const [currentFileIndex, setCurrentFileIndex] = useState(null);
    const [lastUploadedFileIndex, setLastUploadedFileIndex] = useState(null);
    const [currentChunkIndex, setCurrentChunkIndex] = useState(null);

    function handleDrop(e) {
        e.preventDefault();
        setDropzoneActive(false)
        if (files.length == 4) {
            alert('exceeded maxium files to upload. Please delete previous file and try again')
            return
        }
        // add files to the array
        setFiles([...files, ...e.dataTransfer.files]);
    }

    function readAndUploadCurrentChunk() {
        const reader = new FileReader();
        const file = files[currentFileIndex];
        if (!file) {
            console.log('No File found 2 up');
            return;
        }
        const from = currentChunkIndex * chunkSize;
        const to = from + chunkSize;
        const blob = file.slice(from, to);
        reader.onload = e => uploadChunk(e);
        reader.readAsDataURL(blob);
    }

    async function uploadChunk(e) {
        const file = files[currentFileIndex];
        const data = e.target.result;
        const params = new URLSearchParams();

        params.set('name', file.name);
        params.set('size', file.size);
        params.set('currentChunkIndex', currentChunkIndex);
        params.set('totalChunks', Math.ceil(file.size / chunkSize));

        // test set userId & postId;
        params.set('userId', '614c93f483cb32b7b80f0681');
        params.set('postId', '6151fdb21788adff1082405a');

        const headers = { 'Content-Type': 'application/octet-stream' };

        const url = `http://localhost:5001/api/upload/fsupload?${params.toString()}`
        await axios.post(url, data, { headers })
            .then(response => {
                const file = files[currentFileIndex];
                const filesize = files[currentFileIndex].size;
                // total [chunks - 1] (index of last chunk)
                const chunks = Math.ceil(filesize / chunkSize) - 1;
                const isLastChunk = currentChunkIndex === chunks;
                if (isLastChunk) {
                    // return file name = final file name in response
                    file.finalFilename = response.data.finalFilename;
                    // set previous upload file to this current file index
                    setLastUploadedFileIndex(currentFileIndex);
                    // stop uploading chunk by set to null
                    setCurrentChunkIndex(null);
                } else {
                    // continue upload next chunk to temp file
                    setCurrentChunkIndex(currentChunkIndex + 1);
                }
            });
    }

    // chỉnh vị trí trong array files để tránh update vào chỗ cũ.
    useEffect(() => {
        // ở file cuối cùng
        // trả về
        if (lastUploadedFileIndex === null) {
            return;
        }
        // check file có phải file cuối k
        const isLastFile = lastUploadedFileIndex === files.length - 1;
        // set file upload tiếp theo
        const nextFileIndex = isLastFile ? null : currentFileIndex + 1;
        setCurrentFileIndex(nextFileIndex);

    }, [lastUploadedFileIndex]);

    useEffect(() => {
        if (files.length > 0) {
            if (currentFileIndex === null) {
                setCurrentFileIndex(
                    lastUploadedFileIndex === null ? 0 : lastUploadedFileIndex + 1
                );
            }
        }
    }, [files.length]);

    // Chọn phần của file
    useEffect(() => {
        // có file 
        if (currentFileIndex !== null) {
            // bắt đầu upload chunk
            setCurrentChunkIndex(0);
        }
    }, [currentFileIndex])

    // upload the chunk
    useEffect(() => {
        if (currentChunkIndex !== null) {
            // update chunk
            readAndUploadCurrentChunk();
        }
    }, [currentChunkIndex])

    return (
        <div>
            <div style={{ height: '100vh', backgroundColor: '#113', color: '#ddd', padding: '20px' }}>
                <div
                    onDragOver={e => { setDropzoneActive(true); e.preventDefault(); }}
                    onDragLeave={e => { setDropzoneActive(false); e.preventDefault(); }}
                    onDrop={e => handleDrop(e)}
                    className={"dropzone" + (dropzoneActive ? " active" : "")}>
                    Drop your files here
                </div>

                <div className="files">
                    {files.map((file, fileIndex) => {
                        let progress = 0;
                        // file has final name when its completed
                        if (file.finalFilename) {
                            progress = 100;
                        } else {
                            // if fileIndex in array equal to 
                            // current file index then its still uploading
                            const uploading = fileIndex === currentFileIndex;
                            // split file size into chunks
                            const chunks = Math.ceil(file.size / chunkSize);
                            if (uploading) {
                                // get progress by using chunk index divided by total chunks
                                progress = Math.round(currentChunkIndex / chunks * 100);
                            } else {
                                progress = 0;
                            }
                        }
                        return (
                            <a className="file" target="_blank"
                                href={'http://localhost:5001/uploads/' + file.finalFilename}>
                                <div className="name">{file.name}</div>
                                <div className={"progress " + (progress === 100 ? 'done' : '')}
                                    style={{ width: progress + '%' }}>{progress}%</div>
                            </a>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}