import React, { useState } from 'react';
import {
    Button, Col, Collapse, FormGroup, Input, Label, Modal, ModalBody, ModalFooter, ModalHeader, Nav, Navbar, NavbarBrand, NavbarToggler, NavItem,
    NavLink
} from 'reactstrap';
import './index.css';

const GuestNav = (props) => {
    const { buttonLabel } = props;

    const [isOpen, setIsOpen] = useState(false);

    const toggle = () => setIsOpen(!isOpen);

    const [modal, setModal] = useState(false);

    const toggleModal = () => setModal(!modal);

    return (
        <Navbar light expand="md">
            <NavbarBrand href="/" >
                <div className='d-flex align-items-center'>
                    <div style={{ marginLeft: "-10px" }} />
                    <div className='ml-2' />
                    FPT Greenwich Magazine System
                </div>
            </NavbarBrand>
            <NavbarToggler onClick={toggle} />
            <Collapse isOpen={isOpen} navbar>
                <Nav className="ml-auto" navbar>
                    <Col xs="auto">
                        <NavItem>
                            <NavLink href='#'>Manager</NavLink>
                        </NavItem>
                    </Col>
                    <Col xs="auto">
                        <NavItem>
                            <NavLink onClick={toggleModal}>Change Password</NavLink>
                            <Modal isOpen={modal} toggle={toggleModal}>
                                <ModalHeader toggle={toggleModal}>Change Password</ModalHeader>
                                <ModalBody>
                                    <FormGroup>
                                        <Label for="oldPassword">Old Password <span className="text-danger">*</span></Label>
                                        <Input type="password" name="oldPassword" id="oldPassword" placeholder="Old Password" required />
                                    </FormGroup>
                                    <FormGroup>
                                        <Label for="newPassword">New Password <span className="text-danger">*</span></Label>
                                        <Input type="password" name="newPassword" id="newPassword" placeholder="New Password" required />
                                    </FormGroup>
                                    <FormGroup>
                                        <Label for="confirmPassword">Confirm Password <span className="text-danger">*</span></Label>
                                        <Input type="password" name="confirmPassword" id="confirmPassword" placeholder="Confirm new password" required />
                                    </FormGroup>
                                </ModalBody>
                                <ModalFooter>
                                    <Button color="primary" onClick={toggleModal}>Change Password</Button>{' '}
                                    <Button color="secondary" onClick={toggleModal}>Cancel</Button>
                                </ModalFooter>
                            </Modal>
                        </NavItem>
                    </Col>
                    <Col xs="auto">
                        <NavItem>
                            <NavLink href='#'>Logout</NavLink>
                        </NavItem>
                    </Col>
                </Nav>
            </Collapse>
        </Navbar>
    )
};

export default GuestNav
