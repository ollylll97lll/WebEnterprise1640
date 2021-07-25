import React, { useState } from 'react'
import { Button, Form, FormGroup, Label, Input, FormText, Col, Row } from 'reactstrap';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

function SubmitForm(props) {
    const {
        buttonLabel,
        className
    } = props;

    const [modal, setModal] = useState(false);

    const toggle = () => setModal(!modal);
    return (
        <div style={{ paddingTop: '2%' }} >
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
                <Row form>
                    <Col md={12} className="text-center">
                        <FormGroup check >
                            <Label>
                                <Input type="checkbox" required />{' '}
                                I have read and agree to the <a onClick={toggle} style={{ color: 'blue' }}> Terms and Conditions </a><span className='text-danger'>*</span>
                                <Modal isOpen={modal} toggle={toggle} className={className}>
                                    <ModalHeader toggle={toggle}>Terms and Conditions</ModalHeader>
                                    <ModalBody>
                                        <p>1. You are responsible to your uploads.</p>
                                        <p>2. You can upload one by one Image or Doc file at the same time.</p>
                                        <p>3. If you want to upload more than 1 file, ZIP it.</p>
                                        <p>4. Read carefully before close.</p>
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
                        <Button outline color="primary">Submit</Button>
                    </Col>
                </Row>
            </Form>
        </div>
    )
}

export default SubmitForm
