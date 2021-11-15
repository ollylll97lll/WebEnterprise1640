import axios from 'axios';
import "rc-pagination/assets/index.css";
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Col, CustomInput, Form, FormGroup, Input, Label, Modal, ModalBody, ModalFooter, ModalHeader, Pagination, PaginationItem, PaginationLink, Row, Table } from 'reactstrap';
import LoadingBox from '../../components/Return Boxes/LoadingBox';
import MessageBox from '../../components/Return Boxes/MessageBox';
import { deleteDepartment, getallUser, register } from '../../redux folder/actions/useractions';
import { arrayIsEmpty } from '../../utils/function';

function AccountManagement() {
    // dispatch initiation
    const dispatch = useDispatch();
    const userLogin = useSelector(state => state.userLogin)
    const user = useSelector(state => state.userAll)
    const delDeptState = useSelector(state => state.userDeptDelete)

    const [currentPage, setCurrentPage] = useState(1);
    const [Totalpage, setTotalpage] = useState('')



    const [dataUser, setDataUser] = useState([])
    const [filteredData, setFilteredData] = useState([])

    const getAllDept = async () => {
        try {
            const fetch = await axios.get('http://localhost:5001/api/post/getAllDepartment')
            console.log(fetch.data.departments)
            setAllDept(fetch.data.departments)
        } catch (error) {
            console.log(error)
        }
    }

    const [allDept, setAllDept] = useState(null)
    useEffect(() => {
        const action = getallUser({ department: '', role: '', pageNumber: '' })
        dispatch(action)
        getAllDept()
    }, [])

    useEffect(() => {
        if (user?.allUser) {
            setTotalpage(user.allUser.pages)
        }
    }, [user])

    useEffect(() => {
        const action = getallUser({ department: '', role: '', pageNumber: `${currentPage}` })
        dispatch(action)
    }, [currentPage])

    useEffect(() => {
        if (user.allUser?.data) {
            console.log('running')
            setDataUser(user.allUser?.data)
            setFilteredData(user.allUser?.data)
        }
    }, [user, user.allUser?.data])

    // console.log(allDept)
    const [deptFilter, setDeptFilter] = useState('')
    const [roleFilter, setRoleFilter] = useState('')

    //lấy faculty để phân loại selectbox
    const handleChange = (e) => {
        const value = e.target.value;
        setDeptFilter(value)
        dataFilterred(value, roleFilter)
        setSearch('')
    }

    const handleRoleChange = (e) => {
        const value = e.target.value;
        setRoleFilter(value)
        dataFilterred(deptFilter, value)
        setSearch('')
    }

    const dataFilterred = (itemDept, itemRole) => {
        if (itemDept == '' && itemRole == '') {
            setFilteredData(dataUser)
            return
        }
        if (itemDept == '') {
            const dataFiltered = dataUser.filter(item => item.role.toLowerCase() == itemRole.toLowerCase())
            console.log(dataFiltered)
            setFilteredData(dataFiltered)
            return
        }
        if (itemRole == '') {
            const dataFiltered = dataUser.filter(item => item.department.toLowerCase() == itemDept.toLowerCase())
            console.log(dataFiltered)
            setFilteredData(dataFiltered)
            return
        }
        if (itemDept != '' && itemRole != '') {
            const dataFiltered = dataUser.filter(item => item.department.toLowerCase() == itemDept.toLowerCase() && item.role.toLowerCase() == itemRole.toLowerCase())
            console.log(dataFiltered)
            setFilteredData(dataFiltered)
        }


    }
    console.log(deptFilter, roleFilter)
    // console.log(filteredData)
    //lấy role để gắn vào link filter api


    const [modal, setModal] = useState(false);

    const toggleModalAdd = () => {
        setModal(!modal)
    };

    const [modalAddDept, setModalAddDept] = useState(false)
    const [modalDelDept, setModalDelDept] = useState(false)
    const [modalAlertDelete, setModalAlertDelete] = useState(false)
    const [newDepartment, setNewDepartment] = useState('')
    const [delDepartmentId, setDelDepartmentId] = useState('')
    const [deleteId, setDeleteId] = useState('')

    const toggleModalAddDept = () => {
        setModalAddDept(!modalAddDept)
    }

    const toggleModalDelDept = () => {
        setModalDelDept(!modalDelDept)
    }
    const toggleModalAlertDelete = () => {
        setModalAlertDelete(!modalAlertDelete)
    }

    const onPressAddDept = async () => {
        try {
            const newDept = await axios.post('http://localhost:5001/api/post/postDepartment',
                {
                    name: newDepartment
                },
                {
                    headers: { Authorization: `Bearer ${userLogin.userInfo.accessToken}` },
                })
            if (newDept.data?.message) {
                getAllDept()
            }
            console.log('return value:   ', newDept)
            setNewDepartment('')
        } catch (error) {
            console.log(error)
        }
        setModalAddDept(!modalAddDept)
    }

    const onPressDelDept = () => {
        // try {
        //     console.log(object)
        //     const newDept = await axios.post('http://localhost:5001/api/post/delDepartment',
        //         {
        //             headers: {
        //                 Authorization: `Bearer ${userLogin.userInfo.accessToken}`
        //             },
        //             data: {
        //                 departmentId: delDepartmentId
        //             }
        //         }
        //     )
        //     // if (newDept.data?.message) {
        //     //     getAllDept()
        //     // }
        //     console.log('return value:   ', newDept)
        //     setDelDepartmentId('')
        // } catch (error) {
        //     console.log(error)
        // }
        // setModalDelDept(!modalAddDept)
        const action = deleteDepartment({ departmentId: delDepartmentId, token: userLogin.userInfo.accessToken })
        dispatch(action)
        setDelDepartmentId('')
    }

    console.log(delDeptState)
    useEffect(() => {
        if (delDeptState?.response?.success) {
            getAllDept()
        }
    }, [delDeptState, delDeptState?.response])


    const onPressDelete = async () => {
        console.log(deleteId)
        try {
            const url = 'http://localhost:5001/api/user/deleteUser'
            const deleteUser = await axios.delete(url,
                {
                    headers: {
                        Authorization: `Bearer ${userLogin.userInfo.accessToken}`
                    },
                    data: {
                        userId: deleteId
                    }
                }
            )
            console.log(deleteUser)
            if (deleteUser?.data.success) {
                toggleModalAlertDelete()
                const action = getallUser({ department: '', role: '', pageNumber: '' })
                dispatch(action)
            }
        } catch (error) {
            console.log(error)
        }
    }

    // State giá trị cho tạo người dùng mới
    const [accountEmail, setAccountEmail] = useState('');
    const [accountPassword, setAccountPassword] = useState('');
    const [accountFaculty, setAccountFaculty] = useState('');
    const [accountDepartment, setAccountDepartment] = useState('')
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

            case 'Department':
                const deptInfo = handleChangeDept(input)
                setAccountDepartment(deptInfo)
                break;

            case 'Role':
                setAccountRole(input);
                break;
            default:
                break;
        }
    }

    const [search, setSearch] = useState('')

    const onChangeSearch = (e) => {
        const value = e.target.value
        setSearch(value)
        const found = dataUser.filter((item) => {
            const itemName = item.email.toLowerCase()
            if (deptFilter == '' && roleFilter != '') {
                return itemName.includes(value) && (item.role.toLowerCase() == roleFilter.toLowerCase())
            }
            if (roleFilter == '' && deptFilter != '') {
                return itemName.includes(value) && item.department.toLowerCase() == deptFilter.toLowerCase()
            }
            if (deptFilter != '' && roleFilter != '') {
                return itemName.includes(value) && item.department.toLowerCase() == deptFilter.toLowerCase() && item.role.toLowerCase() == roleFilter.toLowerCase()
            }
            if (roleFilter == '' && deptFilter == '') {
                return itemName.includes(value)
            }
        })
        setFilteredData(found)
    }

    const handleChangeDept = (id) => {
        const clickedOption = allDept.find(item => item._id == id)
        console.log(clickedOption)
        return { name: clickedOption.name, id: clickedOption._id }
    }

    const newUser = useSelector(state => state.userRegister)
    const { registerUser, loading, error } = newUser;

    useEffect(() => {
        const action = getallUser({ department: '', role: '', pageNumber: '' })
        dispatch(action)
    }, [newUser])
    // func gọi dispatch register.
    const addNewAccount = () => {
        let newAccountData = {
            email: accountEmail,
            password: accountPassword,
            department: accountDepartment.name,
            departmentId: accountDepartment.id,
            role: accountRole,
        }
        console.log(newAccountData)
        dispatch(register(newAccountData));
        toggleModalAdd();
    }
    const onChangeDeleteUser = (id) => {
        setDeleteId(id)
        setModalAlertDelete(!modalAlertDelete)
    }


    const [modalUpdateVisible, setModalUpdateVisible] = useState(false)
    const toggleModalUpdate = () => {
        setModalUpdateVisible(!modalUpdateVisible)
    }
    const [dataUpdateDept, setDataUpdateDept] = useState('')
    const [dataUpdateRole, setDataUpdateRole] = useState('')
    const [userUpdateId, setUserUpdateId] = useState('')
    const [userNameUpdate, setUserNameUpdate] = useState('')

    const onPressOpenModalUpdate = (id, name) => {
        setModalUpdateVisible(!modalUpdateVisible)
        setUserUpdateId(id)
        setUserNameUpdate(name)
    }

    const onPressUpdate = async () => {
        try {
            console.log(
                userUpdateId,
                dataUpdateDept,
                dataUpdateRole)
            const updateUser = await axios.patch('http://localhost:5001/api/user/updateUser',
                {
                    userId: userUpdateId,
                    departmentId: dataUpdateDept,
                    role: dataUpdateRole.toLocaleLowerCase()
                },
                {
                    headers: { Authorization: `Bearer ${userLogin.userInfo.accessToken}` },
                }
            )
            console.log(updateUser)
            if (updateUser?.data.success) {
                toggleModalUpdate()
                const action = getallUser({ department: '', role: '', pageNumber: '' })
                dispatch(action)
            }
        } catch (error) {
            console.log(error)
        }
    }


    if (user.loading) {
        return (
            <div className={"container"} style={{
                display: 'flex', justifyContent: 'center', alignItems: 'center',
                flexDirection: 'column',
                padding: 20,
            }}>
                <div class="spinner-border" role="status">
                </div>
                <span style={{ padding: 20, }} >Loading...</span>
            </div>
        )
    }

    return (
        <div style={{ paddingTop: '2%' }} >
            {!arrayIsEmpty(allDept) &&
                <Form>
                    <FormGroup>
                        <Label for='deptSelect'>Select Department</Label>
                        <CustomInput type="select" id="deptSelect" name='deptSelect' onChange={handleChange}>
                            <option value="">All</option>
                            {allDept.map((item) => {
                                return (
                                    <option value={item.name} >{item.name}</option>
                                )
                            })}
                        </CustomInput>
                    </FormGroup>
                    <FormGroup>
                        <Label for='roleSelect'>Select Role</Label>
                        <CustomInput type="select" id="roleSelect" name='roleSelect' onChange={handleRoleChange}>
                            <option value="">All</option>
                            <option value="Manager">Manager</option>
                            <option value="Coordinator">Coordinator</option>
                            <option value="Staff">Staff</option>
                            <option value="Guest">Guest</option>
                        </CustomInput>
                    </FormGroup>
                </Form>
            }

            {
                error && <MessageBox variant='danger'>{error}</MessageBox>
            }

            {
                registerUser && <MessageBox variant='success'>Update user successfully</MessageBox>
            }
            <div>
                <FormGroup>
                    <Input type="text" name="search" id="search" placeholder="Search..." value={search} required onChange={(e) => onChangeSearch(e)} />
                </FormGroup>
            </div>
            <div style={{ display: 'flex', }}>
                <div className="mt-4 mb-2" style={{ paddingRight: 20, }}><Button outline color="primary" onClick={toggleModalAdd}>Add Account</Button></div>
                <div className="mt-4 mb-2" style={{ paddingRight: 20, }} ><Button outline color="primary" onClick={toggleModalAddDept}>Add Department</Button></div>
                <div className="mt-4 mb-2" ><Button outline color="primary" onClick={toggleModalDelDept}>Delete Department</Button></div>
            </div>


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
                                {!arrayIsEmpty(allDept) &&
                                    <FormGroup>
                                        <Label for='facultySelect'>Select Department</Label>
                                        <CustomInput
                                            type="select" id="facultySelect" name='facultySelect' onChange={(e) => setNewAccountData('Department', e)}>
                                            <option value="">Select Department</option>
                                            {allDept.map((item) => {
                                                return (
                                                    <option value={item._id} >{item.name}</option>
                                                )
                                            })}
                                        </CustomInput>
                                    </FormGroup>
                                }

                            </Col>
                        </Row>
                        <Row form>
                            <Col md={12}>
                                <FormGroup>
                                    <Label for='roleSelect'>Select Role</Label>
                                    <CustomInput
                                        type="select" id="roleSelect" name='roleSelect' onChange={(e) => setNewAccountData('Role', e)}>
                                        <option value="">Select Role</option>
                                        <option value="Manager">Manager</option>
                                        <option value="Coordinator">Coordinator</option>
                                        <option value="Staff">Staff</option>
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

            <Modal isOpen={modalAddDept} toggle={toggleModalAddDept}>
                <ModalHeader toggle={toggleModalAddDept}>Add New Department</ModalHeader>
                <ModalBody>

                    {
                        loading && <LoadingBox />
                    }

                    <Form>
                        <Row form>
                            <Col md={12}>
                                <FormGroup>
                                    <Label for="departmentAdd">Department<span className='text-danger'>*</span></Label>
                                    <Input
                                        type="text"
                                        name="departmentAdd"
                                        id="deptAdd"
                                        placeholder="Department name"
                                        required onChange={(e) => setNewDepartment(e.target.value)} />
                                </FormGroup>
                            </Col>
                        </Row>
                    </Form>
                </ModalBody>
                <ModalFooter>
                    <Button color="primary" onClick={onPressAddDept}>Add New Department</Button>{' '}
                    <Button color="secondary" onClick={toggleModalAddDept}>Cancel</Button>
                </ModalFooter>
            </Modal>

            <Modal isOpen={modalDelDept} toggle={toggleModalDelDept}>
                <ModalHeader toggle={toggleModalDelDept}>Delete Department</ModalHeader>
                <ModalBody>

                    {
                        loading && <LoadingBox />
                    }

                    <Form>
                        <Row form>
                            <Col md={12}>
                                <FormGroup>
                                    <Label for="departmentAdd">Department<span className='text-danger'>*</span></Label>
                                    {!arrayIsEmpty(allDept) &&
                                        <FormGroup>
                                            {delDeptState?.error &&
                                                <Label for="departmentAdd" className='text-danger'>There are staffs in this department.</Label>
                                            }
                                            {delDeptState?.response?.success &&
                                                <Label for="departmentAdd" className='text-success'>Delete successfully</Label>
                                            }

                                            <CustomInput
                                                type="select" id="facultySelect" name='facultySelect' value={delDepartmentId} onChange={(e) => setDelDepartmentId(e.target.value)}>
                                                <option value="">Select Department</option>
                                                {allDept.map((item) => {
                                                    return (
                                                        <option value={item._id} >{item.name}</option>
                                                    )
                                                })}
                                            </CustomInput>
                                        </FormGroup>
                                    }
                                </FormGroup>
                            </Col>
                        </Row>
                    </Form>
                </ModalBody>
                <ModalFooter>
                    <Button color="primary" onClick={onPressDelDept}>Confirm</Button>{' '}
                    <Button color="secondary" onClick={toggleModalDelDept}>Cancel</Button>
                </ModalFooter>
            </Modal>

            <Modal isOpen={modalAlertDelete} toggle={toggleModalAlertDelete}>
                <ModalHeader toggle={toggleModalAlertDelete}>Confirm Delete</ModalHeader>
                <ModalBody>

                    {
                        loading && <LoadingBox />
                    }

                    <Form>
                        <span>
                            You sure you want to delete this user
                        </span>
                    </Form>
                </ModalBody>
                <ModalFooter>
                    <Button color="primary" onClick={onPressDelete}>Confirm</Button>{' '}
                    <Button color="secondary" onClick={toggleModalAlertDelete}>Cancel</Button>
                </ModalFooter>
            </Modal>

            <Modal isOpen={modalUpdateVisible} toggle={toggleModalUpdate}>
                <ModalHeader toggle={toggleModalUpdate}>Update user</ModalHeader>
                <ModalBody>

                    {
                        loading && <LoadingBox />
                    }

                    <Form>
                        <Row form>
                            <Col md={12}>
                                <Label for='facultySelect'>Email: {userNameUpdate}</Label>
                                {!arrayIsEmpty(allDept) &&
                                    <FormGroup>
                                        <Label for='facultySelect'>Select Department</Label>
                                        <CustomInput
                                            type="select" id="facultySelect" name='facultySelect' onChange={(e) => setDataUpdateDept(e.target.value)}>
                                            <option value="">Select Department</option>
                                            {allDept.map((item) => {
                                                return (
                                                    <option value={item._id} >{item.name}</option>
                                                )
                                            })}
                                        </CustomInput>
                                    </FormGroup>
                                }
                            </Col>
                        </Row>
                        <Row form>
                            <Col md={12}>
                                <FormGroup>
                                    <Label for='roleSelect'>Select Role</Label>
                                    <CustomInput
                                        type="select" id="roleSelect" name='roleSelect' onChange={(e) => setDataUpdateRole(e.target.value)}>
                                        <option value="">Select Role</option>
                                        <option value="Manager">Manager</option>
                                        <option value="Coordinator">Coordinator</option>
                                        <option value="Staff">Staff</option>
                                        <option value="Guest">Guest</option>
                                    </CustomInput>
                                </FormGroup>
                            </Col>
                        </Row>
                    </Form>
                </ModalBody>
                <ModalFooter>
                    <Button color="primary" onClick={onPressUpdate}>Update</Button>{' '}
                    <Button color="secondary" onClick={toggleModalUpdate}>Cancel</Button>
                </ModalFooter>
            </Modal>

            <Table responsive hover>
                <thead>
                    <tr>
                        <th>Email</th>
                        <th>Department</th>
                        <th>Role</th>
                    </tr>
                </thead>
                <tbody>
                    {!arrayIsEmpty(filteredData) ? filteredData.map((data, index) => {
                        // if(index == 5) return 
                        return (
                            <tr key={data._id}>
                                <td>{data.email}</td>
                                <td>{data.department}</td>
                                <td>{data.role}</td>
                                <td><Button color="primary" onClick={() => { onPressOpenModalUpdate(data._id, data.email) }}>Update</Button></td>
                                <td><Button color="primary" onClick={() => { onChangeDeleteUser(data._id) }}>Delete</Button></td>
                            </tr>
                        )
                    })
                        : <span> No user found in this department</span>
                    }

                </tbody>
            </Table>
            {/* Lấy total bằng cách lấy data.length, pageSize là lượng data mỗi trang */}
            <div style={{ display: 'flex', justifyContent: 'center', paddingTop: '75px' }}>
                <Pagination className="text-center">
                    <PaginationItem disabled={currentPage === 1 ? true : false} >
                        <PaginationLink first onClick={() => setCurrentPage(1)} />
                    </PaginationItem>
                    <PaginationItem disabled={currentPage === 1 ? true : false} >
                        <PaginationLink previous onClick={() => setCurrentPage(currentPage - 1)} />
                    </PaginationItem>

                    {
                        // gen array with size = pages => map and create page nums
                        [...Array(Totalpage).keys()].map((x) => (
                            // ARRAY START FROM 0 SO PAGE START AT 0 + 1
                            <PaginationItem className={(x + 1) === currentPage ? 'active' : ''} key={x + 1} >
                                <PaginationLink onClick={() => setCurrentPage(x + 1)} >{x + 1}</PaginationLink>
                            </PaginationItem>
                        ))
                    }

                    <PaginationItem disabled={currentPage === Totalpage ? true : false} >
                        <PaginationLink next onClick={() => setCurrentPage(currentPage + 1)} />
                    </PaginationItem>
                    <PaginationItem disabled={currentPage === Totalpage ? true : false} >
                        <PaginationLink last onClick={() => setCurrentPage(currentPage + 1)} />
                    </PaginationItem>
                </Pagination>
            </div>
        </div >
    )
}

export default AccountManagement
