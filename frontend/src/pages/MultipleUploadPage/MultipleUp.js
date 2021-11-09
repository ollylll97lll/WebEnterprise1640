import axios from 'axios';
import React, { useEffect, useState } from 'react'
import './index.css'

const chunkSize = 10 * 1024; //KB
export default function MultipleUp() {
    const [dropZone, setDropZone] = useState(false);
    // tổng files
    const [files, setFiles] = useState([])
    // vị trí file hiện tại
    const [currentFileIndex, setCurrentFileIndex] = useState(null);
    const [currentChunkIndex, setCurrentChunkIndex] = useState(null);

    function handleDrop(e) {
        e.preventDefault();
        setDropZone(false)
        if(files.length == 4){
            alert('exceeded maxium files to upload. Please delete previous file and try again')
            return
        }
        setFiles([...files, ...e.dataTransfer.files]);
    }



    // chỉnh vị trí trong array files để tránh update vào chỗ cũ.
    useEffect(() => {
        console.log(files);
        if (files.length > 0) {
            // if(currentFileIndex === null){
            //     setCurrentFileIndex(0)
            // } 
            setCurrentFileIndex(currentFileIndex === null ? 0 : currentFileIndex + 1);
        }
    }, [files.length])

    // Chọn phần của file
    useEffect(() => {
        if (currentFileIndex !== null) {
            setCurrentChunkIndex(0);
        }
    }, [currentFileIndex])

    // upload the chunk
    useEffect(() => {
        if (currentChunkIndex !== null) {
            RnUCurrentChunk();

        }
    }, [currentChunkIndex])

    function RnUCurrentChunk() {
        const reader = new FileReader();
        const file = files[currentFileIndex];
        if (!file) {
            console.log('No File found 2 up');
            return;
        }
        const from = currentChunkIndex * chunkSize;
        const to = from + chunkSize;
        const dat = file.slice(from, to);
        reader.onload = (e) => {
            uploadChunk(e);
        }
        reader.readAsDataURL(dat);
    }

    async function uploadChunk(e) {
        // const file = files[currentFileIndex];
        // const data = e.target.result;
        // const headers = { 'Content-Type': 'application/octet-stream' };
        // const params = new URLSearchParams();
        // params.set('name', file.name);
        // params.set('size', file.size);
        // params.set('currentChunkIndex', currentChunkIndex);
        // params.set('totalChunks', Math.ceil(file.size / chunkSize));

        // const url = `http://localhost:5001/api/upload/uf?${params.toString()}`;
        // try {
        //     const response = await axios.post(url, data, headers);
        //     console.log(response);
        // } catch (error) {
        //     console.log(error)
        // }
    }

    return (
        <div style={{ height: '100vh', backgroundColor: '#113', color: '#ddd', padding: '20px' }}>
            <div
                onDragOver={e => { setDropZone(true); e.preventDefault(); }}
                onDragLeave={e => { setDropZone(false); e.preventDefault(); }}
                onDrop={e => { handleDrop(e) }}
                className={`dropzone ${dropZone ? 'active' : ''}`}
            >
                Drop Your File Here
            </div>
            <div
            // style={{ border: '2px dashed rgba(255,255,255,0.2)', borderRadius: '10px', padding: '50px 0', textAlign: 'center', textTransform: 'uppercase' }}
            >
                Display each file here
                {
                    files.map(file => {
                        return (
                            <div>
                                <span><a href={`http://localhost:5001/api/uploads/${file.filename}` || `../../assets/images/gre.jpg`}>{file.name}</a></span>
                            </div>
                        )
                    })
                }
            </div>
        </div>
    )
}