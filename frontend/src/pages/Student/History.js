import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Button, Table } from 'reactstrap';
import Pagination from 'rc-pagination'
import "rc-pagination/assets/index.css"
import axios from 'axios';
import { useSelector } from 'react-redux';

function History() {
    const userLogin = useSelector(state => state.userLogin)

    //Student thì chỉ xem bài của bản thân, nên ko có select

    const [data, setData] = useState([
        {
            id: 1,
            submittedAt: '21/07/2021',
            title: 'Submission 1',
            type: 'Article',
            description: 'Bài báo này nói về tình hình dịch Covid - 19',
            document: '/file/covid19.docx',
        },
        {
            id: 2,
            submittedAt: '22/07/2021',
            title: 'Submission 2',
            type: 'Photograph',
            description: 'Vài hình ảnh về tình hình dịch Covid - 19',
            document: '/file/covid.zip',
        },
    ])

    //Đá data qua View Details
    const history = useHistory();

    const getDataPost = async () => {
        try {
            const response = await axios.get(`http://localhost:5001/api/post/getall?userId=${userLogin.userInfo.userInfo._id}`)
            console.log(response)
        } catch (error) {

        }
    }

    useEffect(() => {
        getDataPost()
    }, [])

    const viewDetail = () => {
        history.push({
            pathname: '/viewdetails'
            // state:
        })
    }

    return (
        <div style={{ paddingTop: '2%' }} >
            <Table responsive hover>
                <thead>
                    <tr>
                        <th className="text-center">ID</th>
                        <th>Date</th>
                        <th>Title</th>
                        <th>Description</th>
                        <th className="text-center">Function</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((data) => (
                        <tr key={data.id}>
                            <td className='text-center'>{data.id}</td>
                            <td>{data.submittedAt}</td>
                            <td className='cell'>{data.title}</td>
                            <td className='cell'>{data.description}</td>
                            {/* Đẩy qua trang ViewDetail, đá data qua kia để hiện form bên kia */}
                            <td className="text-center"><Button outline color="primary" onClick={viewDetail}>View Details</Button></td>
                        </tr>
                    ))}
                </tbody>
            </Table>
            {/* Lấy total bằng cách lấy data.length, pageSize là lượng data mỗi trang */}
            <Pagination
                className='text-center mt-4'
                total={100}
                defaultPageSize={9}
                pageSize={9}
            />
        </div >
    )
}

export default History
