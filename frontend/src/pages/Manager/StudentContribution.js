import React, { useEffect, useState } from 'react';
import { Button, Col, CustomInput, Form, FormGroup, Input, Label, Modal, ModalBody, ModalFooter, ModalHeader, Row, Table } from 'reactstrap';
import Pagination from 'rc-pagination'
import "rc-pagination/assets/index.css"
import { useDispatch, useSelector } from 'react-redux';
import { getallUser } from '../../redux folder/actions/useractions';
import axios from 'axios';
import { arrayIsEmpty, objectIsNull } from '../../utils/function';
import moment from 'moment'
import DateTimePicker from 'react-datepicker';



function StudentContribution() {
    const userLogin = useSelector(state => state.userLogin)
    const user = useSelector(state => state.userAll)

    const dispatch = useDispatch()
    const [posts, setPosts] = useState([])
    const [category, setCategory] = useState([])
    const [dataFiltered, setDataFiltered] = useState([])
    const [categoryFiltered, setCategoryFiltered] = useState('')
    useEffect(() => {
        getAllPost()
        getCategory()
    }, [])

    const getAllPost = async () => {
        try {
            const fetch = await axios.get(`http://localhost:5001/api/post/getall?department=${userLogin.userInfo.userInfo.department}`)
            console.log(fetch.data)
            if (fetch?.data.posts) {
                setPosts(fetch.data.posts)
                setDataFiltered(fetch.data.posts)
            }
        } catch (error) {
            console.log(error)
        }
    }

    const getCategory = async () => {
        try {
            const fetch = await axios.get(`http://localhost:5001/api/category/getall`)
            console.log('datafectch: ', fetch.data)
            if (fetch?.data) {
                setIsLoading(false)
                setCategory(fetch.data)
            }
        } catch (error) {
            console.log(error)
        }
    }
    const handleChange = (e) => {
        const value = e.target.value;
        setSearch('')
        if (value == '') {
            setDataFiltered(posts)
            setCategoryFiltered('')
            return
        }
        console.log(value)
        const newList = posts.filter((item) => item.categoryinfo[0]._id == value)
        setDataFiltered(newList)
        setCategoryFiltered(value)
    }

    // console.log('this is cat:', category)
    // console.log('datafilter:  ', dataFiltered)

    const [modalVisibleAddCategory, setModalVisibleAddCategory] = useState(false)
    const [newCategory, setNewCategory] = useState('')
    const [descriptionNewCategory, setDescriptionNewCategory] = useState('')
    const [startDateNewCategory, setStartDateNewCategory] = useState(Date.now())
    const [endDateNewCategory, setEndDateNewCategory] = useState(startDateNewCategory)
    const [message, setMessage] = useState('')

    const toggleModalAddCategory = () => {
        setModalVisibleAddCategory(!modalVisibleAddCategory)
        setStartDateNewCategory(Date.now())
        setEndDateNewCategory(Date.now())
    }

    const onPressAddCat = async () => {
        if (newCategory == '' || descriptionNewCategory == '') {
            setMessage({ mess: 'Feild must not empty. Please try again', type: 'text-danger' })
            return
        }
        try {
            const startdate = moment(startDateNewCategory).format("L");
            const endDate = moment(startDateNewCategory).format("L");
            const newCat = await axios.post('http://localhost:5001/api/category/add_category',
                {
                    name: newCategory,
                    description: descriptionNewCategory,
                    startdate: `${startdate}`,
                    enddate: `${endDate}`
                },
                {
                    headers: {
                        "Authorization": `Bearer ${userLogin.userInfo.accessToken}`
                    }
                }
            )
            console.log(newCat)
            if (newCat?.data.success) {
                setIsLoading(true)
                getCategory()
                // toggleModalAddCategory()
                setMessage({ mess: 'Add successfully', type: 'text-success' })

            }
        } catch (error) {
            console.log(error)
            setMessage({ mess: 'Add failed, please try again later', type: 'text-danger' })

        }
    }
    const [isLoading, setIsLoading] = useState(false)

    const [modalVisibleDeleteCat, setModalVisibleDeleteCat] = useState(false)
    const [deleteCat, setDeleteCat] = useState('')

    const toggleModalVisibleDeleteCat = () => {
        setModalVisibleDeleteCat(!modalVisibleDeleteCat)
    }

    const HandleDeleteCat = (e) => {
        const value = e.target.value
        setDeleteCat(value)
    }

    const onPressDeleteCat = async () => {
        if (deleteCat == '') {
            setMessage({ mess: 'Please select category you want to delete', type: 'text-danger' })
            return
        }
        try {
            const response = await axios.delete('http://localhost:5001/api/category/deleteCategory',
                {
                    headers: {
                        Authorization: `Bearer ${userLogin.userInfo.accessToken}`
                    },
                    data: {
                        CategoryId: deleteCat
                    }
                }
            )
            console.log(response)
            if (response?.data.success) {
                setIsLoading(true)
                getCategory()
                setMessage({ mess: 'Delete successfully', type: 'text-success' })
                setDeleteCat('')
            }
        } catch (error) {
            console.log(error)
        }
    }

    const [search, setSearch] = useState('')
    const onChangeSearch = (e) => {
        const value = e.target.value
        setSearch(value)
        if (categoryFiltered == '') {
            const found = posts.filter((item) => item.title.includes(value))
            setDataFiltered(found)
            return
        }
        const found = posts.filter((item) => item.categoryinfo[0]._id == categoryFiltered && item.title.includes(value))
        setDataFiltered(found)
    }

    if (user.loading && arrayIsEmpty(category) && arrayIsEmpty(posts)) {
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

    if (isLoading) {
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
            <FormGroup>
                <Label for='facultySelect'>Select Category</Label>
                <CustomInput type="select" id="facultySelect" name='facultySelect' onChange={handleChange}>
                    <option value="">All</option>
                    {category.map((item) => {
                        return <option value={item._id}>{item.name}</option>
                    })}
                </CustomInput>
            </FormGroup>

            <div style={{ display: 'flex' }}>
                <div className="mt-4 mb-2" style={{ paddingRight: 20, }} ><Button outline color="primary" onClick={toggleModalAddCategory}>Add Category</Button></div>
                <div className="mt-4 mb-2" style={{ paddingRight: 20, }} ><Button outline color="primary" onClick={toggleModalVisibleDeleteCat}>Delete Category</Button></div>

                <div className="mt-4 mb-2" style={{ paddingRight: 20, }} >
                    <Button outline color="primary" className="mb-2">Download selected file</Button>
                </div>

            </div>
            <div>
                <FormGroup>
                    <Input type="text" name="search" id="search" placeholder="Search..." value={search} required onChange={(e) => onChangeSearch(e)} />
                </FormGroup>
            </div>


            <Modal isOpen={modalVisibleAddCategory} toggle={toggleModalAddCategory}>
                <ModalHeader toggle={toggleModalAddCategory}>Add New Category</ModalHeader>
                <ModalBody>
                    {(message != '') ?
                        <Label for="categoryAdd" className={message.type}>{message.mess}</Label>
                        : null
                    }

                    <Form>
                        <Row form>
                            <Col md={12}>
                                <FormGroup>
                                    <Label for="categoryAdd">Category<span className='text-danger'>*</span></Label>
                                    <Input
                                        type="text"
                                        name="categoryAdd"
                                        id="catAdd"
                                        placeholder="Category name"
                                        required onChange={(e) => setNewCategory(e.target.value)} />
                                </FormGroup>
                            </Col>
                        </Row>
                        <Row form>
                            <Col md={12}>
                                <FormGroup>
                                    <Label for="desriptionAdd">Description<span className='text-danger'>*</span></Label>
                                    <Input
                                        type="text"
                                        name="descriptionAdd"
                                        id="desAdd"
                                        placeholder="Description"
                                        required onChange={(e) => setDescriptionNewCategory(e.target.value)} />
                                </FormGroup>
                            </Col>
                        </Row>
                        <Row form>
                            <Col md={12}>
                                <FormGroup>
                                    <Label style={{ width: 100, }} for="catDateAdd">Start date<span className='text-danger'>*</span>:</Label>
                                    <DateTimePicker
                                        selected={startDateNewCategory}
                                        onChange={(date) => {
                                            setStartDateNewCategory(date)
                                            if (endDateNewCategory <= date) {
                                                setEndDateNewCategory(date)
                                            }
                                        }}
                                        minDate={(Date.now())}
                                    />
                                </FormGroup>
                            </Col>
                        </Row>
                        <Row form>
                            <Col md={12}>
                                <FormGroup>
                                    <Label style={{ width: 100, }} for="catDateAdd">End date<span className='text-danger'>*</span>:</Label>
                                    <DateTimePicker
                                        selected={endDateNewCategory}
                                        onChange={(date) => setEndDateNewCategory(date)}
                                        minDate={startDateNewCategory}
                                    />
                                </FormGroup>
                            </Col>
                        </Row>
                    </Form>
                </ModalBody>
                <ModalFooter>
                    <Button color="primary" onClick={onPressAddCat}>Add New Category</Button>{' '}
                    <Button color="secondary" onClick={() => {
                        toggleModalAddCategory()
                        setMessage('')
                    }}>Cancel</Button>
                </ModalFooter>
            </Modal>

            <Modal isOpen={modalVisibleDeleteCat} toggle={toggleModalVisibleDeleteCat}>
                <ModalHeader toggle={toggleModalVisibleDeleteCat}>Delete Category</ModalHeader>
                <ModalBody>
                    {(message != '') ?
                        <Label for="categoryAdd" className={message.type}>{message.mess}</Label>
                        : null
                    }

                    <Form>
                        <Row form>
                            <Col md={12}>
                                <FormGroup>
                                    <Label for='facultySelect'>Select Category</Label>
                                    <CustomInput type="select" id="facultySelect" name='facultySelect' value={deleteCat} onChange={HandleDeleteCat}>
                                        <option value="">All</option>
                                        {category.map((item) => {
                                            return <option value={item._id}>{item.name}</option>
                                        })}
                                    </CustomInput>
                                </FormGroup>
                            </Col>
                        </Row>
                    </Form>
                </ModalBody>
                <ModalFooter>
                    <Button color="primary" onClick={onPressDeleteCat}>Confirm Delete</Button>{' '}
                    <Button color="secondary" onClick={() => {
                        toggleModalVisibleDeleteCat()
                        setMessage('')
                    }}>Cancel</Button>
                </ModalFooter>
            </Modal>

            <Table responsive hover>
                <thead>
                    <tr>
                        <th className="text-center">Select</th>
                        <th>Title</th>
                        <th>Upload Time</th>
                        <th>End Time</th>
                        <th>Category</th>
                        <th>Like</th>
                        <th>Document download</th>
                    </tr>
                </thead>
                <tbody>
                    {!arrayIsEmpty(posts) && !arrayIsEmpty(dataFiltered) ? dataFiltered.map((data) => (
                        <tr>
                            <td className="text-center"><input type="checkbox" /></td>
                            <td>{data.title}</td>
                            <td>{moment(data.createdAt).format('L')}</td>
                            <td>{moment(data.categoryinfo[0].enddate).format('L')}</td>
                            <td>{data.categoryinfo[0].name}</td>
                            <td className='cell'>{data.likes}</td>
                        </tr>
                    ))
                        :
                        <span> No post exist in this category</span>
                    }
                </tbody>
            </Table>
            {/* Lấy total bằng cách lấy data.length, pageSize là lượng data mỗi trang */}
            <Pagination
                className='text-center mt-4 mb-4'
                total={100}
                defaultPageSize={9}
                pageSize={9}
            />
        </div>
    )
}

export default StudentContribution
