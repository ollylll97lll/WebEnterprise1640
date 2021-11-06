import axios from 'axios';
import moment from 'moment';
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router';
import { Button, Card, Col, Container, Form, FormGroup, Input, Label, Modal, ModalBody, ModalFooter, ModalHeader, Row } from 'reactstrap'
import RedditCards from '../../components/Cards/Cards'
import { renderNavBar } from '../../components/Navbar/renderNavBar';
import { arrayIsEmpty } from '../../utils/function';

export default function PostDetails(props) {
    const userLogin = useSelector(state => state.userLogin)
    const urlParams = new URLSearchParams(window.location.search);
    const location = useLocation()


    const { userInfo } = userLogin;
    const postId = urlParams.get('postid') || null;

    const [postDetail, setPostDetail] = useState(null)

    let userRole = userInfo.userInfo.role;
    let userEmail = userInfo.userInfo.email
    const calTimesincePost = moment(location.state.post.createAt).fromNow()

    const [closeComment, setCloseComment] = useState(false)
    const [modalVisible, setModalVisible] = useState(false)
    const [commentPost, setCommentPost] = useState('')
    const [isAnon, setIsAnon] = useState(false)
    const [checkcommentStatus, setCheckcommentStatus] = useState(false)
    const [commentDeleteId, setCommentDeleteId] = useState('')

    const checkClosureDay = () => {
        console.log(moment(postDetail.catdetail.enddate) <= moment.now())
        if (moment(postDetail.catdetail.enddate) <= moment.now()) {
            setCloseComment(true)
        }
    }


    const getPostDetail = async () => {
        try {
            const post = await axios.post('http://localhost:5001/api/post/getpostdetail', {
                postId: postId
            })
            console.log('postdetail:', post)
            setPostDetail(post.data)
        } catch (error) {
            console.log(error)
        }

    }

    const btnPostComment = async () => {
        if (commentPost != '') {
            try {
                const comment = await axios.post('http://localhost:5001/api/post/comment',
                    {
                        postId: postId,
                        comment: commentPost,
                        isAnonymous: isAnon
                    },
                    {
                        headers: { Authorization: `Bearer ${userLogin.userInfo.accessToken}` },
                    })
                if (comment?.data.success) {
                    getPostDetail()
                    setCommentPost('')
                }
            } catch (error) {
                console.log(error)
            }
        }
        else {
            setCheckcommentStatus(true)
        }
    }
    useEffect(() => {
        getPostDetail()
    }, [])

    useEffect(() => {
        if (postDetail != null) {
            console.log(postDetail)
            checkClosureDay()
        }
    }, [postDetail])
    const onChangeText = (value) => {
        setCommentPost(value)
    }

    const deleteComment = async () => {
        try {
            const url = 'http://localhost:5001/api/post/deletecommentpost'
            const response = await axios.delete(url,
                {
                    headers: {
                        Authorization: `Bearer ${userLogin.userInfo.accessToken}`
                    },
                    data: {
                        postId: postId, commentId: commentDeleteId
                    }
                }
            )
            if (response?.data.success) {
                getPostDetail()
            }
        } catch (error) {
            console.log(error)
        }
    }

    const onPressDelete = (id) => {
        setModalVisible(true)
        console.log(id)
        setCommentDeleteId(id)
    }
    const onPressConfirmDelete = () => {
        deleteComment()
        setCommentDeleteId('')
        setModalVisible(!modalVisible)
    }


    console.log(commentPost)


    return (
        <div className="page-container" style={{ backgroundColor: '#DAE0E6' }}>
            <div className="content-wrap" >
                {renderNavBar(userRole)}
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
                    <Col sm='12' md='6'>
                        <Container>
                            {postDetail != null && postDetail.catdetail &&
                                <RedditCards
                                    key={postDetail.result._id}
                                    category={postDetail.catdetail.name}
                                    title={postDetail.result.title}
                                    content={postDetail.result.content}
                                    files={postDetail.result.files}
                                    likes={postDetail.result.likes}
                                    createdAt={postDetail.result.createdAt}
                                />
                            }

                        </Container>
                    </Col>
                    <Col sm='12' md='6' >
                        <Container>
                            <Row style={{ backgroundColor: '#F8F9FA' }}>

                                <Form style={{ width: '100%', padding: 10, }} disabled={closeComment}>
                                    <Label for="exampleText">
                                        Comment as {userEmail.substring(0, userEmail.indexOf("@"))}
                                    </Label>
                                    <div style={{ paddingBottom: 10, }}>
                                        <Input
                                            id="exampleText"
                                            name="text"
                                            type="textarea"
                                            value={commentPost}
                                            disabled={closeComment}
                                            onChange={(e) => onChangeText(e.target.value)}
                                        />
                                    </div>
                                    <FormGroup check >
                                        <Input type="checkbox" value={isAnon} onClick={() => { setIsAnon(!isAnon) }} disabled={closeComment} />
                                        {' '}
                                        <Label>
                                            Comment as <Label style={{ fontStyle: 'italic' }}>anonymous</Label>
                                        </Label>


                                    </FormGroup>
                                    {closeComment &&
                                        <Label style={{ color: 'red' }}
                                        >
                                            Comment topic has been closed.
                                        </Label>
                                    }
                                    <div style={{ justifyContent: 'center', alignItems: 'center' }}>
                                        <Button
                                            color="primary"
                                            onClick={() => { btnPostComment() }}
                                            disabled={closeComment}
                                        >
                                            Comment
                                        </Button>
                                        {commentPost == '' && checkcommentStatus &&

                                            <Label style={{ color: 'red' }}
                                            >
                                                Comment can not empty. Please give us your opinion about this post.
                                            </Label>
                                        }
                                    </div>
                                </Form>
                            </Row>
                        </Container>
                    </Col>
                    <Col sm='12' md='6' style={{ marginTop: 10, }}>
                        <Container >
                            {postDetail != null && !arrayIsEmpty(postDetail.cmts) &&
                                postDetail.cmts.map((item, index) => {
                                    return (
                                        < Row style={{ backgroundColor: '#F8F9FA', paddingLeft: 10, paddingRight: 10, paddingBottom: 10 }}>
                                            <div style={{ padding: 10, width: '100%' }}>
                                                <div style={{ display: 'flex', width: '100%', justifyContent: 'space-between', alignItems: 'center' }}>
                                                    <div>
                                                        <span style={{ fontStyle: 'italic' }} >{item.isAnonymous ? 'Anonymous' : item.email} &nbsp; </span>
                                                        <span style={{ fontStyle: 'italic' }}> {moment(item.createdAt).format('L')}{" "}{moment(item.createdAt).format('LT')}</span>
                                                    </div>
                                                    {item.userId == userInfo.userInfo._id &&
                                                        <div>
                                                            <Button close onClick={() => {
                                                                onPressDelete(item._id)
                                                            }} />

                                                        </div>
                                                    }

                                                </div>
                                                <div style={{ padding: 10 }}>
                                                    <span>
                                                        {item.comment}
                                                    </span>
                                                </div>
                                            </div>
                                            {index + 1 != postDetail.cmts.length &&
                                                <div style={{ borderBottom: '1px solid #000', width: '100%', marginRight: '5%', marginLeft: '5%' }}>

                                                </div>
                                            }

                                        </Row>
                                    )
                                })
                            }
                            <Modal
                                isOpen={modalVisible}
                            >
                                <ModalHeader >
                                    Confirm delete comment
                                </ModalHeader>
                                <ModalBody>
                                    You sure you want to delete your comment?
                                </ModalBody>
                                <ModalFooter>
                                    <Button
                                        color="danger"
                                        onClick={() => { onPressConfirmDelete() }}
                                    >
                                        Delete
                                    </Button>
                                    {' '}
                                    <Button onClick={() => { setModalVisible(!modalVisible) }}>
                                        Cancel
                                    </Button>
                                </ModalFooter>
                            </Modal>
                        </Container>
                    </Col>
                </div>
            </div>
        </div >
    )
}
