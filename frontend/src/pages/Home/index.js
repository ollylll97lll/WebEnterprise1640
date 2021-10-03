import Pagination from 'rc-pagination'
import "rc-pagination/assets/index.css"
import React, { useEffect, useState } from 'react'
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"
import { useSelector } from 'react-redux'
import { Card, CardBody, CardImg, CardText, CardTitle, Col, Container, CustomInput, Form, FormGroup, Label, Media, Row } from 'reactstrap'
import RedditCards from '../../components/Cards/Cards'
import Footer from '../../components/Footer'
import GuestNav from '../../components/Navbar/GuestNav'
import { renderNavBar } from '../../components/Navbar/renderNavBar'
import Timer from '../../components/Timer'

function HomePage() {
    const [data, setData] = useState([]);

    const userLogin = useSelector(state => state.userLogin)
    const { userInfo, loading, error } = userLogin;
    let userRole = userInfo.userInfo.role;

    //này để lấy session hiển thị
    const [startDate, setStartDate] = useState(new Date());

    const dateFormatted = startDate.getMonth() + 1 + '/' + startDate.getFullYear();

    //để phân loại role để lọc ra set lên Data
    const [faculty, setFaculty] = useState('');

    //để lấy bài mới nhất hiển thị nổi bật
    const [highlight, setHighlight] = useState(
        {
            id: 1,
            faculty: 'Marketing',
            owner: 'LamNN11',
            submittedAt: '21/07/2021',
            title: 'Marketing 1',
            type: 'Article',
            description: 'Bài báo này nói về tình hình dịch Covid - 19',
            checked: false,
            document: '/file/covid19.docx',
            url: 'https://via.placeholder.com/600/771796',
        }
    );

    //lấy tất cả account (mọi role, mọi faculty), initialState khi load trang
    const [total, setTotal] = useState([
        {
            id: 1,
            faculty: 'Marketing',
            owner: 'LamNN11',
            submittedAt: '21/07/2021',
            title: 'Marketing 1',
            type: 'Article',
            description: 'Bài báo này nói về tình hình dịch Covid - 19',
            checked: false,
            document: '/file/covid19.docx',
            url: 'https://via.placeholder.com/600/771796',
        },
        {
            id: 2,
            faculty: 'Marketing',
            owner: 'DuyCM',
            submittedAt: '22/07/2021',
            title: 'Marketing 2',
            type: 'Photograph',
            description: 'Vài hình ảnh về tình hình dịch Covid - 19',
            checked: false,
            document: '/file/covid.zip',
            url: 'https://via.placeholder.com/600/24f355'
        },
        {
            id: 3,
            faculty: 'Design',
            owner: 'AnhDQ',
            submittedAt: '23/07/2021',
            title: 'Design 1',
            type: 'Article',
            description: 'Thiết kế công trình nhà ở',
            checked: false,
            document: '/file/design.zip',
            url: 'https://via.placeholder.com/600/92c952'
        },
        {
            id: 4,
            faculty: 'Computing',
            owner: 'ManNM',
            submittedAt: '22/07/2021',
            title: 'Computing 1',
            type: 'Article',
            description: 'Vài hình ảnh về tình hình dịch Covid - 19',
            checked: false,
            document: '/file/covid.zip',
            url: 'https://via.placeholder.com/600/24f355'
        }
    ]);

    //lấy data từng faculty
    const [design, setDesign] = useState([
        {
            id: 3,
            faculty: 'Design',
            owner: 'AnhDQ',
            submittedAt: '23/07/2021',
            title: 'Design 1',
            type: 'Article',
            description: 'Thiết kế công trình nhà ở',
            checked: false,
            document: '/file/design.zip',
            url: 'https://via.placeholder.com/600/92c952'
        }
    ]);

    const [marketing, setMarketing] = useState([
        {
            id: 1,
            faculty: 'Marketing',
            owner: 'LamNN11',
            submittedAt: '21/07/2021',
            title: 'Marketing 1',
            type: 'Article',
            description: 'Bài báo này nói về tình hình dịch Covid - 19',
            checked: false,
            document: '/file/covid19.docx',
            url: 'https://via.placeholder.com/600/771796',
        },
        {
            id: 2,
            faculty: 'Marketing',
            owner: 'DuyCM',
            submittedAt: '22/07/2021',
            title: 'Marketing 2',
            type: 'Photograph',
            description: 'Vài hình ảnh về tình hình dịch Covid - 19',
            checked: false,
            document: '/file/covid.zip',
            url: 'https://via.placeholder.com/600/24f355'
        },
    ])

    const [computing, setComputing] = useState([
        {
            id: 4,
            faculty: 'Computing',
            owner: 'ManNM',
            submittedAt: '22/07/2021',
            title: 'Computing 1',
            type: 'Article',
            description: 'Vài hình ảnh về tình hình dịch Covid - 19',
            checked: false,
            document: '/file/covid.zip',
            url: 'https://via.placeholder.com/600/24f355'
        }
    ]);

    const [business, setBusiness] = useState([]);
    const [eventManage, setEventManage] = useState([]);
    const [communication, setCommunication] = useState([]);

    //lấy faculty để phân loại selectbox
    const handleChange = (e) => {
        const value = e.target.value;
        setFaculty(value);
    }

    //phân loại data theo faculty
    const dataSelector = () => {
        switch (faculty) {
            case '':
                setData(total);
                break;
            case 'Graphic and Digital Design':
                setData(design);
                break;
            case 'Marketing':
                setData(marketing);
                break;
            case 'Computing':
                setData(computing);
                break;
            case 'Business Management':
                setData(business);
                break;
            case 'Event Management':
                setData(eventManage);
                break;
            case 'Public Relations':
                setData(communication);
                break;
            default:
                return data;
        }
    }

    //thay đổi data theo faculty select box
    useEffect(() => {
        dataSelector();
    }, [faculty])

    return (
        <div className="page-container" style={{backgroundColor:'#DAE0E6'}}>
            <div className="content-wrap" >
                {renderNavBar(userRole)}
                <div className="col-12 mt-3">
                    <Timer />
                </div>
                <h4 className="text-center">Home Page</h4>
                <br />
                <div name="filter"></div>
                <div style={{display:'flex', justifyContent:'center'}}>
                    <Col sm='12' md='6'>
                        <RedditCards />
                        <RedditCards />
                        <RedditCards />
                        <RedditCards />
                        <RedditCards />
                    </Col>
                </div>

            </div>
            <br/>
            <Footer />
        </div >
    )
}

export default HomePage
