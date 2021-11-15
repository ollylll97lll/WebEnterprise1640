import React, { useEffect, useState } from 'react';
import { Button, Col, CustomInput, Form, FormGroup, Input, Label, Modal, ModalBody, ModalFooter, ModalHeader, Pagination, PaginationItem, PaginationLink, Row, Table } from 'reactstrap';
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
    const [Totalpage, setTotalpage] = useState('')
    const [currentPage, setCurrentPage] = useState(1)

    useEffect(() => {
        getAllPost()
        getCategory()
    }, [])

    const getAllPost = async (pageNum = '') => {
        try {
            let page
            if (pageNum == '') {
                page = 1
            }
            else {
                page = pageNum
            }
            const fetch = await axios.get(`http://localhost:5001/api/post/getall?department=${userLogin.userInfo.userInfo.department}&pageNumber=${page}`,
                {
                    token: userLogin.userInfo.accessToken
                })
            console.log(fetch.data)
            if (fetch?.data.posts) {
                setTotalpage(fetch.data.pages)
                setPosts(fetch.data.posts)
                setDataFiltered(fetch.data.posts)
            }
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        getAllPost(currentPage)
    }, [currentPage])

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
            {!arrayIsEmpty(posts) && !arrayIsEmpty(dataFiltered) ?
                <Table responsive hover>
                    <thead>
                        <tr>
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
        </div>
    )
}

export default StudentContribution
