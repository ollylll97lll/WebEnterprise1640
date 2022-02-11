import React, { useEffect, useState } from 'react'
import moment from 'moment'
import './index.css'
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Input, Form, Row, Col, FormGroup, Label } from 'reactstrap';
import axios from 'axios';
import { useLocation } from 'react-router';
import { useSelector } from 'react-redux';
import { Container } from 'react-bootstrap';

function ViewDetailContent() {

    const userLogin = useSelector(state => state.userLogin)

    //set Deadline là duedate, biến deadline để check coi có trễ giờ deadline ko, thiếu cái update liên tục

    //Toggle của Comment (Show/Hide)

    //Toggle của Edit Form Modal
    const [modal, setModal] = useState(false);

    const toggleModalEdit = () => {
        setModal(!modal)
        setMessage('')
    };
    const location = useLocation()
    const [postDetail, setPostDetail] = useState('')


    const [userDetail, setUserDetail] = useState('')
    const [isLoading, setisLoading] = useState(true)

    const getPostDetail = async () => {
        try {
            const response = await axios.post('http://localhost:5001/api/post/getpostdetail',
                {
                    postId: location.state.postId
                })
            console.log('post', response.data)
            if (response?.data) {
                setisLoading(false)
                setPostDetail(response.data)
                setContent(response.data.result.content)
                setTitle(response.data.result.title)
            }
        } catch (error) {
            console.log(error)
        }
    }
    const getDataUser = async () => {
        try {
            const api = `http://localhost:5001/api/user/getone?userId=${location.state.userId}`
            const token = userLogin.userInfo.accessToken
            const response = await axios.post(api, {},
                {
                    headers: {
                        Authorization: `Bearer ` + token
                    }
                }
            )
            console.log('user', response.data.data)
            if (response?.data.success) {
                setUserDetail(response.data.data)
            }
        } catch (error) {
            console.log(error)
        }
    }
    console.log(location.state)

    const [content, setContent] = useState('')
    const onChangeContent = (e) => {
        setContent(e.target.value)
    }

    const [title, setTitle] = useState('')
    const [message, setMessage] = useState('')
    const onChangeTitle = (e) => {
        setTitle(e.target.value)
    }
    useEffect(() => {
        getPostDetail()
        getDataUser()
    }, [])

    const onPressEdit = async () => {
        try {
            const postid = postDetail.result._id
            const response = await axios.patch(`http://localhost:5001/api/post/edit?postId=${postid}`,
                {
                    title: title,
                    content: content,
                },
                {
                    headers: { Authorization: `Bearer ${userLogin.userInfo.accessToken}` },
                }
            )
            console.log(response)
            if (response?.data.success) {
                setisLoading(true)
                getPostDetail()
                setMessage({ mess: 'Edit successfully', type: 'text-success' })
            }
        } catch (error) {
            console.log(error)
            setMessage({ mess: 'Edit failed. Please try again', type: 'text-danger' })
        }
    }

    if (postDetail === '' || userDetail === '' || isLoading === true) {
        return (
            <div className={"container"} style={{
                display: 'flex', justifyContent: 'center', alignItems: 'center',
                flexDirection: 'column',
                padding: 20,
            }}>
                <div className="spinner-border" role="status">
                </div>
                <span style={{ padding: 20, }} >Loading...</span>
            </div>
        )
    }

    return (
        <div style={{ paddingTop: '2%' }} >
            <Col xs='12'>
                <Row className="row row-color">
                    <Col className="column-left pt-2 pb-2">Submission Title</Col>
                    <Col className="column-right pt-2 pb-2">{postDetail.result.title}</Col>
                </Row>
                <Row className="row">
                    <Col className="column-left pt-2 pb-2">Submission Content</Col>
                    <Col className="column-right pt-2 pb-2">{postDetail.result.content}</Col>
                </Row>

                <Row className="row">
                    <Col className="column-left pt-2 pb-2">Submission Category</Col>
                    <Col className="column-right pt-2 pb-2">{postDetail.catdetail.name}</Col>
                </Row>
                <Row className="row">
                    <Col className="column-left pt-2 pb-2">Submission User</Col>
                    <Col className="column-right pt-2 pb-2">{userDetail.email}</Col>
                </Row>
                <Row className="row">
                    <Col className="column-left pt-2 pb-2">Department User</Col>
                    <Col className="column-right pt-2 pb-2">{userDetail.department}</Col>
                </Row>
                <Row className="row">
                    <Col className="column-left pt-2 pb-2">Comment</Col>
                    <Col className="column-right pt-2 pb-2">{postDetail.cmts.length}</Col>
                </Row>
                <Row className="row">
                    <Col className="column-left pt-2 pb-2">Like</Col>
                    <Col className="column-right pt-2 pb-2">{postDetail.result.likes}</Col>
                </Row>

                {(postDetail.catdetail.enddate < postDetail.result.createdAt) || (postDetail.catdetail.enddate < postDetail.result.updateAt) ?
                    <Row className="row">
                        <Col className="column-left pt-2 pb-2">Submit Date</Col>
                        <Col className="column-right bg-danger pt-2 pb-2" style={{ color: '#fff' }} >{postDetail.result.updateAt ? moment(`${postDetail.result.updateAt}`).format('dddd, DD/MM/YYYY, HH:mm') : moment(postDetail.result.createdAt).format('dddd, DD/MM/YYYY, HH:mm')}</Col>
                    </Row>
                    :
                    <Row className="row">
                        <Col className="column-left pt-2 pb-2">Submit Date</Col>
                        <Col className="column-right-color pt-2 pb-2">{postDetail.result.updateAt ? moment(`${postDetail.result.updateAt}`).format('dddd, DD/MM/YYYY, HH:mm') : moment(postDetail.result.createdAt).format('dddd, DD/MM/YYYY, HH:mm')}</Col>
                    </Row>
                }
                {(postDetail.catdetail.enddate < postDetail.result.createdAt) || (postDetail.catdetail.enddate < postDetail.result.updateAt) ?
                    <Row className="row">
                        <Col className="column-left pt-2 pb-2">Last modified</Col>
                        <Col className="column-right bg-danger pt-2 pb-2" style={{ color: '#fff' }} >{postDetail.result.updateAt ? moment(`${postDetail.result.updateAt}`).format('dddd, DD/MM/YYYY, HH:mm') : moment(postDetail.result.createdAt).format('dddd, DD/MM/YYYY, HH:mm')}</Col>
                    </Row>
                    :
                    <Row className="row">
                        <Col className="column-left pt-2 pb-2">Last modified</Col>
                        <Col className="column-right-color pt-2 pb-2">{postDetail.result.updateAt ? moment(`${postDetail.result.updateAt}`).format('dddd, DD/MM/YYYY, HH:mm') : moment(postDetail.result.createdAt).format('dddd, DD/MM/YYYY, HH:mm')}</Col>
                    </Row>
                }
                <Row className="row">
                    <Col className="column-left pt-2 pb-2">Due Date</Col>
                    <Col className="column-right pt-2 pb-2">{moment(`${postDetail.catdetail.enddate}`).format('dddd, DD/MM/YYYY, HH:mm')}</Col>
                </Row>
                <Row className="row">
                    <Col className="column-left pt-2 pb-2">File submissions</Col>
                    {postDetail.result.docfolder ?
                        <a className="column-right pt-2 pb-2" href={`http://localhost:5001/api/upload/zipdownload?foldername=${postDetail.result.docfolder}&nameFile=${postDetail.result.title + '_' + userDetail.email + '_' + userDetail.department}`}>{postDetail.result.docfolder != '' ? postDetail.result.docfolder : "No file submitted"}</a>
                        :
                        <Col className="column-right pt-2 pb-2">No file submitted</Col>
                    }
                </Row>
            </Col>
            {
                location.state.role.toLowerCase() === 'staff' &&
                <div className="text-center mt-4">
                    {(postDetail.catdetail.enddate < postDetail.result.createdAt) || (postDetail.catdetail.enddate < postDetail.result.updateAt) ?
                        <Button disabled outline color="primary mr-2">Edit submission</Button>
                        :
                        // Nhớ sửa cái vụ phải check validation rồi mới cho submit
                        <Button outline color="primary mr-2" onClick={toggleModalEdit}>Edit submission</Button>}
                    <Modal isOpen={modal} toggle={toggleModalEdit}>
                        <ModalHeader toggle={toggleModalEdit}>Editing submission</ModalHeader>
                        <ModalBody>
                            {message != '' &&
                                <Label for="title" className={message.type}>{message.mess}</Label>
                            }
                            <Form>
                                <Row form>
                                    <Col md={12}>
                                        <FormGroup>
                                            <Label for="title">Title <span className='text-danger'>*</span></Label>
                                            <Input onChange={onChangeTitle} type="text" name="title" id="title" placeholder="Title" required value={title} />
                                        </FormGroup>
                                    </Col>
                                </Row>
                                <Row form>
                                    <Col md={12}>
                                        <FormGroup>
                                            <Label for="description">Brief Description</Label>
                                            <Input onChange={onChangeContent} type="textarea" style={{ height: '150px' }} name="description" id="description" placeholder="Give a short description" value={content} />
                                        </FormGroup>
                                    </Col>
                                </Row>
                            </Form>
                        </ModalBody>
                        <ModalFooter>
                            <Button color="primary" onClick={() => { onPressEdit() }}>Edit</Button>{' '}
                            <Button color="secondary" onClick={toggleModalEdit}>Cancel</Button>
                        </ModalFooter>
                    </Modal>
                    {/* {moment(`${postDetail.catdetail.enddate}`).format('dddd, DD/MM/YYYY, HH:mm').includes('ago') ?
                        <Button disabled outline color="primary mr-2">Remove submission</Button>
                        :
                        <Button outline color="primary mr-2" onClick={toggleModalEdit}>Remove submission</Button>} */}
                    {(postDetail.catdetail.enddate < postDetail.result.createdAt) || (postDetail.catdetail.enddate < postDetail.result.updateAt) ? <div className='text-danger mt-4'>You're late</div> : null}
                </div>
            }
        </div >
    )
}

export default ViewDetailContent
