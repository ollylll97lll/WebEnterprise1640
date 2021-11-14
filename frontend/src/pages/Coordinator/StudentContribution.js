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
import { useHistory } from 'react-router';



function StudentContribution() {
    const userLogin = useSelector(state => state.userLogin)
    const user = useSelector(state => state.userAll)

    const dispatch = useDispatch()
    const [posts, setPosts] = useState([])
    const [category, setCategory] = useState([])
    const [dataFiltered, setDataFiltered] = useState([])
    const [categoryFiltered, setCategoryFiltered] = useState('')
    const [userDepartment, setUserDepartment] = useState(userLogin.userInfo.userInfo.department)

    useEffect(() => {
        getAllPost()
        getCategory()
    }, [])

    const getAllPost = async () => {
        try {
            const fetch = await axios.get(`http://localhost:5001/api/post/getall?department=${userLogin.userInfo.userInfo.department}`,
                {
                    token: userLogin.userInfo.accessToken
                })
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
                if (category.length == fetch.data.length) {
                    getCategory()
                    return
                }
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

    const [search, setSearch] = useState('')
    const onChangeSearch = (e) => {
        const value = e.target.value.toLowerCase()
        setSearch(value.toLowerCase())
        if (categoryFiltered == '') {
            const found = posts.filter((item) => item.title.toLowerCase().includes(value))
            setDataFiltered(found)
            return
        }
        const found = posts.filter((item) => item.categoryinfo[0]._id == categoryFiltered && item.title.toLowerCase().includes(value))
        setDataFiltered(found)
    }

    const history = useHistory();

    const viewDetail = (userid, postid) => {
        history.push({
            pathname: '/viewdetails',
            state: { userId: userid, postId: postid, role: userLogin.userInfo.userInfo.role }
        })
    }

    if (user.loading && arrayIsEmpty(category) && arrayIsEmpty(posts)) {
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
            <div className="mb-4"><span style={{ textDecorationLine: 'underline' }}>Current Department</span>: <span className='font-weight-bold'>{userDepartment.toUpperCase()}</span></div>

            <FormGroup>
                <Label for='facultySelect'>Select Category</Label>
                <CustomInput type="select" id="facultySelect" name='facultySelect' onChange={handleChange}>
                    <option value="">All</option>
                    {category.map((item) => {
                        return <option key={item._id} value={item._id}>{item.name}</option>
                    })}
                </CustomInput>
            </FormGroup>

            <div>
                <FormGroup>
                    <Input type="text" name="search" id="search" placeholder="Search..." value={search} required onChange={(e) => onChangeSearch(e)} />
                </FormGroup>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>


                <div className="mt-4 mb-2" style={{ paddingRight: 20, }} >
                    <Button outline color="primary" className="mb-2">Download selected file</Button>
                </div>

            </div>
            {!arrayIsEmpty(posts) && !arrayIsEmpty(dataFiltered) ?
                <Table responsive hover>
                    <thead>
                        <tr>
                            <th className="text-center">Select</th>
                            <th>Title</th>
                            <th>Upload Time</th>
                            <th>End Time</th>
                            <th>Category</th>
                            <th>Like</th>
                            <th style={{ textAlign: 'center' }}>Document Detail</th>
                        </tr>
                    </thead>
                    {dataFiltered.map((data, index) => (
                        <tbody key={data._id}>
                            <tr key={index}>
                                <td className="text-center"><input type="checkbox" /></td>
                                <td>{data.title}</td>
                                <td>{moment(data.createdAt).format('L')}</td>
                                <td>{moment(data.categoryinfo[0].enddate).format('L')}</td>
                                <td>{data.categoryinfo[0].name}</td>
                                <td className='cell'>{data.likes}</td>
                                <td className="text-center"><Button outline color="primary" onClick={() => { viewDetail(data.userId, data._id) }}>View Detail</Button></td>
                            </tr>

                        </tbody>
                    ))}
                </Table>
                :
                <span> No post exist in this category</span>
            }
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
