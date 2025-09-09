import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import Logo from '../assets/logo.png'

const ResetPassword = () => {

    const { token } = useParams();
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {

        e.preventDefault();

        try {

            const res = await axios.post('http://localhost:5000/api/auth/resetpassword', {
                token,
                password
            });
            alert(res.data.message);
            setMessage("Password reset successfully");
            setTimeout(() => {
                navigate('/');
            }, 3000)
        } catch (error) {
            // console.error(error);
            // alert('Error in resetting Password');
            setMessage("Error in resetting Password", error);
        }
    }

    return (

        <div className='container-fluid'>
            <div className="row">
                <div className="col-12 col-md-2 col-lg-6 d-flex justify-content-center align-items-center flex-column vh-100">
                    <img src={Logo} className="img-fluid LogoImage" alt="Logo" />
                    <form onSubmit={handleSubmit}>

                        <h2>Reset Password</h2>

                        <div className="form-floating mb-3 mt-3">
                            <input
                                type="password"
                                className="form-control"
                                id="password"
                                placeholder="Enter new password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                            <label htmlFor="password">Password</label>
                        </div>

                        <button type='submit' className='btn btn-dark rounded-5 w-100 mt-3'>Reset Password</button>

                    </form>
                    {message && (
                        <p className='fs-6 text-center'>{message}</p>
                    )}
                </div>
                <div className="col-12 col-md-8 col-lg-6 d-flex justify-content-center align-items-center flex-column gap-4 vh-100 secondBox">
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

export default ResetPassword;