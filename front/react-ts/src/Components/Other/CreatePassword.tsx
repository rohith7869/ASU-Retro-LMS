import React, { useEffect, useState } from 'react';
import './CreatePassword.css';
import { useNavigate, useLocation } from "react-router-dom";

const CreatePassword: React.FC = (props) => {

    const [password, setPassword] = useState<string>('');
    const [errorString, setErrorString] = useState<string>('');
    const [confirmPassword, setConfirmPassword] = useState<string>('');
    const [showErrorString, setShowErrorString] = useState<boolean>(false);
    const [firstName, setFirstName] = useState<string>('');
    const [lastName, setLastName] = useState<string>('');
    const [makeStudentEditable, setMakeStudentEditable] = useState<boolean>(false);
    const navigate = useNavigate();
    const location = useLocation();
    const data = location.state;

    useEffect(() => {
        if (!data) {
            navigate('/login');
        } else {

            setFirstName(data.firstName);
            setLastName(data.lastName);
            const checkAuth = async () => {
                try {
                    const response = await fetch('http://localhost:8080/check-auth', {
                        method: 'GET',
                        credentials: 'include'
                    });
                    if (!response.ok) {
                        navigate('/login');
                    } else {
                        const data = await response.json();
                        setMakeStudentEditable(data.makeStudentEditable);
                    }
                } catch (error) {
                    console.error('Error checking authentication:', error);
                }
            }

            checkAuth();
        }
    });

    const updatePassword = async () => {
        const passwordRegex = /^(?=.*[!@#$%^&*])(?=.*[0-9].*[0-9]).{8,}$/; // Regex for password format

            if (firstName.trim() === '' || lastName.trim() === '' || password.trim() === '' || confirmPassword.trim() === '') {
                setErrorString('Please fill in all fields');
                setShowErrorString(true);
            } else if (password !== confirmPassword) {
                setErrorString('Passwords do not match');
                setShowErrorString(true);
            } else if (!passwordRegex.test(password)) {
                setErrorString('Password must contain at least 8 characters including at least 2 numbers and at least 1 special character');
                setShowErrorString(true);
            } else {
                try {
                    const response = await fetch('http://localhost:8080/updateStudent', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            firstName,
                            lastName,
                            password
                        }),
                        credentials: 'include',
                    });
                    if (!response.ok) {
                        setErrorString('Failed to update password');
                        setShowErrorString(true);
                    } else {
                        navigate('/dashboard');
                    } 
                } catch (error) {
                   setErrorString('Failed to update password');
                   setShowErrorString(true);
                }
            }
        };



    return (
    <div className="nes-container is-dark with-title flex-container">
        <div className="center-container">
            { makeStudentEditable &&
            <div className='names'>
                <div className="nes-container is-dark with-title" style={{marginTop:"50px"}}>
                    <p className="title">First Name</p>
                    <input 
                        type="text"
                        style={{color: 'black'}} 
                        id="firstName" 
                        onChange={(e) => setFirstName(e.target.value)}
                        className="nes-input" 
                        value={firstName} 
                    />
                </div>
                <div className="nes-container is-dark with-title" style={{marginTop:"15px"}}>
                    <p className="title">Last Name</p>
                    <input 
                        type="text"
                        style={{color: 'black'}} 
                        id="lastName" 
                        onChange={(e) => setLastName(e.target.value)}
                        className="nes-input" 
                        value={lastName} 
                    />
                </div>
                </div>
                }
                <div className="nes-container is-dark with-title" style={{marginTop:"50px"}}>
                    <p className="title">Password</p>
                    <input 
                        type="password"
                        style={{color: 'black'}} 
                        id="password" 
                        onChange={(e) => setPassword(e.target.value)}
                        className="nes-input" 
                        value={password} 
                    />
                </div>
                <div className="nes-container is-dark with-title" style={{marginTop:"15px"}}>
                    <p className="title">Confirm Password</p>
                    <input 
                        type="password"
                        style={{color: 'black'}} 
                        id="confirm-password" 
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="nes-input" 
                        value={confirmPassword} 
                    />
                </div>
            

                <div style={{marginTop:"15px"}}>
                    <p className="error-message" style={{ display: showErrorString ? 'block' : 'none', color: "red" }}>{errorString}</p>
                </div>
                <button type="button" className="nes-btn is-success" onClick={updatePassword}>Create Password</button>
        </div>
    </div>
)

}

export default CreatePassword;