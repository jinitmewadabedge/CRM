import React from 'react'
import Logo from '../../assets/logo.png'

const Footer = () => {
    return (
        <>
            <div className='d-flex justify-content-between align-items-center p-2 fw-semibold' style={{color: "#42602e"}}>
                <img src={Logo} className='img-fluid' style={{height: '40px'}} alt="" />
                Bedge Tech Services
            </div>
        </>
    )
}

export default Footer