import React, { useState } from 'react'
import axios from 'axios'
import Logo from "../assets/logo.png";

const ForgotPassword = () => {

    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const BASE_URL = import.meta.env.VITE_BACKEND_URL;

    const handleSubmit = async (e) => {

        e.preventDefault();

        try {
            const res = await axios.post(`${BASE_URL}/api/auth/forgotpassword`, { email });
            console.log(res.data.message);
            setMessage(
                <>
                    Reset link sent to your email. <strong>{maskedEmail(email)}</strong>
                </>
            );
            setEmail("");
        } catch (error) {
            console.log(error);
            setMessage(`Failed to send link to ${maskedEmail(email)} , Please try again`);
        }
    }

    const maskedEmail = (email) => {
        if (!email || !email.includes("@")) return email;

        const [name, domain] = email.split("@");

        const maskedEmail = email.length > 2 ? name[0] + "*".repeat(name.length - 2) + name[name.length - 1] : name[0] + "*";

        return `${maskedEmail}@${domain}`;
    }

    return (

        <div className='container-fluid'>
            <div className="row">
                <div className="col-12 col-md-4 col-lg-6 d-flex justify-content-center align-items-center flex-column vh-100">
                    <img src={Logo} className="img-fluid LogoImage" alt="Logo" />
                    <h3 className='fs-3 fw-bold'>Forgot Password</h3>
                    <form onSubmit={handleSubmit}>
                        <div className="form-floating mb-3 mt-3">
                            <input
                                type="email"
                                className="form-control h-50"
                                id="email"
                                value={email}
                                placeholder="Enter email"
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                            <label htmlFor="email">Email</label>
                            <button type="submit" className="btn btn-dark rounded-5 w-100 mt-3">Send Reset Link</button>
                        </div>
                    </form>
                    {message && (
                        <p className='fs-6 text-center'>{message}</p>
                    )}
                </div>
                <div className="col-12 col-md-4 col-lg-6 d-flex justify-content-center align-items-center flex-column gap-4 vh-100 secondBox">
                    <h1 className="text-white text-center display-3">
                        <span className="fw-bold Empowering">Empowering </span> Teams, <br /> Driving{" "}
                        <span className="fw-bold Success">Success</span>.
                    </h1>
                    <p className="text-white">
                        Together is beginning, Together is progress, Together is success.
                    </p>
                </div>
            </div>
        </div>
    )
}

export default ForgotPassword