import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useLocation } from 'react-router-dom';
import {
    Button, Col, Collapse, FormGroup, Input, Label, Modal, ModalBody, ModalFooter, ModalHeader, Nav, Navbar, NavbarBrand, NavbarToggler, NavItem,
    NavLink
} from 'reactstrap';
import { signout } from '../../redux folder/actions/useractions';
import './index.css';

const StaffNav = (props) => {
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

    const [oldPass, setOldPass] = useState('')
    const onChangeOldPass = (e) => {
        setOldPass(e.target.value)
    }

    const [newPass, setNewPass] = useState('')
    const onChangeNewPass = (e) => {
        setNewPass(e.target.value)
    }

    const [confirmNewPass, setConfirmNewPass] = useState('')
    const onChangeConfirmNewPass = (e) => {
        setConfirmNewPass(e.target.value)
    }

    const [message, setMessage] = useState('')

    const onPressChangePass = async () => {
        if (newPass != confirmNewPass) {
            setMessage({ mess: 'Password and confirm password does not match', type: 'text-danger' })
            return
        }
        try {
            const response = await axios.post(`http://localhost:5001/api/user/changePassword`,
                {
                    currentPassword: oldPass, newPassword: newPass
                },
                {
                    headers: { Authorization: `Bearer ${userLogin.userInfo.accessToken}` }
                }
            )
            console.log(response)
            if (response.data?.success) {
                setMessage({ mess: response.data.message, type: 'text-success' })
            }
        } catch (error) {
            console.log(error)
            setMessage({ mess: 'Failed to update your password please try again', type: 'text-danger' })
        }
    }

    return (
        <Navbar light expand="md">
            <NavbarBrand href="/" >
                <div className='d-flex align-items-center'>
                    <div style={{ marginLeft: "-10px" }} />
                    <div className='ml-2' />
                    FPT Greenwich Contribution Forum
                </div>
            </NavbarBrand>
            <NavbarToggler onClick={toggle} />
            <Collapse isOpen={isOpen} navbar>
                <Nav className="ml-auto" navbar>
                    <Col xs="auto">
                        <NavItem>
                            <NavLink href='/staff'>Staff</NavLink>
                        </NavItem>
                    </Col>
                    <Col xs="auto">
                        <NavItem>
                            <NavLink onClick={toggleModal}>Change Password</NavLink>
                            <Modal isOpen={modal} toggle={toggleModal}>
                                <ModalHeader toggle={toggleModal}>Change Password</ModalHeader>
                                <ModalBody>
                                    {message != '' &&
                                        <Label className={message.type}>{message.mess} </Label>
                                    }
                                    <FormGroup>
                                        <Label for="oldPassword">Old Password <span className="text-danger">*</span></Label>
                                        <Input onChange={onChangeOldPass} type="password" name="oldPassword" id="oldPassword" placeholder="Old Password" required />
                                    </FormGroup>
                                    <FormGroup>
                                        <Label for="newPassword">New Password <span className="text-danger">*</span></Label>
                                        <Input onChange={onChangeNewPass} type="password" name="newPassword" id="newPassword" placeholder="New Password" required />
                                    </FormGroup>
                                    <FormGroup>
                                        <Label for="confirmPassword">Confirm Password <span className="text-danger">*</span></Label>
                                        <Input onChange={onChangeConfirmNewPass} type="password" name="confirmPassword" id="confirmPassword" placeholder="Confirm new password" required />
                                    </FormGroup>
                                </ModalBody>
                                <ModalFooter>
                                    <Button color="primary" onClick={() => { onPressChangePass() }}>Change Password</Button>{' '}
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

export default StaffNav
