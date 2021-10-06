import "rc-pagination/assets/index.css"
import React, { useEffect } from 'react'
import "react-datepicker/dist/react-datepicker.css"
import { useDispatch, useSelector } from 'react-redux'
import { Col, Pagination, PaginationItem, PaginationLink } from 'reactstrap'
import RedditCards from '../../components/Cards/Cards'
import Footer from '../../components/Footer'
import { renderNavBar } from '../../components/Navbar/renderNavBar'
import LoadingBox from "../../components/Return Boxes/LoadingBox"
import MessageBox from "../../components/Return Boxes/MessageBox"
import Timer from '../../components/Timer'
import { getAllPosts } from "../../redux folder/actions/postaction"

function HomePage(props) {
    // const { category='all', title='all', department='all', shownby='latest', pagenum=1} = useParams();

    const urlParams = new URLSearchParams(window.location.search);
    const pageNumber = urlParams.get('pageNum') || 1;
    const category = urlParams.get('category') || 'all';
    const title = urlParams.get('title') || 'all';
    const shownby = urlParams.get('shownby') || 'latest';
    const department = urlParams.get('department') || 'all';
    const dispatch = useDispatch();

    useEffect(() => {
        console.log(pageNumber)
    }, [])
    const userLogin = useSelector(state => state.userLogin)
    const { userInfo } = userLogin;

    const postList = useSelector(state => state.postList)
    const { posts, loading, error, page, pages } = postList;


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

    const getFilterURL = (filter) => {
        const filterPage = filter.page || pageNumber;
        const filterCategoryId = filter.categoryId || category;
        const filterDepartment = filter.department || department;
        const filterTitle = filter.title || title;
        const filterShownBy = filter.shownby || shownby;
        return `/home/?pageNum=${filterPage}&department=${filterDepartment}&categoryId=${filterCategoryId}&title=${filterTitle}&shownby=${filterShownBy}`
    }

    let userRole = userInfo.userInfo.role;
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
                        {
                            loading ? (
                                <LoadingBox />
                            ) : error ? (
                                <MessageBox variant="danger" >{error}</MessageBox>
                            ) :
                                (
                                    <>
                                        {posts.length === 0 && <MessageBox>No Post Found. F5 to refresh</MessageBox>}
                                        {
                                            posts.map((post) => {
                                                return (
                                                    <RedditCards
                                                        key={post._id}
                                                        category={post.categoryinfo[0].name}
                                                        title={post.title}
                                                        content={post.content}
                                                        files={post.files}
                                                        likes={post.likes}
                                                        createdAt={post.createdAt}

                                                        closuredate={post.closuredate}
                                                    />
                                                )
                                            })
                                        }
                                    </>
                                )
                        }
                    </Col>
                </div>

                <div style={{display:'flex', justifyContent:'center', paddingTop:'75px'}}>
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

            </div>
            <br />
            <Footer />
        </div >
    )
}

export default HomePage
