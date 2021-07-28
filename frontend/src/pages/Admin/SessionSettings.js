import React, { useState } from 'react'
import { Button, Table, Modal, ModalHeader, ModalBody, ModalFooter, Input, Form, Row, Col, FormGroup, Label } from 'reactstrap';
import DatePicker from "react-datepicker";

function SessionSettings() {
    const [data, setData] = useState([
        {
            name: 'Winter-2021',
            start: '01/01/2021',
            end: '15/03/2021',
            topic: 'Covid-19'
        },
        {
            name: 'Spring-2021',
            start: '16/03/2021',
            end: '15/06/2021',
            topic: 'Talkshow'
        },
        {
            name: 'Summer-2021',
            start: '16/06/2021',
            end: '15/09/2021',
            topic: 'Soft Skills'
        },
        {
            name: 'Fall-2021',
            start: '16/09/2021',
            end: '31/12/2021',
            topic: 'Books'
        }
    ]);

    const [dateRange, setDateRange] = useState([null, null]);
    const [startDate, endDate] = dateRange;

    const [modal, setModal] = useState(false);

    const toggleModalAdd = () => setModal(!modal);

    const [modalEdit, setModalEdit] = useState(false);

    const toggleModalEdit = () => setModalEdit(!modalEdit);

    return (
        <div style={{ paddingTop: '2%' }} >
            <div><span style={{ textDecorationLine: 'underline' }}>Current Sessions</span>: <span className="font-weight-bold">{data[0].name}</span></div>
            <div><span style={{ textDecorationLine: 'underline' }}>Duration</span>: <span className="font-weight-bold">{data[0].start} - {data[0].end}</span></div>
            <div><span style={{ textDecorationLine: 'underline' }}>Session Topic</span>: <span className="font-weight-bold">{data[0].topic}</span></div>
            <div className="mt-4"><Button outline color="primary" onClick={toggleModalAdd}>Add Session</Button></div>
            {/* Nhớ sửa cái vụ phải check validation rồi mới cho submit */}
            <Modal isOpen={modal} toggle={toggleModalAdd}>
                <ModalHeader toggle={toggleModalAdd}>Add Session</ModalHeader>
                <ModalBody>
                    <Form>
                        <Row form>
                            <Col md={12}>
                                <FormGroup>
                                    <Label for="sessionName">Session name <span className='text-danger'>*</span></Label>
                                    <Input type="text" name="sessionName" id="sessionName" placeholder="Session name" required />
                                </FormGroup>
                            </Col>
                        </Row>
                        <Row form>
                            <Col md={12}>
                                Duration: <span className='text-danger'>*</span>
                                <div className='w-100'>
                                    <DatePicker
                                        selectsRange={true}
                                        startDate={startDate}
                                        endDate={endDate}
                                        onChange={(update) => {
                                            setDateRange(update);
                                        }}
                                        withPortal
                                        className='w-100'
                                    />
                                </div>
                            </Col>
                        </Row>
                        <Row form className='mt-3'>
                            <Col md={12}>
                                <FormGroup>
                                    <Label for="sessionTopic">Session Topic <span className='text-danger'>*</span></Label>
                                    <Input type="text" name="sessionTopic" id="sessionTopic" placeholder="Session Topic" required />
                                </FormGroup>
                            </Col>
                        </Row>
                    </Form>
                </ModalBody>
                <ModalFooter>
                    <Button color="primary" onClick={toggleModalAdd}>Add New Sesson</Button>{' '}
                    <Button color="secondary" onClick={toggleModalAdd}>Cancel</Button>
                </ModalFooter>
            </Modal>
            <Table className='mt-2' responsive hover>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Start</th>
                        <th>End</th>
                        <th>Topic</th>
                        <th>Function</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((data) => (
                        <tr>
                            <td>{data.name}</td>
                            <td>{data.start}</td>
                            <td>{data.end}</td>
                            <td>{data.topic}</td>
                            <td><Button outline color="primary" onClick={toggleModalEdit}>Edit</Button></td>
                            {/* Nhớ sửa cái vụ phải check validation rồi mới cho submit */}
                            <Modal isOpen={modalEdit} toggle={toggleModalEdit}>
                                <ModalHeader toggle={toggleModalEdit}>Edit Session</ModalHeader>
                                <ModalBody>
                                    <Form>
                                        <Row form>
                                            <Col md={12}>
                                                <FormGroup>
                                                    <Label for="sessionName">Session name <span className='text-danger'>*</span></Label>
                                                    <Input type="text" name="sessionName" id="sessionName" placeholder="Session name" required />
                                                </FormGroup>
                                            </Col>
                                        </Row>
                                        <Row form>
                                            <Col md={12}>
                                                Duration: <span className='text-danger'>*</span>
                                                <div className='w-100'>
                                                    <DatePicker
                                                        selectsRange={true}
                                                        startDate={startDate}
                                                        endDate={endDate}
                                                        onChange={(update) => {
                                                            setDateRange(update);
                                                        }}
                                                        withPortal
                                                        className='w-100'
                                                    />
                                                </div>
                                            </Col>
                                        </Row>
                                        <Row form className='mt-3'>
                                            <Col md={12}>
                                                <FormGroup>
                                                    <Label for="sessionTopic">Session Topic <span className='text-danger'>*</span></Label>
                                                    <Input type="text" name="sessionTopic" id="sessionTopic" placeholder="Session Topic" required />
                                                </FormGroup>
                                            </Col>
                                        </Row>
                                    </Form>
                                </ModalBody>
                                <ModalFooter>
                                    <Button color="primary" onClick={toggleModalEdit}>Edit Session</Button>{' '}
                                    <Button color="secondary" onClick={toggleModalEdit}>Cancel</Button>
                                </ModalFooter>
                            </Modal>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </div>
    )
}

export default SessionSettings
