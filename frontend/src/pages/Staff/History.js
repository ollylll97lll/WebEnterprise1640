import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Button, Pagination, PaginationItem, PaginationLink, Table } from 'reactstrap';
import "rc-pagination/assets/index.css"
import axios from 'axios';
import { useSelector } from 'react-redux';
import { arrayIsEmpty } from '../../utils/function';
import moment from 'moment';

function History() {
    const userLogin = useSelector(state => state.userLogin)

    //Student thì chỉ xem bài của bản thân, nên ko có select

    const [currentPage, setCurrentPage] = useState(1)


    //Đá data qua View Details
    const history = useHistory();
    const [totalPage, setTotalPage] = useState('')
    const [posts, setPosts] = useState('')

    const getDataPost = async (pageNum = '') => {
        try {
            let page
            if (pageNum == '') {
                page = 1
            }
            else {
                page = pageNum
            }
            const response = await axios.get(`http://localhost:5001/api/post/getall?userId=${userLogin.userInfo.userInfo._id}&pageNumber=${page}`)
            console.log(response)
            if (response.data) {
                setTotalPage(response.data.pages)
                setPosts(response.data.posts)
            }
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        getDataPost()
    }, [])

    useEffect(() => {
        getDataPost(currentPage)
    }, [currentPage])

    const viewDetail = (postid) => {
        const userId = userLogin.userInfo.userInfo._id
        history.push({
            pathname: '/viewdetails',
            state: { userId: userId, postId: postid, role: userLogin.userInfo.userInfo.role }
        })
    }
    if (arrayIsEmpty(posts)) {
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
            <Table responsive hover>
                <thead>
                    <tr>
                        <th >Title</th>
                        <th>Category</th>
                        <th>Create Date</th>
                        <th>Likes</th>
                    </tr>
                </thead>
                <tbody>
                    {posts.map((data, index) => (
                        <tr key={data.id}>
                            <td>{data.title}</td>
                            <td>{data.categoryinfo[0].name}</td>
                            <td>{moment(data.createdAt).format('L')}</td>
                            <td>{data.likes}</td>
                            {/* Đẩy qua trang ViewDetail, đá data qua kia để hiện form bên kia */}
                            <td className="text-center"><Button outline color="primary" onClick={() => { viewDetail(data._id) }}>View Details</Button></td>
                        </tr>
                    ))}
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
                        [...Array(totalPage).keys()].map((x) => (
                            // ARRAY START FROM 0 SO PAGE START AT 0 + 1
                            <PaginationItem className={(x + 1) === currentPage ? 'active' : ''} key={x + 1} >
                                <PaginationLink onClick={() => setCurrentPage(x + 1)} >{x + 1}</PaginationLink>
                            </PaginationItem>
                        ))
                    }

                    <PaginationItem disabled={currentPage === totalPage ? true : false} >
                        <PaginationLink next onClick={() => setCurrentPage(currentPage + 1)} />
                    </PaginationItem>
                    <PaginationItem disabled={currentPage === totalPage ? true : false} >
                        <PaginationLink last onClick={() => setCurrentPage(currentPage + 1)} />
                    </PaginationItem>
                </Pagination>
            </div>
        </div >
    )
}

export default History
