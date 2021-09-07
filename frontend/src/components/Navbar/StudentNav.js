import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useLocation } from 'react-router-dom';
import {
    Button, Col, Collapse, FormGroup, Input, Label, Modal, ModalBody, ModalFooter, ModalHeader, Nav, Navbar, NavbarBrand, NavbarToggler, NavItem,
    NavLink
} from 'reactstrap';
import { signout } from '../../redux folder/actions/useractions';
import './index.css';

const StudentNav = (props) => {
    const dispatch = useDispatch();
    // const { buttonLabel } = props;

    const [isOpen, setIsOpen] = useState(false);

    const toggle = () => setIsOpen(!isOpen);

    const [modal, setModal] = useState(false);

    const toggleModal = () => setModal(!modal);

    const userLogin = useSelector(state => state.userLogin)
    const { userInfo, loading, error } = userLogin;

    const signoutHandler = () => {
        dispatch(signout());
    }

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
                            <NavLink href='/student'>Student</NavLink>
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
                                        <Input type="password" name="confirmPassword" id="confirmPassword" placeholder="Confirm New Password" required />
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
                            <NavLink href='/' onClick={signoutHandler}>Logout</NavLink>
                        </NavItem>
                    </Col>
                </Nav>
            </Collapse>
        </Navbar>
    )
};

export default StudentNav
