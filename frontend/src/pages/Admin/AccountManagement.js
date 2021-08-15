import Pagination from 'rc-pagination';
import "rc-pagination/assets/index.css";
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Col, CustomInput, Form, FormGroup, Input, Label, Modal, ModalBody, ModalFooter, ModalHeader, Row, Table } from 'reactstrap';
import LoadingBox from '../../components/Return Boxes/LoadingBox';
import MessageBox from '../../components/Return Boxes/MessageBox';
import { register } from '../../redux folder/actions/useractions';

function AccountManagement() {
    // dispatch initiation
    const dispatch = useDispatch();

    //Tất cả các faculty được phân loại sau khi chọn selectbox rồi set vào data
    const [data, setData] = useState([]);

    //để phân loại faculty để lọc ra set lên Data
    const [faculty, setFaculty] = useState('');

    //lấy role để gắn vào ?link filter
    const [role, setRole] = useState('');

    //lấy tất cả account (mọi role, mọi faculty), initialState khi load trang
    const [total, setTotal] = useState([
        {
            faculty: 'Graphic and Digital Design',
            email: 'whisper4shot1kill@gmail.com',
            role: 'Manager',
            password: 'whisper4shot1kill@gmail.com'
        },
        {
            faculty: 'Graphic and Digital Design',
            email: 'AnhDQ@gmail.com',
            role: 'Coordinator',
            password: 'AnhDQ@gmail.com'
        },
        {
            faculty: 'Graphic and Digital Design',
            email: 'AnhDQStudent@gmail.com',
            role: 'Student',
            password: 'AnhDQStudent@gmail.com'
        },
        {
            faculty: 'Marketing',
            email: 'ltv.9a2.21@gmail.com',
            role: 'Manager',
            password: 'ltv.9a2.21@gmail.com'
        },
        {
            faculty: 'Marketing',
            email: 'longnh@gmail.com',
            role: 'Coordinator',
            password: 'longnh@gmail.com'
        },
        {
            faculty: 'Marketing',
            email: 'longnhStudent@gmail.com',
            role: 'Student',
            password: 'longnhStudent@gmail.com'
        },
        {
            faculty: 'Computing',
            email: 'nhatlam1695@gmail.com',
            role: 'Manager',
            password: 'nhatlam1695@gmail.com'
        },
        {
            faculty: 'Computing',
            email: 'nhatlamStudent@gmail.com',
            role: 'Coordinator',
            password: 'nhatlamStudent@gmail.com'
        },
        {
            faculty: 'Computing',
            email: 'lamnn11@gmail.com',
            role: 'Student',
            password: 'lamnn11@gmail.com'
        },
        {
            faculty: 'Business Management',
            email: 'nguyenmman06@gmail.com',
            role: 'Coordinator',
            password: 'nguyenmman06@gmail.com'
        },
        {
            faculty: 'Business Management',
            email: 'ManNM@gmail.com',
            role: 'Coordinator',
            password: 'ManNM@gmail.com'
        },
        {
            faculty: 'Business Management',
            email: 'ManNMStudent@gmail.com',
            role: 'Student',
            password: 'ManNMStudent@gmail.com'
        },
        {
            faculty: 'Event Management',
            email: 'chauminhduy.2607@gmail.com',
            role: 'Manager',
            password: 'chauminhduy.2607@gmail.com'
        },
        {
            faculty: 'Event Management',
            email: 'duycm@gmail.com',
            role: 'Coordinator',
            password: 'duycm@gmail.com'
        },
        {
            faculty: 'Event Management',
            email: 'duycmStudent@gmail.com',
            role: 'Student',
            password: 'duycmStudent@gmail.com'
        },
        {
            faculty: 'Public Relations & Communications',
            email: 'sept9th2015@gmail.com',
            role: 'Manager',
            password: 'sept9th2015@gmail.com'
        },
        {
            faculty: 'Public Relations & Communications',
            email: '9915ln001@gmail.com',
            role: 'Coordinator',
            password: '9915ln001@gmail.com'
        },
        {
            faculty: 'Public Relations & Communications',
            email: '9915ln001Student@gmail.com',
            role: 'Student',
            password: '9915ln001Student@gmail.com'
        },
    ]);

    const [currentPage, setCurrentPage] = useState(1);
    const [contentsPerPage, setContentsPerPage] = useState(9);

    const indexOfLastContent = currentPage * contentsPerPage;
    const indexOfFirstContent = indexOfLastContent - contentsPerPage;
    const [currentData, setCurrentData] = useState([]);
    const hienthicainayne = data.slice(indexOfFirstContent, indexOfLastContent);

    // console.log(currentPage);
    // console.log(contentsPerPage);
    // console.log(indexOfLastContent);
    // console.log(indexOfFirstContent);
    // console.log(currentData);

    const updatePage = p => {
        setCurrentPage(p);
        setCurrentData(hienthicainayne);
    };

    //lấy data từng faculty
    const [design, setDesign] = useState([]);
    const [marketing, setMarketing] = useState([]);
    const [computing, setComputing] = useState([]);
    const [business, setBusiness] = useState([]);
    const [eventManage, setEventManage] = useState([]);
    const [communication, setCommunication] = useState([]);

    //lấy faculty để phân loại selectbox
    const handleChange = (e) => {
        const value = e.target.value;
        setFaculty(value);
    }

    //lấy role để gắn vào link filter api
    const handleRoleChange = (e) => {
        const value = e.target.value;
        setRole(value);
    }

    //phân loại role
    const roleSelector = () => {
        switch (role) {
            case '':
                setRole(total);
                break;
            case 'Manager':
                setRole('Manager');
                break;
            case 'Coordinator':
                setRole('Coordinator');
                break;
            case 'Student':
                setRole('Student');
                break;
            case 'Guest':
                setRole('Guest');
                break;
            default:
                return role;
        }
    }

    //phân loại data theo faculty
    const dataSelector = () => {
        switch (faculty) {
            case '':
                setData(total);
                break;
            case 'Graphic and Digital Design':
                setData(design);
                break;
            case 'Marketing':
                setData(marketing);
                break;
            case 'Computing':
                setData(computing);
                break;
            case 'Business Management':
                setData(business);
                break;
            case 'Event Management':
                setData(eventManage);
                break;
            case 'Public Relations':
                setData(communication);
                break;
            default:
                return data;
        }
    }

    //thay đổi data, role theo selectbox
    useEffect(() => {
        dataSelector();
        roleSelector();
    }, [faculty, role])

    const [modal, setModal] = useState(false);

    const toggleModalAdd = () => {
        setModal(!modal)
    };

    // State giá trị cho tạo người dùng mới
    const [accountEmail, setAccountEmail] = useState('');
    const [accountPassword, setAccountPassword] = useState('');
    const [accountFaculty, setAccountFaculty] = useState('');
    const [accountRole, setAccountRole] = useState('');

    const setNewAccountData = (value, e) => {
        let input = e.target.value;
        switch (value) {
            case 'Email':
                setAccountEmail(input);
                break;
            case 'Password':
                setAccountPassword(input);
                break;

            case 'Falcuty':
                setAccountFaculty(input);
                break;

            case 'Role':
                setAccountRole(input);
                break;
            default:
                break;
        }
    }
    const newUser = useSelector(state => state.userRegister)
    const { registerUser, loading, error } = newUser;

    // func gọi dispatch register.
    const addNewAccount = async () => {
        let newAccountData = {
            email: accountEmail,
            password: accountPassword,
            faculty: accountFaculty,
            role: accountRole,
        }
        console.log(newAccountData)
        // dispatch(register(accountEmail, accountPassword,accountFaculty,accountRole));
        
        await dispatch(register(newAccountData));
        if (registerUser) {
            alert('account added successfully');
        }
        else alert('ERROR IN CREATING NEW ACCOUNT!');
        toggleModalAdd();
    }





    return (
        <div style={{ paddingTop: '2%' }} >
            <Form>
                <FormGroup>
                    <Label for='facultySelect'>Select Faculty</Label>
                    <CustomInput type="select" id="facultySelect" name='facultySelect' onChange={handleChange}>
                        <option value="">All</option>
                        <option value="Graphic and Digital Design">Graphic and Digital Design</option>
                        <option value="Marketing">Marketing</option>
                        <option value="Computing">Computing</option>
                        <option value="Business Management">Business Management</option>
                        <option value="Event Management">Event Management</option>
                        <option value="Public Relations">Public Relations & Communications</option>
                    </CustomInput>
                </FormGroup>
                <FormGroup>
                    <Label for='roleSelect'>Select Role</Label>
                    <CustomInput type="select" id="roleSelect" name='roleSelect' onChange={handleRoleChange}>
                        <option value="">All</option>
                        <option value="Manager">Manager</option>
                        <option value="Coordinator">Coordinator</option>
                        <option value="Student">Student</option>
                        <option value="Guest">Guest</option>
                    </CustomInput>
                </FormGroup>
            </Form>
            {
                error && <MessageBox variant='danger'>{error}</MessageBox>
            }
            <div className="mt-4 mb-2"><Button outline color="primary" onClick={toggleModalAdd}>Add Account</Button></div>
            <Modal isOpen={modal} toggle={toggleModalAdd}>
                <ModalHeader toggle={toggleModalAdd}>Add New Account</ModalHeader>
                <ModalBody>
                    
                    {
                        loading && <LoadingBox />
                    }

                    <Form>
                        <Row form>
                            <Col md={12}>
                                <FormGroup>
                                    <Label for="userEmail">Email<span className='text-danger'>*</span></Label>
                                    <Input type="email" name="userEmail" id="userEmail" placeholder="User Email" required onChange={(e) => setNewAccountData('Email', e)} />
                                </FormGroup>
                            </Col>
                        </Row>
                        <Row form>
                            <Col md={12}>
                                <FormGroup>
                                    <Label for="userPassword">Password<span className='text-danger'>*</span></Label>
                                    <Input type="password" name="userPassword" id="userPassword" placeholder="User Password" required onChange={(e) => setNewAccountData('Password', e)} />
                                </FormGroup>
                            </Col>
                        </Row>
                        <Row form>
                            <Col md={12}>
                                <FormGroup>
                                    <Label for='facultySelect'>Select Faculty</Label>
                                    <CustomInput type="select" id="facultySelect" name='facultySelect' onChange={(e) => setNewAccountData('Falcuty', e)}>
                                        <option value="">Select Faculty</option>
                                        <option value="Graphic and Digital Design">Graphic and Digital Design</option>
                                        <option value="Marketing">Marketing</option>
                                        <option value="Computing">Computing</option>
                                        <option value="Business Management">Business Management</option>
                                        <option value="Event Management">Event Management</option>
                                        <option value="Public Relations">Public Relations & Communications</option>
                                    </CustomInput>
                                </FormGroup>
                            </Col>
                        </Row>
                        <Row form>
                            <Col md={12}>
                                <FormGroup>
                                    <Label for='roleSelect'>Select Role</Label>
                                    <CustomInput type="select" id="roleSelect" name='roleSelect' onChange={(e) => setNewAccountData('Role', e)}>
                                        <option value="">Select Role</option>
                                        <option value="Manager">Manager</option>
                                        <option value="Coordinator">Coordinator</option>
                                        <option value="Student">Student</option>
                                        <option value="Guest">Guest</option>
                                    </CustomInput>
                                </FormGroup>
                            </Col>
                        </Row>
                    </Form>
                </ModalBody>
                <ModalFooter>
                    <Button color="primary" onClick={addNewAccount}>Add New Account</Button>{' '}
                    <Button color="secondary" onClick={toggleModalAdd}>Cancel</Button>
                </ModalFooter>
            </Modal>
            <Table responsive hover>
                <thead>
                    <tr>
                        <th>Email</th>
                        <th>Faculty</th>
                        <th>Role</th>
                        <th>Function</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((data) => (
                        <tr key={data.email}>
                            <td>{data.email}</td>
                            <td>{data.faculty}</td>
                            <td>{data.role}</td>
                            <td><Button outline color="primary">Reset Password</Button></td>
                        </tr>
                    ))}
                </tbody>
            </Table>
            {/* Lấy total bằng cách lấy data.length, pageSize là lượng data mỗi trang */}
            <Pagination
                className='text-center mt-4 mb-4'
                total={data.length}
                pageSize={9}
                onChange={updatePage}
                current={currentPage}
            />
        </div>
    )
}

export default AccountManagement
