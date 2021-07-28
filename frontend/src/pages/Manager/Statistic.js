import React, { useEffect, useState } from 'react';
import { Col, CustomInput, Form, FormGroup, Label, Progress, Row, Table } from 'reactstrap';

function Statistic() {
    const [data, setData] = useState([]);
    const [faculty, setFaculty] = useState('');
    const [total, setTotal] = useState([
        {
            coordinatorName: 'Manager',
            totalContributions: 15,
            totalContributors: 25,
            contributorPercent: 15 / 25 * 100,
            contributionTotalPercent: 100,
        }
    ])

    const [design, setDesign] = useState([]);

    const [marketing, setMarketing] = useState([
        {
            coordinatorName: 'LongNH69',
            totalContributions: 4,
            totalContributors: 6,
            contributorPercent: (4 / 6 * 100).toFixed(2),
            contributionTotalPercent: (4 / 15 * 100).toFixed(2),
        }
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
            <Form>
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
            </Form>
            <Row>
                <Col>
                    Statistic
                </Col>
            </Row>
            <div className="mb-3" />
            <Table responsive hover bordered>
                <thead>
                    <tr>
                        <th>Coordinator Name</th>
                        <th>Total Contributions</th>
                        <th>Total Contributors</th>
                        <th>% Contributors/Contributions</th>
                        <th>% Contributions/Total Faculty</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((data) => (
                        <tr>
                            <td>{data.coordinatorName}</td>
                            <td>{data.totalContributions}</td>
                            <td>{data.totalContributors}</td>
                            <td>{data.contributorPercent}%</td>
                            <td>{data.contributionTotalPercent}%</td>
                        </tr>
                    ))}
                </tbody>
            </Table>
            <div>Progress Bar: </div>
            {data ? data.map((data) => (
                <div>
                    <div className="text-center">Contributors/Contributions: {data.contributorPercent}%</div>
                    <Progress
                        value={data.contributorPercent} />
                    <div className="text-center mt-4">Faculty's Contribution/TotalContributions: {data.contributionTotalPercent}%</div>
                    <Progress
                        value={data.contributionTotalPercent} />
                </div>
            )) : null}

        </div>
    )
}

export default Statistic
