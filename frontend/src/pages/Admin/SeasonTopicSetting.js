import React, { useEffect, useState } from 'react';
import DatePicker from "react-datepicker";
import { useDispatch, useSelector } from 'react-redux';
import { Button, Col, Form, FormGroup, Input, Label, Modal, ModalBody, ModalFooter, ModalHeader, Row, Table } from 'reactstrap';
import LoadingBox from '../../components/Return Boxes/LoadingBox';
import MessageBox from '../../components/Return Boxes/MessageBox';
import { addseasontopic } from '../../redux folder/actions/articleaction';

function SeasonTopicSettings() {
    const dispatch = useDispatch();

    const addSeasonTopic = useSelector(state => state.addSeasonTopic);
    const { response, loading, error } = addSeasonTopic;

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

    const [dateRange, setDateRange] = useState([null, null]);
    const [startDate, endDate] = dateRange;

    const [modal, setModal] = useState(false);

    const toggleModalAdd = () => setModal(!modal);

    const [modalEdit, setModalEdit] = useState(false);

    const toggleModalEdit = () => setModalEdit(!modalEdit);

    const [season, setSeason] = useState('');

    const [topic, setTopic] = useState('');

    function CheckSeason() {
        const date = new Date();
        const month = date.getUTCMonth();
        const year = date.getUTCFullYear();

        const season = () => {
            if (month >= 0 && month <= 2) {
                return 'Spring';
            }
            if (month >= 3 && month <= 5) {
                return 'Summer';
            }
            if (month >= 6 && month <= 8) {
                return 'Autumn';
            }
            if (month >= 9 && month <= 11) {
                return 'Winter';
            }
            else return 'defaultseason';
        }
        setSeason(`${season()} ${year}`)
        return;
    }


    const AddSeason = (e) => {
        e.preventDefault();
        const seasondata = {
            season: season,
            startedDate: startDate,
            endedDate: endDate,
            topic: topic
        }
        dispatch(addseasontopic(seasondata));
        toggleModalAdd()
    }

    useEffect(() => {
        CheckSeason();
    }, [])

    return (
        <div style={{ paddingTop: '2%' }} >
            {
                loading && <LoadingBox />
            }
            {
                error && <MessageBox variant='danger'>{error}</MessageBox>
            }

            <div><span style={{ textDecorationLine: 'underline' }}>Current Seasons</span>: <span className="font-weight-bold">{data[0].name}</span></div>
            <div><span style={{ textDecorationLine: 'underline' }}>Duration</span>: <span className="font-weight-bold">{data[0].start} - {data[0].end}</span></div>
            <div><span style={{ textDecorationLine: 'underline' }}>Ongoing Season Topic</span>: <span className="font-weight-bold">{data[0].topic}</span></div>
            <div className="mt-4"><Button outline color="primary" onClick={toggleModalAdd}>Add Season Topic</Button></div>
            
            {/* Nhớ sửa cái vụ phải check validation rồi mới cho submit */}

            <Modal isOpen={modal} toggle={toggleModalAdd}>
                <ModalHeader toggle={toggleModalAdd}>Add Season</ModalHeader>
                <ModalBody>
                    <Form>
                        <Row form>
                            <Col md={12}>
                                <FormGroup>
                                    <Label for="seasonName">Season name</Label>
                                    <Input type="text" name="seasonName" id="seasonName" placeholder="Season name" value={season} disabled />
                                </FormGroup>
                            </Col>
                        </Row>
                        <Row form>
                            <Col md={12}>
                                Duration: <span className='text-danger'>*</span>
                                <div className='w-100'>
                                    <DatePicker
                                        selectsRange={true}
                                        startDate={startDate}
                                        endDate={endDate}
                                        onChange={(update) => {
                                            setDateRange(update);
                                        }}
                                        withPortal
                                        className='w-100'
                                    />
                                </div>
                            </Col>
                        </Row>
                        <Row form className='mt-3'>
                            <Col md={12}>
                                <FormGroup>
                                    <Label for="seasonTopic">Season Topic <span className='text-danger'>*</span></Label>
                                    <Input type="text" name="seasonTopic" id="seasonTopic" placeholder="Season Topic" required onChange={(e) => { setTopic(e.target.value) }} />
                                </FormGroup>
                            </Col>
                        </Row>
                    </Form>
                </ModalBody>
                <ModalFooter>
                    <Button color="primary" type="submit" onClick={(e) => AddSeason(e)}>Add New Season</Button>{' '}
                    <Button color="secondary" onClick={toggleModalAdd}>Cancel</Button>
                </ModalFooter>
            </Modal>
            <Table className='mt-2' responsive hover>
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
                        <tr key={data.name}>
                            <td>{data.name}</td>
                            <td>{data.start}</td>
                            <td>{data.end}</td>
                            <td>{data.topic}</td>
                            <td><Button outline color="primary" onClick={toggleModalEdit}>Edit</Button></td>
                            {/* Nhớ sửa cái vụ phải check validation rồi mới cho submit */}
                            <Modal isOpen={modalEdit} toggle={toggleModalEdit}>
                                <ModalHeader toggle={toggleModalEdit}>Edit Season</ModalHeader>
                                <ModalBody>
                                    <Form>
                                        <Row form>
                                            <Col md={12}>
                                                <FormGroup>
                                                    <Label for="seasonName">Season name <span className='text-danger'>*</span></Label>
                                                    <Input type="text" name="seasonName" id="seasonName" placeholder="Season name" required />
                                                </FormGroup>
                                            </Col>
                                        </Row>
                                        <Row form>
                                            <Col md={12}>
                                                Duration: <span className='text-danger'>*</span>
                                                <div className='w-100'>
                                                    <DatePicker
                                                        selectsRange={true}
                                                        startDate={startDate}
                                                        endDate={endDate}
                                                        onChange={(update) => {
                                                            setDateRange(update);
                                                        }}
                                                        withPortal
                                                        className='w-100'
                                                    />
                                                </div>
                                            </Col>
                                        </Row>
                                        <Row form className='mt-3'>
                                            <Col md={12}>
                                                <FormGroup>
                                                    <Label for="seasonTopic">Season Topic <span className='text-danger'>*</span></Label>
                                                    <Input type="text" name="seasonTopic" id="seasonTopic" placeholder="Season Topic" required />
                                                </FormGroup>
                                            </Col>
                                        </Row>
                                    </Form>
                                </ModalBody>
                                <ModalFooter>
                                    <Button color="primary" onClick={toggleModalEdit}>Edit Season</Button>{' '}
                                    <Button color="secondary" onClick={toggleModalEdit}>Cancel</Button>
                                </ModalFooter>
                            </Modal>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </div>
    )
}

export default SeasonTopicSettings
