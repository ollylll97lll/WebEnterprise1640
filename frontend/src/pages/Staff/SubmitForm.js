import axios from 'axios';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Button, Col, Form, FormGroup, Input, Label, Modal, ModalBody, ModalFooter, ModalHeader, Row } from 'reactstrap';
import { arrayIsEmpty } from '../../utils/function';

function SubmitForm(props) {
    const {
        buttonLabel,
        className
    } = props;

    const userLogin = useSelector(state => state.userLogin)

    //Mở modal Terms and Conditions
    const [modal, setModal] = useState(false);
    const [category, setCategory] = useState('')
    const [catPick, setCatPick] = useState('')
    const [title, setTitle] = useState('')
    const [content, setcontent] = useState('')
    const [deadlineTIme, setDeadlineTIme] = useState('')


    const getCategory = async () => {
        try {
            const fetch = await axios.get(`http://localhost:5001/api/category/getall`)
            console.log('datafectch: ', fetch.data)
            if (fetch?.data) {
                const listCat = []
                fetch.data.map(item => {
                    return item.closuredate < Date.now() ? null : listCat.push(item)
                })
                setCategory(listCat)
            }
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        getCategory()
    }, [])

    useEffect(() => {
        if (!arrayIsEmpty(category)) {
            const found = category.find(item => item._id == catPick)
            if (found?.closuredate) {
                console.log(catPick)
                console.log(moment(`${found.closuredate}`) < moment(Date.now()))
                setDeadlineTIme(found.closuredate)
            }
        }
    }, [catPick])

    const handleChange = (e) => {
        const value = e.target.value
        setCatPick(value)
    }

    const onChangeTitle = e => {
        const value = e.target.value
        setTitle(value)
    }

    const onChangeContent = e => {
        const value = e.target.value
        setcontent(value)
    }
    const [message, setMessage] = useState('')

    const onClickSubmit = async () => {
        console.log(title, content, catPick)
        if (title == '' || catPick == '' || content == '') {
            setMessage({ mess: 'Please input field', type: 'text-danger' })
            return
        }
        if (!onCheckCondition) {
            setMessage({ mess: 'Please accept Terms & Conditions', type: 'text-danger' })
            return
        }
        try {
            const fetch = await axios.post(`http://localhost:5001/api/post/create`,
                {
                    categoryId: catPick, title: title, content: content
                },
                {
                    headers: {
                        "Authorization": `Bearer ${userLogin.userInfo.accessToken}`
                    }
                }
            )
            console.log(fetch.data)
            if (fetch.data.success) {
                setCatPick('')
                setTitle('')
                setcontent('')
                setDeadlineTIme('')
                setMessage({ mess: 'Add successfully', type: 'text-success' })
                window.open(`http://localhost:3000/mulup?postid=${fetch.data.postId}`, "_blank", "location=yes,height=600,width=520,scrollbars=yes,status=yes")
            }
        } catch (error) {
            console.log(error)
        }
    }

    const [onCheckCondition, setOnCheckCondition] = useState(false)

    const toggle = () => setModal(!modal);

    if (arrayIsEmpty(category)) {
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
            {message != "" &&
                <Label for="title" className={message.type}>{message.mess}</Label>

            }
            <Form>

                <Row form>
                    <Col md={7}>
                        <FormGroup>
                            <Label for="title">Title <span className='text-danger'>*</span></Label>
                            <Input type="text" name="title" id="title" placeholder="Title" required value={title} onChange={onChangeTitle} />
                        </FormGroup>
                    </Col>
                    <Col md={5}>
                        <FormGroup>
                            <Label for="type">Category <span className='text-danger'>*</span></Label>
                            <Input type="select" name="type" id="type" value={catPick} onChange={handleChange}>
                                <option value={''}>Select Category</option>
                                {category.map(item => {
                                    return <option key={item._id} value={item._id}>{item.name}</option>
                                })}
                            </Input>
                        </FormGroup>
                    </Col>
                </Row>
                <Row form>
                    <Col md={12}>
                        <FormGroup>
                            <Label for="description">Description</Label>
                            <Input type="textarea" value={content} style={{ height: '150px' }} name="description" id="description" placeholder="Give a short description" onChange={onChangeContent} />
                        </FormGroup>
                    </Col>
                </Row>
                <Row form>
                    <Col md={12} className="text-center">
                        <FormGroup check >
                            <Label>
                                <Input type="checkbox" required value={onCheckCondition} onClick={() => setOnCheckCondition(!onCheckCondition)} />{' '}
                                I have read and agreed to the <a onClick={toggle} style={{ color: 'blue' }} > Terms and Conditions </a><span className='text-danger'>*</span>
                                <Modal isOpen={modal} toggle={toggle} className={className}>
                                    <ModalHeader toggle={toggle}>Terms and Conditions</ModalHeader>
                                    <ModalBody>
                                        <p>1. You are responsible for your uploads.</p>
                                        <p>2. You can upload Image or Doc file one by one at the same time.</p>
                                        <p>3. ZIP your files, if you want to upload more than 1 file.</p>
                                        <p>4. Read the note carefully before moving on.</p>
                                    </ModalBody>
                                    <ModalFooter>
                                        <Button outline color="primary" onClick={toggle}>Agree and Close</Button>{' '}
                                    </ModalFooter>
                                </Modal>
                            </Label>
                        </FormGroup>
                    </Col>
                </Row>
                &nbsp;
                <Row form>
                    <Col md={12} className="text-center">
                        {((deadlineTIme == '') ?
                            <Button disabled outline color="primary">Submit</Button>
                            :
                            (moment(`${deadlineTIme}`) < moment(Date.now()) ?
                                <div>
                                    <Button disabled outline color="primary">Submit</Button>
                                    <p className="text-danger mt-2">Season closed. You cannot submit anymore</p>
                                </div>
                                :
                                <Button outline color="primary" onClick={() => { onClickSubmit() }}>Submit</Button>))}
                    </Col>
                </Row>
            </Form>
        </div>
    )
}

export default SubmitForm
