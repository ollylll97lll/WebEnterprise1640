import Pagination from 'rc-pagination';
import React, { useEffect, useState } from 'react'
import { Button, Col, CustomInput, Form, FormGroup, Label, Progress, Row, Table } from 'reactstrap';

function AccountManagement() {
    const [data, setData] = useState([]);
    const [faculty, setFaculty] = useState('');
    const [role, setRole] = useState('');
    const [total, setTotal] = useState([
        {
            faculty: 'Graphic and Digital Design',
            email: 'whisper4shot1kill@gmail.com',
            role: 'Manager',
            password: 'whisper4shot1kill@gmail.com'
        },
        {
            faculty: 'Graphic and Digital Design',
            email: 'AnhDQ@gmail.com',
            role: 'Coordinator',
            password: 'AnhDQ@gmail.com'
        },
        {
            faculty: 'Graphic and Digital Design',
            email: 'AnhDQStudent@gmail.com',
            role: 'Student',
            password: 'AnhDQStudent@gmail.com'
        },
        {
            faculty: 'Marketing',
            email: 'ltv.9a2.21@gmail.com',
            role: 'Manager',
            password: 'ltv.9a2.21@gmail.com'
        },
        {
            faculty: 'Marketing',
            email: 'longnh@gmail.com',
            role: 'Coordinator',
            password: 'longnh@gmail.com'
        },
        {
            faculty: 'Marketing',
            email: 'longnhStudent@gmail.com',
            role: 'Student',
            password: 'longnhStudent@gmail.com'
        },
        {
            faculty: 'Computing',
            email: 'nhatlam1695@gmail.com',
            role: 'Manager',
            password: 'nhatlam1695@gmail.com'
        },
        {
            faculty: 'Computing',
            email: 'nhatlamStudent@gmail.com',
            role: 'Coordinator',
            password: 'nhatlamStudent@gmail.com'
        },
        {
            faculty: 'Computing',
            email: 'lamnn11@gmail.com',
            role: 'Student',
            password: 'lamnn11@gmail.com'
        },
        {
            faculty: 'Business Management',
            email: 'nguyenmman06@gmail.com',
            role: 'Coordinator',
            password: 'nguyenmman06@gmail.com'
        },
        {
            faculty: 'Business Management',
            email: 'ManNM@gmail.com',
            role: 'Coordinator',
            password: 'ManNM@gmail.com'
        },
        {
            faculty: 'Business Management',
            email: 'ManNMStudent@gmail.com',
            role: 'Student',
            password: 'ManNMStudent@gmail.com'
        },
        {
            faculty: 'Event Management',
            email: 'chauminhduy.2607@gmail.com',
            role: 'Manager',
            password: 'chauminhduy.2607@gmail.com'
        },
        {
            faculty: 'Event Management',
            email: 'duycm@gmail.com',
            role: 'Coordinator',
            password: 'duycm@gmail.com'
        },
        {
            faculty: 'Event Management',
            email: 'duycmStudent@gmail.com',
            role: 'Student',
            password: 'duycmStudent@gmail.com'
        },
        {
            faculty: 'Public Relations & Communications',
            email: 'sept9th2015@gmail.com',
            role: 'Manager',
            password: 'sept9th2015@gmail.com'
        },
        {
            faculty: 'Public Relations & Communications',
            email: '9915ln001@gmail.com',
            role: 'Coordinator',
            password: '9915ln001@gmail.com'
        },
        {
            faculty: 'Public Relations & Communications',
            email: '9915ln001Student@gmail.com',
            role: 'Student',
            password: '9915ln001Student@gmail.com'
        },
    ]);
    const [design, setDesign] = useState([]);
    const [marketing, setMarketing] = useState([]);
    const [computing, setComputing] = useState([]);
    const [business, setBusiness] = useState([]);
    const [eventManage, setEventManage] = useState([]);
    const [communication, setCommunication] = useState([]);

    const handleChange = (e) => {
        const value = e.target.value;
        setFaculty(value);
    }

    const handleRoleChange = (e) => {
        const value = e.target.value;
        setRole(value);
    }

    const roleSelector = () => {
        switch (role) {
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
                <FormGroup>
                    <Label for='roleSelect'>Select Role</Label>
                    <CustomInput type="select" id="roleSelect" name='roleSelect' onChange={handleRoleChange}>
                        <option value="">All</option>
                        <option value="Manager">Manager</option>
                        <option value="Coordinator">Coordinator</option>
                        <option value="Student">Student</option>
                        <option value="Guest">Guest</option>
                    </CustomInput>
                </FormGroup>
            </Form>
            <Table responsive hover>
                <thead>
                    <tr>
                        <th>Email</th>
                        <th>Faculty</th>
                        <th>Role</th>
                        <th>Function</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((data) => (
                        <tr>
                            <td>{data.email}</td>
                            <td>{data.faculty}</td>
                            <td>{data.role}</td>
                            <td><Button outline color="primary">Reset Password</Button></td>
                        </tr>
                    ))}
                </tbody>
            </Table>
            <Pagination
                className='text-center mt-4 mb-4'
                total={100}
                defaultPageSize={9}
                pageSize={9}
            />
        </div>
    )
}

export default AccountManagement
