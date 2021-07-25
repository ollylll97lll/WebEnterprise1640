import React, { useEffect, useState } from 'react';
import { Button, CustomInput, FormGroup, Label, Table } from 'reactstrap';

function StudentContribution() {
    const [data, setData] = useState([]);

    const [faculty, setFaculty] = useState('');

    const [total, setTotal] = useState([
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
        },
        {
            faculty: 'Design',
            submittedAt: '23/07/2021',
            title: 'Submission 2',
            type: 'Article',
            description: 'Thiết kế công trình nhà ở',
            checked: false,
            document: '/file/design.zip',
        }
    ]);

    const [design, setDesign] = useState([
        {
            faculty: 'Design',
            submittedAt: '23/07/2021',
            title: 'Submission 2',
            type: 'Article',
            description: 'Thiết kế công trình nhà ở',
            checked: false,
            document: '/file/design.zip',
        }
    ]);

    const [marketing, setMarketing] = useState([
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
        },
    ])

    const [computing, setComputing] = useState([]);
    const [business, setBusiness] = useState([]);
    const [eventManage, setEventManage] = useState([]);
    const [communication, setCommunication] = useState([]);

    const handleChange = (e) => {
        const value = e.target.value;
        setFaculty(value);
    }

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

    useEffect(() => {
        dataSelector();
    }, [faculty])

    return (
        <div style={{ paddingTop: '2%' }} >
            <FormGroup>
                <Label for='facultySelect'>Select Faculty</Label>
                <CustomInput type="select" id="facultySelect" name='facultySelect' onChange={handleChange}>
                    <option value="">All</option>
                    <option value="Graphic and Digital Design">Graphic and Digital Design</option>
                    <option value="Marketing">Marketing</option>
                    <option value="Computing">Computing</option>
                    <option value="Business Management">Business Management</option>
                    <option value="Event Management">Event Management</option>
                    <option value="Public Relations">Public Relations & Communications</option>
                </CustomInput>
            </FormGroup>
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
                        </tr>
                    ))}
                </tbody>
            </Table>
            <Button outline color="primary">Download selected file</Button>
        </div>
    )
}

export default StudentContribution
