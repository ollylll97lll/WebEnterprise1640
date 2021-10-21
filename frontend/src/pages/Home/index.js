import "rc-pagination/assets/index.css"
import React, { useEffect, useState } from 'react'
import "react-datepicker/dist/react-datepicker.css"
import { useDispatch, useSelector } from 'react-redux'
import { Col, Pagination, PaginationItem, PaginationLink } from 'reactstrap'
import RedditCards from '../../components/Cards/Cards'
import Footer from '../../components/Footer'
import { renderNavBar } from '../../components/Navbar/renderNavBar'
import LoadingBox from "../../components/Return Boxes/LoadingBox"
import MessageBox from "../../components/Return Boxes/MessageBox"
import Timer from '../../components/Timer'
import { getAllPosts, getPostLikey } from "../../redux folder/actions/postaction"

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

    const getPostLikeState = useSelector(state => state.getPostLikeState);
    const { data } = getPostLikeState;

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

    useEffect(() => {
        if (posts) {
            let postIdList = new Array()
            let postList = Array.from(posts);
            postList.map(post => {
                postIdList.push({ _id: post._id });
            })
            dispatch(getPostLikey({ postIdList }))
        }
    }, [posts])

    useEffect(() => {
        if (data && posts) {
            const rl = Array.from(data)
            const p = Array.from(posts)
            // console.log(rl)
            setCardData(mappinglikestate2post(rl, p))
        }
    }, [data])

    function mappinglikestate2post(likestates = [], posts = []) {
        const carddatas = new Array();
        likestates.forEach(ls => {
            posts.forEach(p => {
                if (ls.postId === p._id) {
                    carddatas.push({
                        post: p,
                        likedstate: ls.result
                            ? {
                                like: ls.result.likedposts[0].like,
                                dislike: ls.result.likedposts[0].dislike
                            }
                            :{
                                like: false,
                                dislike: false
                            }
                    });
                }
            })
        })
        // console.log("carddatas", carddatas);
        return carddatas.sort((a,b) => {
            return a.post._id - b.post._id;
        });
    }

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
                                        {cardData.length === 0 && <MessageBox>No Post Found. F5 to refresh</MessageBox>}
                                        {
                                            cardData.map((carddata) => {

                                                return (
                                                    <RedditCards
                                                        key={carddata.post._id}
                                                        category={carddata.post.categoryinfo[0].name}
                                                        title={carddata.post.title}
                                                        content={carddata.post.content}
                                                        files={carddata.post.files}
                                                        likes={carddata.post.likes}
                                                        createdAt={carddata.post.createdAt}
                                                        postId={carddata.post._id}
                                                        closuredate={carddata.post.closuredate}

                                                        // like state
                                                        like={carddata.likedstate.like}
                                                        dislike={carddata.likedstate.dislike}
                                                    />


                                                )
                                            })
                                        }
                                        {/* {
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
                                                        postId={post._id}
                                                        closuredate={post.closuredate}
                                                    />
                                                )
                                            })
                                        } */}
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

            </div>
            <br />
            <Footer />
        </div >
    )
}

export default HomePage
