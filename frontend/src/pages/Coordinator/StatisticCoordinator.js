import React, { useEffect, useState } from 'react';
import { Col, CustomInput, Form, FormGroup, Label, Progress, Row, Table } from 'reactstrap';

function StatisticCoordinator() {
    const [data, setData] = useState([
        {
            faculty: 'Marketing',
            coordinatorName: 'LongNH69',
            totalContributions: 15,
            totalContributors: 25,
            contributorPercent: 15 / 25 * 100,
            contributionTotalPercent: 100,
        }
    ]);
    
    // useEffect(() => {
        
    // }, [])

    return (
        <div style={{ paddingTop: '2%' }} >
           <div className="mb-4"><span style={{textDecorationLine: 'underline'}}>Your Faculty</span>: <span className='font-weight-bold'>{data[0].faculty}</span></div>
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

export default StatisticCoordinator;
