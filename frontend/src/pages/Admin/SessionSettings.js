import React, { useState } from 'react'
import { Button, Table } from 'reactstrap';

function SessionSettings() {
    const [data, setData] = useState([
        {
            name: 'Winter-2021',
            start: '01/01/2021',
            end: '15/03/2021',
            topic: 'Covid-19'
        },
        {
            name: 'Spring-2021',
            start: '16/03/2021',
            end: '15/06/2021',
            topic: 'Talkshow'
        },
        {
            name: 'Summer-2021',
            start: '16/06/2021',
            end: '15/09/2021',
            topic: 'Soft Skills'
        },
        {
            name: 'Fall-2021',
            start: '16/09/2021',
            end: '31/12/2021',
            topic: 'Books'
        }
    ]);

    return (
        <div style={{ paddingTop: '2%' }} >
            <div><span style={{ textDecorationLine: 'underline' }}>Current Sessions</span>: <span className="font-weight-bold">{data[0].name}</span></div>
            <div><span style={{ textDecorationLine: 'underline' }}>Duration</span>: <span className="font-weight-bold">{data[0].start} - {data[0].end}</span></div>
            <div><span style={{ textDecorationLine: 'underline' }}>Session Topic</span>: <span className="font-weight-bold">{data[0].topic}</span></div>
            <Table className='mt-4'responsive hover>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Start</th>
                        <th>End</th>
                        <th>Topic</th>
                        <th>Function</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((data) => (
                        <tr>
                            <td>{data.name}</td>
                            <td>{data.start}</td>
                            <td>{data.end}</td>
                            <td>{data.topic}</td>
                            <td><Button outline color="primary">Edit</Button></td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </div>
    )
}

export default SessionSettings
