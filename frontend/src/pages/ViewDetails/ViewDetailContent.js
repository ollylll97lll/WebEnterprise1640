import React, { useEffect, useState } from 'react'
import moment from 'moment'
import './index.css'
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Input, Form, Row, Col, FormGroup, Label } from 'reactstrap';
import axios from 'axios';
import { useLocation } from 'react-router';
import { useSelector } from 'react-redux';

function ViewDetailContent() {

    const userLogin = useSelector(state => state.userLogin)

    //set Deadline là duedate, biến deadline để check coi có trễ giờ deadline ko, thiếu cái update liên tục
    const [dueDate, setDueDate] = useState(moment('28/07/2021 18:37:00', 'DD/MM/YYYY HH:mm:ss'));

    const deadline = moment(dueDate, 'DD/MM/YYYY HH:mm:ss').fromNow();

    //Lấy data đá từ trang Coordinator (StudentContribution) hoặc History của Student để đá qua đây hiển thị, chưa sửa được chỗ call comments
    const [data, setData] = useState([
        {
            title: 'Submission 1',
            type: 'Article',
            status: 'Submitted for grading',
            dueDate: moment().format('dddd, DD/MM/YYYY, HH:mm'),
            lastModified: moment().format('dddd, DD/MM/YYYY, HH:mm'),
            fileSubmission: '/file/docx',
            comments: {
                quantity: 4,
                content: [
                    {
                        coordinator: 'Your subbmission should have some brief description',
                        student: 'I got it',
                    },
                    {
                        coordinator: 'It seems good',
                        student: 'Thanks',
                    },
                ]
            }
        }
    ]);

    const conversation = data[0].comments.content;

    //Toggle của Comment (Show/Hide)
    const [toggle, setToggle] = useState(false);

    //Toggle của Edit Form Modal
    const [modal, setModal] = useState(false);

    const toggleModalEdit = () => setModal(!modal);
    const location = useLocation()
    const [postDetail, setPostDetail] = useState('')


    const [userDetail, setUserDetail] = useState('')

    const getPostDetail = async () => {
        try {
            const response = await axios.post('http://localhost:5001/api/post/getpostdetail',
                {
                    postId: location.state.postId
                })
            console.log('post', response.data)
            if (response?.data) {
                setPostDetail(response.data)
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

    useEffect(() => {
        getPostDetail()
        getDataUser()
    }, [])

    const onPressEdit = () => {

    }

    if (postDetail === '' || userDetail === '') {
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
            <div className="col-12">
                <div className="row row-color">
                    <div className="column-left pt-2 pb-2">Submission Title</div>
                    <div className="column-right pt-2 pb-2">{postDetail.result.title}</div>
                </div>
                <div className="row">
                    <div className="column-left pt-2 pb-2">Submission Content</div>
                    <div className="column-right pt-2 pb-2">{postDetail.result.content}</div>
                </div>

                <div className="row">
                    <div className="column-left pt-2 pb-2">Submission Category</div>
                    <div className="column-right pt-2 pb-2">{postDetail.catdetail.name}</div>
                </div>
                <div className="row">
                    <div className="column-left pt-2 pb-2">Submission User</div>
                    <div className="column-right pt-2 pb-2">{userDetail.email}</div>
                </div>
                <div className="row">
                    <div className="column-left pt-2 pb-2">Department User</div>
                    <div className="column-right pt-2 pb-2">{userDetail.department}</div>
                </div>
                <div className="row">
                    <div className="column-left pt-2 pb-2">Comment</div>
                    <div className="column-right pt-2 pb-2">{postDetail.cmts.length}</div>
                </div>
                <div className="row">
                    <div className="column-left pt-2 pb-2">Like</div>
                    <div className="column-right pt-2 pb-2">{postDetail.result.likes}</div>
                </div>

                {(postDetail.catdetail.enddate < postDetail.result.createdAt) || (postDetail.catdetail.enddate < postDetail.result.updateAt) ?
                    <div className="row">
                        <div className="column-left pt-2 pb-2">Submit Date</div>
                        <div className="column-right bg-danger pt-2 pb-2" style={{ color: '#fff' }} >{postDetail.result.updateAt ? moment(`${postDetail.result.updateAt}`).format('dddd, DD/MM/YYYY, HH:mm') : moment(postDetail.result.createdAt).format('dddd, DD/MM/YYYY, HH:mm')}</div>
                    </div>
                    :
                    <div className="row">
                        <div className="column-left pt-2 pb-2">Submit Date</div>
                        <div className="column-right-color pt-2 pb-2">{postDetail.result.updateAt ? moment(`${postDetail.result.updateAt}`).format('dddd, DD/MM/YYYY, HH:mm') : moment(postDetail.result.createdAt).format('dddd, DD/MM/YYYY, HH:mm')}</div>
                    </div>
                }
                {(postDetail.catdetail.enddate < postDetail.result.createdAt) || (postDetail.catdetail.enddate < postDetail.result.updateAt) ?
                    <div className="row">
                        <div className="column-left pt-2 pb-2">Last modified</div>
                        <div className="column-right bg-danger pt-2 pb-2" style={{ color: '#fff' }} >{postDetail.result.updateAt ? moment(`${postDetail.result.updateAt}`).format('dddd, DD/MM/YYYY, HH:mm') : moment(postDetail.result.createdAt).format('dddd, DD/MM/YYYY, HH:mm')}</div>
                    </div>
                    :
                    <div className="row">
                        <div className="column-left pt-2 pb-2">Last modified</div>
                        <div className="column-right-color pt-2 pb-2">{postDetail.result.updateAt ? moment(`${postDetail.result.updateAt}`).format('dddd, DD/MM/YYYY, HH:mm') : moment(postDetail.result.createdAt).format('dddd, DD/MM/YYYY, HH:mm')}</div>
                    </div>
                }
                <div className="row">
                    <div className="column-left pt-2 pb-2">Due Date</div>
                    <div className="column-right pt-2 pb-2">{moment(`${postDetail.catdetail.enddate}`).format('dddd, DD/MM/YYYY, HH:mm')}</div>
                </div>
                <div className="row">
                    <div className="column-left pt-2 pb-2">File submissions</div>
                    {postDetail.result.docfolder ?
                        <a className="column-right pt-2 pb-2" href={`http://localhost:5001/api/upload/zipdownload?foldername=${postDetail.result.docfolder}&nameFile=${postDetail.result.title + '_' + userDetail.email + '_' + userDetail.department}`}>{postDetail.result.docfolder != '' ? postDetail.result.docfolder : "No file submitted"}</a>
                        :
                        <div className="column-right pt-2 pb-2">No file submitted</div>
                    }
                </div>
            </div>
            {
                location.state.role.toLowerCase() === 'staff' &&
                <div className="text-center mt-4">
                    {moment(`${postDetail.catdetail.enddate}`).format('dddd, DD/MM/YYYY, HH:mm').includes('ago') ?
                        <Button disabled outline color="primary mr-2">Edit submission</Button>
                        :
                        // Nhớ sửa cái vụ phải check validation rồi mới cho submit
                        <Button outline color="primary mr-2" onClick={toggleModalEdit}>Edit submission</Button>}
                    <Modal isOpen={modal} toggle={toggleModalEdit}>
                        <ModalHeader toggle={toggleModalEdit}>Editing submission</ModalHeader>
                        <ModalBody>
                            <Form>
                                <Row form>
                                    <Col md={7}>
                                        <FormGroup>
                                            <Label for="title">Title <span className='text-danger'>*</span></Label>
                                            <Input type="text" name="title" id="title" placeholder="Title" required value={postDetail.result.title} />
                                        </FormGroup>
                                    </Col>
                                </Row>
                                <Row form>
                                    <Col md={12}>
                                        <FormGroup>
                                            <Label for="description">Brief Description</Label>
                                            <Input type="textarea" style={{ height: '150px' }} name="description" id="description" placeholder="Give a short description" value={postDetail.result.content} />
                                        </FormGroup>
                                    </Col>
                                </Row>
                                <Row form >
                                    <Col md={12} >
                                        <FormGroup >
                                            <Input type="file" name="upload" id="upload" required />
                                        </FormGroup>
                                    </Col>
                                </Row>
                            </Form>
                        </ModalBody>
                        <ModalFooter>
                            <Button color="primary" onClick={toggleModalEdit}>Edit submission</Button>{' '}
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
