import classnames from 'classnames';
import React, { useEffect, useState } from 'react';
import { Col, Nav, NavItem, NavLink, Row, TabContent, TabPane } from 'reactstrap';
import { Button, Card, FloatingLabel, Form, Modal, ModalDialog } from 'react-bootstrap'
import History from './History';
import SubmitForm from './SubmitForm';
import axios from 'axios';
import { useSelector } from 'react-redux';
import moment from 'moment';
import MessageBox from '../../components/Return Boxes/MessageBox';
import './index.css'
const CHUNK_SIZE = 1000 * 1024; //1 MB

function StaffTab() {
    const userInfo = useSelector(state => state.userLogin.userInfo);
    // all categories
    const [categories, setCategories] = useState();
    // categories user posted && still ongoin
    const [onGoing, setonGoing] = useState([]);
    // show post form modal
    const [show, setShow] = useState(false);
    // get Category List
    const [categoryList, setCategoryList] = useState([])
    // errorFlag
    const [errorFlag, setErrorFlag] = useState('')

    // getuseraction
    const [editAction, setEditAction] = useState(false);
    const [toHistory, setToHistory] = useState()


    // Modal Data
    const [modalData, setModalData] = useState([])
    // Modal Drop/Click Upload Zone Active
    const [dropzoneActive, setDropzoneActive] = useState(false);
    // Modal Form Inputs Data
    const [title, setTitle] = useState('');
    const [categoryId, setCategoryId] = useState('');
    const [content, setContent] = useState('');
    const [docfoldername, setDocfoldername] = useState('')
    const [editPostId, setEidtPostId] = useState('');

    const [postId, setPostId] = useState('');
    // files
    const [files, setFiles] = useState([]);
    // vị trí file hiện tại
    const [currentFileIndex, setCurrentFileIndex] = useState(null);
    // prev file index
    const [lastUploadedFileIndex, setLastUploadedFileIndex] = useState(null);
    // index of file chunk[]
    const [currentChunkIndex, setCurrentChunkIndex] = useState(null);

    async function getAllCategory() {
        const { data } = await axios.get('http://localhost:5001/api/category/getall');
        await filterCategory(data);
        await setDropDownCat(data);
        return;
    }
    async function getStaffOngoing() {
        const { data } = await axios.get(`http://localhost:5001/api/category/getuserpostcategory?userId=${userInfo.userInfo._id}`, {
            headers: { Authorization: `Bearer ${userInfo.accessToken}` },
        })
        setonGoing(data);
    }
    async function getCatPosts(categoryId) {
        const { data } = await axios.get(`http://localhost:5001/api/post/gethistorypost?categoryId=${categoryId}`, {
            headers: { Authorization: `Bearer ${userInfo.accessToken}` },
        });
        if (data.success) {
            setModalData(data.data);
        }
        else {
            return console.log(data)
        }
    }
    async function DeletePost(postId, catId) {
        const { data } = await axios.delete('http://localhost:5001/api/post/delete', {
            headers: { Authorization: `Bearer ${userInfo.accessToken}` },
            data: { postId: postId }
        })
        if (data.success) {
            alert('Deleted')
            return getCatPosts(catId)
        }
        else {
            console.log('failed delete', data)
        }
        return data;
    }

    async function EditPost(editbody) {
        const { data } = await axios.patch(`http://localhost:5001/api/post/edit?postId=${editPostId}`, editbody, {
            headers: { Authorization: `Bearer ${userInfo.accessToken}` },
        })
        if (data.success) {
            setShow(false);
            alert(data.message || 'Editted')
        }
        else {
            console.log(data);
        }
    }

    useEffect(() => {
        getAllCategory();
        getStaffOngoing()
    }, [])

    // useEffect(() => {
    //     console.log(modalData)
    // }, [modalData])


    async function filterCategory(categories) {
        let open = [];
        let close = [];

        [...categories].map(category => {
            // if (moment(category.enddate).isAfter(new Date())) {
            if (moment(new Date()).isAfter(category.enddate)) {
                close.push(category);
            }
            if (moment(new Date()).isSameOrBefore(category.enddate)) {
                open.push(category)
            }
        })
        // console.log({ open, close })
        setCategories({ open, close })
    }

    async function setDropDownCat(categories) {
        let dropdown = [];
        [...categories].map(category => {
            if (moment(category.enddate).isAfter(new Date())) {
                dropdown.push({
                    _id: category._id,
                    name: category.name,
                    closed: false,
                })
            }
            dropdown.push({
                _id: category._id,
                name: category.name,
                closed: true
            })
        })
        setCategoryList(dropdown);
        // console.log('dropdown', dropdown)
    }

    function cardOnGoingClickHandler(e, key, isOngoing) {
        e.preventDefault();
        setModalData([]);
        setCategoryId(key);
        if (isOngoing) {
            // run get all posts in this category
            getCatPosts(key)
        }
        setShow(true);
    }

    // onClick title => passing data to the form for EDIT
    function PassinData(e, data) {
        e.preventDefault();
        // console.log(data)
        setEditAction(true);
        setTitle(data.title);
        setContent(data.content);
        setCategoryId(data.categoryId);
        setEidtPostId(data._id);
        setEditAction(true);
        setDocfoldername(data.docfolder || 'none');
        // TODO: CREATE FUNC GET FILENAME AND THEN SET TO SETFILE
        // setFiles()
    }
    function ClearForm() {
        setTitle('');
        setContent('');
        setCategoryId('');
        setEditAction(false);
        setFiles([]);
        setDocfoldername('');
        return;
    }

    // function for select
    function handleFileSelect(e) {
        // console.log('handleFileSelect', e.target.files)

        setDropzoneActive(false);
        if (files.length == 4) {
            return alert('exceeded maxium files to upload. Please delete previous file and try again')
        }

        // check if files over 25MB
        const temparrayfile = [];

        [...e.target.files].map((file, index) => {
            // 25MB
            if (file.size > 25 * CHUNK_SIZE) {
                return console.log(`exceeded file size limit (25MB) at file ${e.target.files[index].name || 'unknown'}. Abort`);
            }
            return temparrayfile.push(e.target.files[index]);
        })
        setFiles([...files, ...temparrayfile]);
    }

    function removeFileFromList(e, fileIndex) {
        // delete files when edit
        const temparr = []
        files.map((f, index) => {
            if (index === fileIndex) {
                return
            }
            temparr.push(f)
        })
        setFiles(temparr);
    }
    // delete post
    async function handleDeleting(e, postId, catId) {
        e.preventDefault();
        if (window.confirm(`Are you sure to delete post ${postId}`)) {
            DeletePost(postId, catId);
        }
        else {
            return;
        }
    }

    // edit post
    async function EditThePost(e) {
        e.preventDefault();
        EditPost({ title: title, content: content });
    }

    async function CreateNewPost(e) {
        e.preventDefault();
        // Form Validation
        if (title == '' || content == '' || categoryId == '') {
            setErrorFlag(`Fields cannot be leaved empty `);
        }

        const { data } = await axios.post('http://localhost:5001/api/post/create',
            {
                categoryId: categoryId,
                title: title,
                content: content,
                docfolder: ''
            },
            {
                headers: { Authorization: `Bearer ${userInfo.accessToken}` },
            }
        )

        if (data.success) {
            setErrorFlag('');
            // console.log(data.postId);
            setPostId(data.postId);
        }
        if (!data.success) {
            setErrorFlag(data.message)
        }

        // start uploading
        StartTheEngine();
    }

    // Upload Flow
    function StartTheEngine() {
        if (files.length > 0) {
            if (currentFileIndex === null) {
                setCurrentFileIndex(
                    lastUploadedFileIndex === null ? 0 : lastUploadedFileIndex + 1
                );
            }
        }
    }
    // Chọn phần của file
    useEffect(() => {
        // có file 
        if (currentFileIndex !== null) {
            // bắt đầu upload chunk so 0
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

    function readAndUploadCurrentChunk() {
        const reader = new FileReader();
        const file = files[currentFileIndex];
        if (!file) {
            console.log('No File found 2 up');
            return;
        }
        const from = currentChunkIndex * CHUNK_SIZE;
        const to = from + CHUNK_SIZE;
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
        params.set('totalChunks', Math.ceil(file.size / CHUNK_SIZE));

        // test set userId & postId;
        params.set('userId', `${userInfo.userInfo._id}`);
        params.set('postId', `${postId}`);

        const headers = { 'Content-Type': 'application/octet-stream' };

        const url = `http://localhost:5001/api/upload/fsupload?${params.toString()}`
        await axios.post(url, data, { headers })
            .then(response => {
                // get the file and file size
                const file = files[currentFileIndex];
                const filesize = files[currentFileIndex].size;
                // total [chunks - 1] (index of last chunk)
                const chunks = Math.ceil(filesize / CHUNK_SIZE) - 1;
                const isLastChunk = currentChunkIndex === chunks;
                if (isLastChunk) {
                    // return file name = final file name in response
                    file.finalFilename = response.data.finalFilename;
                    file.filepath = response.data.filepath;
                    file.foldername = response.data.foldername;

                    // setFolderName(response.data.foldername)

                    // set previous upload file to this current file index
                    setLastUploadedFileIndex(currentFileIndex);
                    // stop uploading chunk by set to null
                    setCurrentChunkIndex(null);



                } else {
                    // continue upload next chunk to temp file
                    setCurrentChunkIndex(currentChunkIndex + 1);
                }
            }).catch(err => setErrorFlag(err));
    }

    // chỉnh vị trí trong array files để tránh update vào chỗ cũ.
    useEffect(() => {
        // previous file index is not exist then abort
        if (lastUploadedFileIndex === null) {
            return;
        }

        // check file có phải file cuối k
        if (lastUploadedFileIndex === files.length - 1) {
            setShow(false);
            setTimeout(alert('You have posted successfully'), 1000)
        }

        // check file có phải file cuối k
        const isLastFile = lastUploadedFileIndex === files.length - 1;
        // set file upload tiếp theo
        const nextFileIndex = isLastFile ? null : currentFileIndex + 1;
        setCurrentFileIndex(nextFileIndex);

    }, [lastUploadedFileIndex]);


    if (!toHistory) {
        return (
            <div>
                <div style={{ position: 'relative' }}>
                    <Button style={{ position: 'absolute', right: '10px' }} variant="outline-primary" onClick={(e) => setToHistory(true)}>HISTORY</Button>
                </div>
                <div>
                    <h1>Ongoing</h1>
                    <div>
                        {
                            onGoing.length !== 0 ?
                                (<>
                                    <ul className="row" style={{ listStyleType: 'none' }}>
                                        {[...onGoing].map((category) => {
                                            return (
                                                <li key={category._id} style={{ display: 'flex', flex: '1 1 20rem' }} >
                                                    <div onClick={(e, key = category._id, isOngoing = true) => cardOnGoingClickHandler(e, key, isOngoing)} style={{ cursor: 'pointer', width: '30vw' }}>
                                                        <CategoryCard category={category} />
                                                    </div>
                                                </li>
                                            )
                                        })}
                                    </ul>
                                </>)
                                : (<h1>NO CATEGORY</h1>)
                        }
                    </div>
                    <h1>Open</h1>
                    <div>
                        {
                            categories?.open && categories.open.length !== 0 ?
                                (<>
                                    <ul className="row" style={{ listStyleType: 'none' }}>
                                        {[...categories.open].map((category) => {
                                            return (
                                                <li key={category._id} style={{ display: 'flex', flex: '1 1 20rem' }}  >
                                                    <div onClick={(e, key = category._id, isOngoing = false) => cardOnGoingClickHandler(e, key, isOngoing)} style={{ cursor: 'pointer', width: '30vw' }}>
                                                        <CategoryCard category={category} />
                                                    </div>
                                                </li>
                                            )
                                        })}
                                    </ul>
                                </>)
                                : (<h1>NO CATEGORY</h1>)
                        }
                    </div>
                    <h1>Closed</h1>
                    <div>
                        {
                            categories?.close && categories.close.length !== 0 ?
                                (<>
                                    <ul className="row" style={{ listStyleType: 'none' }}>
                                        {[...categories.close].map((category) => {
                                            return (
                                                <li key={category._id} style={{ display: 'flex', flex: '1 1 20rem' }}>
                                                    {/* <div onClick={(e, key = category._id, isOngoing = false) => cardOnGoingClickHandler(e, key, isOngoing)} style={{ cursor: 'pointer', width: '30vw' }}> */}
                                                    <CategoryCard category={category} isClosed={true} />
                                                    {/* </div> */}
                                                </li>
                                            )
                                        })}
                                    </ul>
                                </>)
                                : (<h1>NO CATEGORY</h1>)
                        }
                    </div>
                </div>

                <Modal fullscreen={true} show={show} onHide={() => { setShow(false) }} onExited={() => ClearForm()}>
                    <Modal.Header closeButton className='modal-background' closeVariant="black">
                        <Modal.Title>Modal</Modal.Title>
                    </Modal.Header>
                    <Modal.Body className='modal-background'>
                        <Row>
                            {/* ONLY FOR ONGOING CATEGORIES */}
                            <Col xs={4}>
                                {modalData.length > 0 &&
                                    [...modalData].map(data => {
                                        return (
                                            <div style={{ borderBottom: '1px solid #113', padding: '20px 0', width: '100%', overflow: 'hidden' }}>
                                                <span className='title-selection' onClick={e => { PassinData(e, data) }}>
                                                    {data.title}
                                                </span>
                                                {/* <span> {data.categoryId}</span> */}
                                                <i class="bi bi-trash xbtn" onClick={(e, postId = data._id, catId = data.categoryId) => { handleDeleting(e, postId, catId) }}></i>
                                            </div>
                                        )
                                    })
                                }
                                {modalData.length === 0 &&
                                    (
                                        <span>No Data</span>
                                    )
                                }
                            </Col>
                            <Col xs={8}>
                                <Form>
                                    {/* Title & Category */}
                                    <Row>
                                        <Col>
                                            <FloatingLabel controlId="floatingInput" label="Title" className="mb-3">
                                                <Form.Control type="text" placeholder="New Title Here" className="form-input" value={title} onChange={(e) => { setTitle(''); return setTitle(e.target.value) }} />
                                            </FloatingLabel>
                                        </Col>
                                        <Col>
                                            <FloatingLabel controlId="floatingSelectGrid" label="Categories" style={editAction ? { backgroundColor: 'lightslategray', borderRadius: '0.25rem' } : {}}>
                                                <Form.Select aria-label="Floating label select example" disabled={editAction} className="form-input" value={categoryId} onChange={(e) => { e.preventDefault(); return setCategoryId(e.target.value) }}>
                                                    <option>Open this select menu</option>
                                                    {categoryList.map(option => {
                                                        return (<option value={`${option._id}`} disabled={option.closed} className={`${option.closed ? 'optiondisabled' : ''}`} >{option.name}</option>)
                                                    })}
                                                </Form.Select>
                                            </FloatingLabel>
                                        </Col>
                                    </Row>
                                    {/* Content */}
                                    <Row>
                                        <Col>
                                            <FloatingLabel controlId="floatingContent" label="Content" style={{ fontSize: '1.5rem' }}>
                                                <Form.Control type="textarea" placeholder="Content" style={{ height: '33vh', backgroundColor: 'transparent', color: '#113', borderColor: '#113' }} value={content} onChange={(e) => { setContent(''); return setContent(e.target.value) }} />
                                            </FloatingLabel>
                                        </Col>
                                    </Row>
                                    {
                                        editAction
                                            ? (<Row>
                                                <Col>Folder name: {docfoldername}</Col>
                                            </Row>)
                                            : (<></>)
                                    }
                                    <br />
                                    {
                                        errorFlag && (<MessageBox variant="danger">{errorFlag}</MessageBox>)
                                    }
                                    {/* Upload DragDrop/Click */}
                                    {!editAction
                                        ? (<Row>
                                            <Col style={{ paddingTop: '20px' }}>
                                                <div style={{ position: 'relative' }} className={'dropzone' + (dropzoneActive ? 'active' : '')}>
                                                    Drop or Click to upload your files.
                                                    <input
                                                        type="file"
                                                        multiple="true"
                                                        // max={4 - files.length}
                                                        onDragOver={e => { setDropzoneActive(true); e.preventDefault(); }}
                                                        onDragLeave={e => { setDropzoneActive(false); e.preventDefault(); }}
                                                        onChange={(e) => handleFileSelect(e)}
                                                        style={{ opacity: '0.0', position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, width: '100%', height: '100%' }} />
                                                </div>
                                            </Col>
                                        </Row>)
                                        : (<></>)
                                    }
                                    {/* ShowFiles */}
                                    <Row>
                                        <Col>
                                            <div style={{ height: '300px' }}>
                                                {[...files].map((file, fileIndex) => {
                                                    let progress = 0;
                                                    // file has final name when its completed
                                                    if (file.finalFilename) {
                                                        progress = 100;
                                                    } else {
                                                        // if fileIndex in array equal to 
                                                        // current file index then its still uploading
                                                        const uploading = fileIndex === currentFileIndex;
                                                        // split file size into chunks
                                                        const chunks = Math.ceil(file.size / CHUNK_SIZE);
                                                        if (uploading) {
                                                            // get progress by using chunk index divided by total chunks
                                                            progress = Math.round(currentChunkIndex / chunks * 100);
                                                        } else {
                                                            progress = 0;
                                                        }
                                                    }
                                                    return (
                                                        <div style={{ display: 'flex', flexDirection: 'row', width: '100%', justifyContent: 'space-between', alignItems: 'center' }}>
                                                            <div className="file" target="_blank"
                                                                style={{ width: '100%' }}>
                                                                {file.finalFilename ?
                                                                    (<a href={'http://localhost:5001/uploads/' + file.filepath}>
                                                                        <span>{file.name}</span>
                                                                    </a>)
                                                                    :
                                                                    (
                                                                        <span>{file.name}</span>
                                                                    )
                                                                }
                                                                <div className={"progress " + (progress === 100 ? 'done' : '')}
                                                                    style={{ width: progress + '%' }}>{progress}%</div>
                                                            </div>
                                                            <span className={'xbtn'} onClick={(e) => { removeFileFromList(e, fileIndex) }}>X</span>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </Col>
                                    </Row>

                                </Form>
                            </Col>
                        </Row>
                    </Modal.Body>
                    <Modal.Footer className='modal-background' style={{ borderTopColor: '#113' }}>
                        <Col>
                            {
                                editAction ?
                                    (
                                        <Button variant="outline-success" type="submit" style={{ width: '100%' }} onClick={(e) => { EditThePost(e) }}>
                                            Edit Post
                                        </Button>
                                    )
                                    :
                                    (
                                        <Button variant="outline-primary" type="submit" style={{ width: '100%' }} onClick={(e) => { CreateNewPost(e) }}>
                                            Add New Post
                                        </Button>
                                    )
                            }
                        </Col>
                        <Col>
                            <Button variant="outline-dark" type="cancel" style={{ width: '100%' }} onClick={(e) => { e.preventDefault(); ClearForm(); return setShow(false) }}>
                                Cancel
                            </Button>
                        </Col>
                    </Modal.Footer>
                </Modal>

            </div >
        )
    }
    return (
        <div>
            <div style={{ position: 'relative' }}>
                <Button style={{ position: 'absolute', right: '10px' }} variant="outline-primary" onClick={(e) => setToHistory(false)}>DASHBOARD</Button>
            </div>
            <History />
        </div>
    )
}

function CategoryCard(props) {
    const { category } = props
    const { isClosed } = props
    // const { onGoing } = props;
    return (
        < div style={{ position: 'relative', padding: '20px 0', opacity: `${isClosed ? '0.75' : '1'}`, display: 'flex', justifyContent: 'center', alignItems: 'center' }} >
            <Card className=" text-white" bg="dark" style={{ width: '30vw', height: '40vh', border: '0.1rem solid', borderColor: '#c0c0c0', borderRadius: '0.5rem' }} >
                <Card.Img src={'https://www.hqwalls.com/wp-content/uploads/2016/02/Beautiful_Iceland_landscapes_013.jpg'} width={'100%'} height={'100%'} alt="Card image" className="image-cards" />
                <Card.ImgOverlay>
                    <Card.Title style={{ fontSize: '2rem' }} >{category?.name}</Card.Title>
                    <Card.Subtitle >{category?.startdate}</Card.Subtitle>
                    <br />
                    {isClosed
                        ? (<div>
                            <h1 style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 999, color: 'black' }}>CLOSED</h1><br />
                        </div>)
                        : <></>}
                    <Card.Text>
                        {category?.description}
                    </Card.Text>
                    <Card.Footer style={{ position: 'absolute', bottom: 0, left: 0, color: `${isClosed ? 'red' : 'white'}` }}>Closed {moment(category?.enddate).fromNow()}</Card.Footer>
                </Card.ImgOverlay>
            </Card>
        </div >
    )
}

export default StaffTab
