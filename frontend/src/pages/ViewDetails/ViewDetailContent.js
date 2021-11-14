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

    const toggleComment = (e) => {
        e.preventDefault();
        setToggle(!toggle);
    }

    //Toggle của Edit Form Modal
    const [modal, setModal] = useState(false);

    const toggleModalEdit = () => setModal(!modal);
    const location = useLocation()
    const [postDetail, setPostDetail] = useState('')
    console.log(location.state)

    const getPostDetail = async () => {
        try {
            const response = await axios.post('http://localhost:5001/api/post/getpostdetail',
                {
                    postId: location.state.postId
                })
            console.log(response.data)
            if (response?.data) {

            }
        } catch (error) {
            console.log(error)
        }
    }
    const getDataUser = async () => {
        try {
            const response = await axios.post(`http://localhost:5001/api/user/getone?userId=${location.state.userId}`,
                {
                    headers: {
                        "Authorization": `Bearer ${userLogin.userInfo.accessToken}`
                    }
                }
            )
            console.log(response)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        getPostDetail()
        getDataUser()
    }, [])

    return (
        <div style={{ paddingTop: '2%' }} >
            <div className="col-12">
                <div className="row row-color">
                    <div className="column-left pt-2 pb-2">Submission Title</div>
                    <div className="column-right pt-2 pb-2">{data[0].title}</div>
                </div>

                <div className="row">
                    <div className="column-left pt-2 pb-2">Submission Type</div>
                    <div className="column-right pt-2 pb-2">{data[0].type}</div>
                </div>

                <div className="row row-color">
                    <div className="column-left pt-2 pb-2">Submission status</div>
                    <div className="column-right-color pt-2 pb-2">{data[0].status}</div>
                </div>

                <div className="row">
                    <div className="column-left pt-2 pb-2">Due date</div>
                    <div className="column-right pt-2 pb-2">{data[0].dueDate}</div>
                </div>
                <div className="row row-color">
                    <div className="column-left pt-2 pb-2">Last modified</div>
                    <div className="column-right-color pt-2 pb-2">{data[0].lastModified}</div>
                </div>
                <div className="row">
                    <div className="column-left pt-2 pb-2">File submissions</div>
                    <div className="column-right pt-2 pb-2">{data[0].fileSubmission}</div>
                </div>
                <div className="row row-color">
                    <div className="column-left pt-2 pb-2">Submission comments</div>
                    <div className="column-right pt-2 pb-2">
                        <p style={{ cursor: 'pointer' }} onClick={toggleComment}>Show comment ({data[0].comments.quantity})</p>
                        {toggle ? <div>
                            <div>{conversation.map((conversation) => (
                                <div>
                                    <div className="row">
                                        <div className="col-5" style={{ color: 'red' }}>Coordinator: </div>
                                        <div className="col-5" style={{ color: 'red' }}>{conversation.coordinator}</div>
                                    </div>
                                    <div className="row">
                                        <div className="col-5">Student: </div>
                                        <div className="col-5">{conversation.student}</div>
                                    </div>

                                </div>
                            ))}
                            </div>
                            <div className="row">
                                <div className="col-5"></div>
                                <div className="col-5"><textarea className="w-100" row='3' cols='20' label='Comment'></textarea></div>
                            </div>
                            <div className="row">
                                <div className="col-5"></div>
                                <div className="col-5">
                                    <Button className='float-right ml-2' outline color="primary">Cancel</Button>
                                    <Button className='float-right' outline color="primary">Save comment</Button>
                                </div>
                            </div>
                        </div> : null}
                    </div>
                </div>
            </div>
            <div className="text-center mt-4">
                {deadline.includes('ago') ?
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
                                        <Input type="text" name="title" id="title" placeholder="Title" required />
                                    </FormGroup>
                                </Col>
                                <Col md={5}>
                                    <FormGroup>
                                        <Label for="type">Contribution Type <span className='text-danger'>*</span></Label>
                                        <Input type="select" name="type" id="type">
                                            <option>Articles</option>
                                            <option>Photographs</option>
                                        </Input>
                                    </FormGroup>
                                </Col>
                            </Row>
                            <Row form>
                                <Col md={12}>
                                    <FormGroup>
                                        <Label for="description">Brief Description</Label>
                                        <Input type="textarea" style={{ height: '150px' }} name="description" id="description" placeholder="Give a short description" />
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
                {deadline.includes('ago') ?
                    <Button disabled outline color="primary mr-2">Remove submission</Button>
                    :
                    <Button outline color="primary mr-2" onClick={toggleModalEdit}>Remove submission</Button>}
                {deadline.includes('ago') ? <div className='text-danger mt-4'>You're late</div> : null}
            </div>
        </div>
    )
}

export default ViewDetailContent
