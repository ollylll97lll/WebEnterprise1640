import React from 'react'
import { useState } from 'react'
import { Col, Container, Row } from 'reactstrap'
import './styles.css'

export default function RedditCards(props) {

    const [like, setLike] = useState(false)
    const [dislike, setDislike] = useState(false)

    const setLikeDislikeState = (name) => {
        switch (name) {
            case 'like-btn':
                setLike(!like);
                setDislike(false);
                return
            case 'dislike-btn':
                setLike(false);
                setDislike(!dislike);
                return
            default:
                setLike(false);
                setDislike(false);
                return
        }
    }

    return (
        <div class='wrapper'>
            <Container>
                <Row style={{ backgroundColor: '#F8F9FA' }}>
                    <Col name='like-dislike' xs='1' style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', borderLeft: '4px solid transparent', padding: '8px 4px', paddingLeft: 0 }} >
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '40px', left: 0, top: 0 }} >
                            <a name="like-btn" onClick={(e) => setLikeDislikeState("like-btn")} ><i class={like ? "bi bi-caret-up-fill" : "bi bi-caret-up"} /></a>
                            <h5>{props.likes ? props.likes : 0}</h5>
                            <a name="dislike-btn" onClick={(e) => setLikeDislikeState("dislike-btn")}><i class={dislike ? "bi bi-caret-down-fill" : "bi bi-caret-down"} /></a>
                        </div>
                    </Col>
                    <Col name='main-body' xs='11' style={{ padding: '8px 0 0 0', display: 'flex', flexDirection: 'column', backgroundColor: 'white' }} >
                        <div style={{ display: 'flex' }}>
                            <span style={{ fontStyle: 'italic' }} >{props.tag ? props.tag : 'sampleTag1'} &nbsp; </span>
                            <span style={{ fontStyle: 'italic' }}>{props.time ? `Posted ${props.time} ago` : `Posted just now`} </span>
                        </div>
                        <h3 style={{ fontSize: '18px', padding: '10px 0 0 0' }}>{props.tittle ? props.tittle : 'Sample Tittle 1'}</h3>
                        <div name="preview-content" style={{ fontSize: '14px' }}>
                            <p class="more">
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                                Maecenas sed diam sed enim vestibulum gravida. Ut ultrices et ante ut egestas.
                                Nulla id interdum nisi. Pellentesque at ex tempor, placerat urna quis, maximus lacus.
                                Nullam pharetra, leo vel tincidunt gravida, elit erat pretium justo, vel faucibus mauris mauris id tortor.
                                Praesent aliquam sodales odio, eu consequat nibh efficitur et. Sed pretium diam nulla.
                                Vestibulum feugiat venenatis sapien a congue.
                            </p>
                        </div>
                        <div name='files' style={{ height: '300px', backgroundColor: 'gray', padding: '20px 0' }}></div>
                        <div name='comment'>
                            <a style={{ padding: '8px' }}>
                                <i class="bi bi-chat" />
                                <span> {props.comment ? props.comment : 999} comment(s)</span>
                            </a>
                        </div>
                    </Col>
                </Row>
            </Container>
        </div>
    )
}
