import React, { useState } from 'react'
import { Link, useHistory } from 'react-router-dom'
import { Button, Table } from 'reactstrap'

function History() {
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

    const history = useHistory();

    const viewDetail = () => {
        history.push({
            pathname: '/viewdetails'
            // state:
        })
    }

    return (
        <div style={{ paddingTop: '2%' }} >
            <Table responsive hover style={{ tableLayout: 'fixed' }}>
                <thead>
                    <tr>
                        <th className="text-center col-1">ID</th>
                        <th className="col-1">Date</th>
                        <th className="col-2">Title</th>
                        <th className="col-8">Description</th>
                        <th className="col-2 text-center">Function</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((data) => (
                        <tr key={data.id}>
                            <td className='text-center'>{data.id}</td>
                            <td>{data.submittedAt}</td>
                            <td>{data.title}</td>
                            <td className='cell'>{data.description}</td>
                            <td className="text-center"><Button outline color="primary" onClick={viewDetail}>View Details</Button></td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </div >
    )
}

export default History
