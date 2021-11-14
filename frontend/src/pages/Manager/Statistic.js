import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Col, CustomInput, Form, FormGroup, Label, Progress, Row, Table } from 'reactstrap';
import { DepartmentStatistic } from '../../redux folder/actions/statisticaction'
import Chart from 'react-google-charts'
import MessageBox from '../../components/Return Boxes/MessageBox'
import LoadingBox from '../../components/Return Boxes/LoadingBox'
import moment from 'moment'

function Statistic() {
    const dispatch = useDispatch();
    const DepStatistic = useSelector(state => state.DepStatistic)
    const userInfo = useSelector(state => state.userLogin.userInfo.userInfo);
    const { loading, statistic, error } = DepStatistic
    
    useEffect(() => {
        dispatch(DepartmentStatistic());
    }, [dispatch])

    // useEffect(() => {
    //     console.log('statistic', statistic);
    // }, [statistic])

    const randomcolor = [
        "#f0e0e0",
        "#e0f0e0",
        "#e0e0f0",

        "#ffe0e0e0",
        "#e0e0ff",
        "#aec4ce"
    ]
    return (
        <div style={{ paddingTop: '2%' }} >

            {
                loading ? (<LoadingBox />)
                    : error ? (<MessageBox variant="danger" >{error}</MessageBox>)
                        : (
                            <>
                                <div >
                                    <span>Your Department: <span style={{ fontWeight: 'bold' }}>{String(userInfo.department).toUpperCase()}</span></span>
                                </div>
                                <div className="mb-3" />

                                <div>
                                    {
                                        statistic.tableinfo ?
                                            (<>
                                                <ul className="row summary" style={{ listStyleType: 'none' }}>
                                                    {[...statistic.tableinfo].map(tabledata => {

                                                        // RANDOM COLOR
                                                        // WHY?
                                                        // FOR FUN BRO
                                                        const index = Math.floor(Math.random() * randomcolor.length)
                                                        const tempcolor = randomcolor[index];
                                                        randomcolor.splice(index,1)
                                                        
                                                        return (
                                                            <li style={{ border: '0.1rem solid', borderColor: '#c0c0c0', margin: '2rem', borderRadius: '0.5rem', flex: '1 1 20rem' }}>
                                                                <div style={{ fontSize: '1.5rem', padding: '1rem', backgroundColor: tempcolor }} >
                                                                    <span>{tabledata.title}</span>
                                                                </div>
                                                                <div style={{ fontSize: '3rem', padding: '1rem', textAlign: 'center' }}>
                                                                    {tabledata.data}
                                                                </div>
                                                            </li>
                                                        )
                                                    })}
                                                </ul>
                                            </>) :
                                            (<MessageBox>No Post</MessageBox>)
                                    }
                                </div>
                                <div>
                                    {
                                        statistic.PostGrouped.length === 0 ?
                                            (<MessageBox>No Post</MessageBox>) :
                                            (
                                                <Chart
                                                    width="100%"
                                                    height="50vh"
                                                    chartType="PieChart"
                                                    loader={<div>...LOADING...</div>}
                                                    data={[
                                                        ['Category', 'Posts'],
                                                        ...statistic.PostGrouped.map((x) => [x.categorydetails[0].name, x.posts])
                                                    ]}
                                                />
                                            )
                                    }
                                </div>

                                <div>
                                    {
                                        statistic.dailyPosts.length === 0 ?
                                            (<MessageBox>No Post</MessageBox>) :
                                            (
                                                <Chart
                                                    width="100%"
                                                    height="33vh"
                                                    chartType="AreaChart"
                                                    loader={<div>Loading Chart</div>}
                                                    data={[
                                                        ['Date', 'Posts'],
                                                        ...statistic.dailyPosts.map((x) => [x._id, x.posts]),
                                                    ]}
                                                />
                                            )
                                    }
                                </div>
                            </>
    )
}


        </div >
    )
}

export default Statistic
