import React, { useEffect, useState } from 'react';
import { Button, CustomInput, FormGroup, Label, Table } from 'reactstrap';
import Pagination from 'rc-pagination'
import "rc-pagination/assets/index.css"
import { useHistory } from 'react-router-dom';

function StudentContributionCoordinator() {
    const [data, setData] = useState([
        {
            faculty: 'Marketing',
            submittedAt: '21/07/2021',
            title: 'Submission 1',
            type: 'Article',
            description: 'Bài báo này nói về tình hình dịch Covid - 19',
            checked: false,
            document: '/file/covid19.docx',
        },
        {
            faculty: 'Marketing',
            submittedAt: '22/07/2021',
            title: 'Submission 2',
            type: 'Photograph',
            description: 'Vài hình ảnh về tình hình dịch Covid - 19',
            checked: false,
            document: '/file/covid.zip',
        }
    ]);

    const history = useHistory();

    const viewDetail = () => {
        history.push({
            pathname: '/viewdetails'
            // state:
        })
    }

    //get Data
    // useEffect(() => {
    // }, [])

    return (
        <div style={{ paddingTop: '2%' }} >
            <div className="mb-4"><span style={{textDecorationLine: 'underline'}}>Your Faculty</span>: <span className='font-weight-bold'>{data[0].faculty}</span></div>
            
            {/* Change Status */}
            <Button outline color="primary" className='mb-2'>Public selected file</Button>
            <Table responsive hover>
                <thead>
                    <tr>
                        <th className="text-center">Select</th>
                        <th>Faculty</th>
                        <th>Date</th>
                        <th>Title</th>
                        <th>Type</th>
                        <th>Description</th>
                        <th>Document download</th>
                        <th className="text-center">Function</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((data) => (
                        <tr>
                            <td className="text-center"><input type="checkbox" /></td>
                            <td>{data.faculty}</td>
                            <td>{data.submittedAt}</td>
                            <td className='cell'>{data.title}</td>
                            <td>{data.type}</td>
                            <td className='cell'>{data.description}</td>
                            <td>{data.document}</td>
                            <td className="text-center"><Button outline color="primary" onClick={viewDetail}>View Details</Button></td>
                        </tr>
                    ))}
                </tbody>
            </Table>
            <Pagination
                className='text-center mt-4'
                total={100}
                defaultPageSize={9}
                pageSize={9}
            />
        </div>
    )
}

export default StudentContributionCoordinator
