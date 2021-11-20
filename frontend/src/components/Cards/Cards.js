import axios from 'axios';
import moment from 'moment';
import React, { useEffect } from 'react'
import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import { Col, Container, Row } from 'reactstrap'
import { getPostLikey, postLikey } from '../../redux folder/actions/postaction';
import './styles.css'

// sampletext
const sampletext = `Lorem ipsum dolor sit amet, consectetur adipiscing elit.
Maecenas sed diam sed enim vestibulum gravida. Ut ultrices et ante ut egestas.
Nulla id interdum nisi. Pellentesque at ex tempor, placerat urna quis, maximus lacus.
Nullam pharetra, leo vel tincidunt gravida, elit erat pretium justo, vel faucibus mauris mauris id tortor.
Praesent aliquam sodales odio, eu consequat nibh efficitur et. Sed pretium diam nulla.
Vestibulum feugiat venenatis sapien a congue.`

export default function RedditCards(props) {
    const userLogin = useSelector(state => state.userLogin)
    const { userInfo } = userLogin;
    const postId = props.postId;
    const [like, setLike] = useState(false)
    const [dislike, setDislike] = useState(false)
    const calTimesincePost = moment(props.createdAt).fromNow()
    const dispatch = useDispatch();

    // fake total likes
    const [shownLikes, setShownLikes] = useState(props.likes ? props.likes : 0)

    async function getPostLikeState(postId) {
        try {
            const result = await axios.post('http://localhost:5001/api/post/getlikefrpost', { postId: postId },
                { headers: { Authorization: `Bearer ${userInfo?.accessToken}` } })
            console.log(result.data)
            setLike(result.data?.like || false)
            setDislike(result.data?.dislike || false)
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(async () => {
        getPostLikeState(props.postId)
    }, [])

    const setLikeDislikeState = (name) => {
        switch (name) {
            case 'like-btn':
                dispatch(postLikey({ islike: like, isdislike: dislike, reaction: 'like', postId }));

                setLike(!like);
                setDislike(false);

                setShownLikes(shownLikes + returnfakelikes(like, dislike, 'like'))

                return
            case 'dislike-btn':
                dispatch(postLikey({ islike: like, isdislike: dislike, reaction: 'dislike', postId }));

                setLike(false);
                setDislike(!dislike);

                setShownLikes(shownLikes + returnfakelikes(like, dislike, 'dislike'))

                return
            default:
                setLike(false);
                setDislike(false);
                return
        }
    }

    function returnfakelikes(islike, isdislike, react) {
        // unlike
        if (islike && react === 'like') {
            // 1 => 0 
            return -1;
        }
        // undislike
        if (isdislike && react === 'dislike') {
            // -1 => 0
            return 1;
        }
        // from dislike to like
        if (isdislike && !islike && react === 'like') {
            // -1 => 0 => 1
            return 2
        }
        // from like to dislike
        if (islike && !isdislike && react === 'dislike') {
            //  1 => 0 => -1
            return -2
        }
        // like
        if (react === 'like' && !islike) {
            // 0 => 1
            return 1;
        }
        // dislike
        if (react === 'dislike' && !isdislike) {
            // 0 => -1
            return -1;
        }
    }
    const history = useHistory()



    return (
        <div class='wrapper'>
            <Row style={{ backgroundColor: '#F8F9FA' }}>
                <Col name='like-dislike' xs='1' style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', borderLeft: '4px solid transparent', padding: '8px 4px', paddingLeft: 0 }} >
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '40px', left: 0, top: 0 }} >
                        <a name="like-btn" onClick={(e) => setLikeDislikeState("like-btn")} ><i class={like ? "bi bi-caret-up-fill" : "bi bi-caret-up"} /></a>
                        <h5>{shownLikes}</h5>
                        <a name="dislike-btn" onClick={(e) => setLikeDislikeState("dislike-btn")}><i class={dislike ? "bi bi-caret-down-fill" : "bi bi-caret-down"} /></a>
                    </div>
                </Col>
                <Col name='main-body' xs='11' style={{ padding: '8px 0 0 0', display: 'flex', flexDirection: 'column', backgroundColor: 'white' }} >
                    <div style={{ display: 'flex' }}>
                        <span style={{ fontStyle: 'italic' }} >{props.category ? props.category : 'SampleCategory1'} &nbsp; </span>
                        <span style={{ fontStyle: 'italic' }}>{calTimesincePost ? `Posted ${calTimesincePost}` : `Posted just now`} </span>
                    </div>
                    <h3 style={{ fontSize: '18px', padding: '10px 0 0 0' }}>{props.title ? props.title : 'Sample Tittle 1'}</h3>
                    <div name="preview-content" style={{ fontSize: '14px' }}>
                        <p class="more">
                            {props.content ? props.content : sampletext}
                        </p>
                    </div>
                    <div name='files' style={{ height: '200px', backgroundColor: 'gray', padding: '20px 0' }}></div>
                    <div name='comment'>
                        <a style={{ padding: '8px' }}>
                            <i class="bi bi-chat" />
                            <span> {props.cmts || 0} comment(s)</span>
                        </a>
                    </div>
                </Col>
            </Row>
        </div>
    )
}
