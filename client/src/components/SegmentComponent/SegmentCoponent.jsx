import React, { useEffect, useState } from 'react';
import { Scatter } from 'react-chartjs-2';
import { Chart, PointElement, LinearScale, Tooltip, Legend } from 'chart.js';
import './Segment.css'


Chart.register(PointElement, LinearScale, Tooltip, Legend);

const CustomerSegment = () => {
    const [chartData, setChartData] = useState(null);
    const [clusterData, setClusterData] = useState([]);

    useEffect(() => {
        fetch('http://127.0.0.1:5000/cluster')
            .then(response => response.json())
            .then(data => {
                const clusters = {
                    datasets: [{
                        label: 'Customer Segments',
                        data: data.map(item => ({
                            y: item.TotalRevenue,
                            x: item.ContractLength,
                            cluster: item.Cluster,
                            companyName: item.CompanyName,
                        })),
                        backgroundColor: data.map(item => {
                            
                            return item.Cluster === 0 ? 'rgba(255, 99, 132, 0.5)' :
                                   item.Cluster === 1 ? 'rgba(54, 162, 235, 0.5)' :
                                                        'rgba(75, 192, 192, 0.5)';
                        }),
                        pointRadius: 8
                        
                    }],
                };
                setChartData(clusters);
                setClusterData(data);
            })
            .catch(err => console.error(err));
    }, []);

    const cluster0 = clusterData.filter(item => item.Cluster === 0);
    const cluster1 = clusterData.filter(item => item.Cluster === 1);
    const cluster2 = clusterData.filter(item => item.Cluster === 2);
    const ClusterTable = ({ cluster, data }) => (
        <div className='App'>
            {/* <h3 className='head'>Cluster {cluster}</h3> */}
            <table>
                <thead>
                    <tr>
                        <th>Company Name</th>
                        <th>Total Revenue</th>
                        <th>Cluster</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((item, index) => (
                        <tr key={index}>
                            <td>{item.CompanyName}</td>
                            <td>{item.TotalRevenue}</td>
                            <td>{item.Cluster}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );

    return (

            <div className='return' style={{ width: '1200px', height: '1000px' }}> 
                {chartData ? (
                    <Scatter 
                        className='scatter'
                        data={chartData}
                        options={{
                            scales: {
                                x: {
                                    type: 'linear',
                                    title: {
                                        display: true,
                                        text: 'Contract Length (Months)'
                                    }
                                },
                                y: {
                                    type: 'linear',
                                    title: {
                                        display: true,
                                        text: 'Total Revenue'
                                        
                                    }
                                }
                            },
                            plugins: {
                                tooltip: {
                                    callbacks: {
                                        label: function(tooltipItem) {
                                            const dataPoint = tooltipItem.raw;
                                            return `Cluster: ${dataPoint.cluster}, Company: ${dataPoint.companyName}, Total Revenue: $${dataPoint.y}`;
                                        }
                                    }
                                }
                            }
                        }}
                    />
                ) : (
                    <p>Loading...</p>
                )}

            <div className='cluster' >
                <h3 className='h3'>CLUSTERS</h3>
                <h5 className='h5'>Cluster 0 : Low Engagement, At-Risk Customers</h5>
                <ul className='ul'>
                    
                    <li>
                    Total Revenue: Lower revenue compared to other clusters.
                    </li>
                    <li>Contract Length: Shorter contracts, possibly due to low confidence or satisfaction.</li>
                    <li>Product Usage Frequency: Monthly or lower, indicating they are less reliant on the product.</li>
                    <li>Support Tickets Opened: Higher number of tickets, possibly indicating dissatisfaction or more issues.</li>
                    <li>Churn Status: Higher churn risk, so they might need special attention to prevent churn.</li>
                </ul>
                <ClusterTable cluster={0} data={cluster0} />
                <h5 className='h5'>Cluster 1 : Moderate Engagement, Stable Customers</h5>
                <ul className='ul'>
                    <li>Total Revenue: Mid-range revenue.</li>
                    <li>Contract Length: Moderate contract lengths.</li>
                    <li>Product Usage Frequency: Weekly or occasional users, indicating they find the product valuable but not essential.</li>
                    <li>Support Tickets Opened: Moderate, meaning they are relatively satisfied with support.</li>
                    <li>Churn Status: Stable, with a medium churn risk.</li>
                </ul>
                <ClusterTable cluster={1} data={cluster1} />
                <h5 className='h5'>Cluster 2 : High-Value, High-Commitment Customers</h5>
                <ul className='ul'>
                    <li>Total Revenue: Highest revenue, indicating they are your most valuable customers.</li>
                    <li>Contract Length: These customers typically have longer contracts, indicating long-term engagement.</li>
                    <li>Product Usage Frequency: Daily or weekly users, suggesting they depend on the product regularly.</li>
                    <li>Churn Status: Very low churn rate, meaning they are less likely to leave.</li>
                </ul>
                <ClusterTable cluster={2} data={cluster2} />
            </div>
        </div>
    );
};

export default CustomerSegment;
