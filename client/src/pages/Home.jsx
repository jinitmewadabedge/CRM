import React from 'react'
import axios from 'axios';
import { useState, useEffect } from 'react';

const Home = () => {

    const [totalUser, setTotalUser] = useState(0);

    useEffect(() => {
        const fetchActiveUser = async () => {
            try {
                const res = await axios.get('http://localhost:5000/api/auth/active-user-count');
                setTotalUser(res.data.count);
                console.log(res.data.count);
            } catch (error) {
                console.error(error);
            }
        }
        fetchActiveUser();
    }, [])
    return (
        <div className="row vh-100">
            <div className="col-12 col-md-12 col-lg-12 border">
                <div className="col-lg-2">
                    <div className="card mt-2 shadow-sm">
                        <div className="card-body">
                            <h5 className='card-title'>Total Users</h5>
                            <p className='display-6'>{totalUser}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Home