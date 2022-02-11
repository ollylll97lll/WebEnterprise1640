import "rc-pagination/assets/index.css"
import React, { useEffect, useState } from 'react'
import "react-datepicker/dist/react-datepicker.css"
import { useDispatch, useSelector } from 'react-redux'
import { Col, Container, Pagination, PaginationItem, PaginationLink } from 'reactstrap'
import RedditCards from '../../components/Cards/Cards'
import Footer from '../../components/Footer'
import { renderNavBar } from '../../components/Navbar/renderNavBar'
import LoadingBox from "../../components/Return Boxes/LoadingBox"
import MessageBox from "../../components/Return Boxes/MessageBox"
import Timer from '../../components/Timer'
import { getAllPosts, getPostLikey } from "../../redux folder/actions/postaction"
import { Button, FormControl, FormHelperText, InputLabel, MenuItem, Select, Box, Grid, BottomNavigation } from '@mui/material'
import axios from "axios"
import { useHistory } from "react-router"

function HomePage(props) {
    // const { category='all', title='all', department='all', shownby='latest', pagenum=1} = useParams();

    const urlParams = new URLSearchParams(window.location.search);
    const pageNumber = urlParams.get('pageNum') || 1;
    const category = urlParams.get('category') || 'all';
    const title = urlParams.get('title') || 'all';
    const shownby = urlParams.get('shownby') || 'latest';
    const department = urlParams.get('department') || 'all';
    const dispatch = useDispatch();

    const userLogin = useSelector(state => state.userLogin)
    const { userInfo } = userLogin;

    const postList = useSelector(state => state.postList)
    const { posts, loading, error, page, pages } = postList;

    const [cardData, setCardData] = useState([])


    useEffect(() => {
        dispatch(
            getAllPosts({
                categoryId: category !== 'all' ? category : '',
                title: title !== 'all' ? title : '',
                department: department !== 'all' ? department : '',
                shownby: shownby,
                pageNumber: pageNumber,
            })
        )
    }, [dispatch, category, title, department, shownby, pageNumber])
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
        getAllDept()
        props.history.push(getFilterURL({ shownby: 'hotest' }))
    }, [])

    const getFilterURL = (filter) => {
        const filterPage = filter.page || pageNumber;
        const filterCategoryId = filter.categoryId || category;
        const filterDepartment = filter.department || department;
        const filterTitle = filter.title || title;
        const filterShownBy = filter.shownby || shownby;
        return `/home/?pageNum=${filterPage}&department=${filterDepartment}&categoryId=${filterCategoryId}&title=${filterTitle}&shownby=${filterShownBy}`
    }

    let userRole = userInfo.userInfo.role;
    const [deptSort, setdeptSort] = useState('')
    const [isEverywhereVisible, setIsEverywhereVisible] = useState(true)
    const [isSelected, setIsSelected] = useState(0)

    const handleChange = (e) => {
        console.log(e.target.value)
        setdeptSort(e.target.value)
        props.history.push(getFilterURL({ department: e.target.value }))
    }

    const handleHotButton = () => {
        setIsEverywhereVisible(true)
        props.history.push(getFilterURL({ shownby: 'hotest', department: 'all' }))
        setdeptSort('')
        setIsSelected(0)

    }
    const handleNewButton = () => {
        setIsEverywhereVisible(false)
        props.history.push(getFilterURL({ shownby: 'latest', department: 'all' }))
        setIsSelected(1)
    }
    const handleTopButton = () => {
        setIsEverywhereVisible(false)
        setIsSelected(2)
    }
    const history = useHistory()
    const onPressCard = (postDetail) => {
        console.log(postDetail)
        history.push(`/postdetails?postid=${postDetail._id}`, { post: postDetail })
    }


    return (
        <div className="page-container" style={{ backgroundColor: '#DAE0E6' }}>
            <div className="content-wrap" >
                {renderNavBar(userRole)}
                <div className="col-12 mt-3">
                    <Timer />
                </div>
                <h4 className="text-center">Home Page</h4>
                <br />
                <div name="filter"></div>
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <Col sm='12' md='6'>
                        <div style={{ padding: 10, flexDirection: 'row', backgroundColor: '#fff' }}>
                            <Button variant='outlined' sx={{ height: 40, m: 1, marginRight: 1, borderColor: isSelected == 0 ? '#0079d3' : '#878a8c' }}
                                onClick={() => { handleHotButton() }}
                            >
                                <i class="bi bi-gem" style={{ fontSize: 20, marginBottom: 10, fontWeight: 'bold', paddingRight: 10, color: isSelected == 0 ? '#0079d3' : '#878a8c' }}></i>
                                <span style={{ justifyContent: 'center', fontWeight: 'bold', color: isSelected == 0 ? '#0079d3' : '#878a8c' }}>
                                    Hot
                                </span>
                            </Button>

                            {isEverywhereVisible && allDept &&
                                <FormControl sx={{
                                    minWidth: 200, m: 1,

                                }}>
                                    <InputLabel sx={{ marginTop: -1, fontWeight: 'bold', color: '#0079d3', borderColor: '#0079d3' }} id="select-label">Department Sort</InputLabel>
                                    <Select
                                        sx={{
                                            height: 40,
                                            fontWeight: 'bold',
                                            color: '#0079d3',
                                            "&:hover": {
                                                "&& fieldset": {
                                                    border: "1px solid #0079d3"
                                                }
                                            },
                                        }}
                                        variant="outlined"
                                        labelId="select-label"
                                        id="simple-select"
                                        value={deptSort}
                                        label="Department Sort"
                                        onChange={handleChange}
                                    >
                                        {allDept.map((item, index) => {
                                            return (
                                                <MenuItem value={item.name}
                                                >{item.name}</MenuItem>
                                            )
                                        })}
                                    </Select>
                                </FormControl>
                            }


                            <Button
                                variant='outlined' sx={{ height: 40, m: 1, marginRight: 1, borderColor: isSelected == 1 ? '#0079d3' : '#878a8c' }}
                                onClick={() => { handleNewButton() }}
                            >
                                <i class="bi bi-sun" style={{ fontSize: 20, marginBottom: 10, paddingRight: 10, fontWeight: 'bold', color: isSelected == 1 ? '#0079d3' : '#878a8c' }}></i>
                                <span style={{ justifyContent: 'center', fontWeight: 'bold', color: isSelected == 1 ? '#0079d3' : '#878a8c' }}>
                                    New
                                </span>
                            </Button>
                            {/* <Button variant='outlined' sx={{ height: 40, m: 1, marginRight: 1, borderColor: isSelected == 2 ? '#0079d3' : '#878a8c' }}
                                onClick={() => { handleTopButton() }}
                            >
                                <i class="bi bi-sort-down" style={{ fontSize: 20, marginBottom: 10, fontWeight: 'bold', paddingRight: 10, color: isSelected == 2 ? '#0079d3' : '#878a8c' }}></i>
                                <span style={{ justifyContent: 'center', fontWeight: 'bold', color: isSelected == 2 ? '#0079d3' : '#878a8c' }}>
                                    Top
                                </span>

                            </Button> */}


                        </div>
                        {
                            loading ? (
                                <LoadingBox />
                            ) : error ? (
                                <MessageBox variant="danger" >{error}</MessageBox>
                            ) :
                                (
                                    <>
                                        {
                                            posts.map((post) => {
                                                return (
                                                    <Container onClick={() => {
                                                        onPressCard(post)
                                                    }}>
                                                        <RedditCards
                                                            key={post._id}
                                                            category={post.categoryinfo[0].name}
                                                            title={post.title}
                                                            content={post.content}
                                                            // files={post.files}
                                                            likes={post.likes}
                                                            createdAt={post.createdAt}
                                                            postId={post._id}
                                                            closuredate={post.closuredate}
                                                            cmts={post.totalcmts}
                                                        />
                                                    </Container>
                                                )
                                            })
                                        }
                                    </>
                                )
                        }
                    </Col>
                </div>

                <div style={{ display: 'flex', justifyContent: 'center', paddingTop: '75px' }}>
                    <Pagination className="text-center">
                        <PaginationItem disabled={page === 1 ? true : false} >
                            <PaginationLink first href={getFilterURL({ page: 1 })} />
                        </PaginationItem>
                        <PaginationItem disabled={page === 1 ? true : false} >
                            <PaginationLink previous href={getFilterURL({ page: page - 1 })} />
                        </PaginationItem>

                        {
                            // gen array with size = pages => map and create page nums
                            [...Array(pages).keys()].map((x) => (
                                // ARRAY START FROM 0 SO PAGE START AT 0 + 1
                                <PaginationItem className={(x + 1) === page ? 'active' : ''} key={x + 1} >
                                    <PaginationLink href={getFilterURL({ page: x + 1 })} >{x + 1}</PaginationLink>
                                </PaginationItem>
                            ))
                        }

                        <PaginationItem disabled={page === pages ? true : false} >
                            <PaginationLink next href={getFilterURL({ page: page + 1 })} />
                        </PaginationItem>
                        <PaginationItem disabled={page === pages ? true : false} >
                            <PaginationLink last href={getFilterURL({ page: pages })} />
                        </PaginationItem>
                    </Pagination>
                </div>

            </div >
            <br />
            <Footer />
        </div >
    )
}


export default HomePage
