// AddInstructorForm.tsx
import React, { useState , useEffect} from 'react';
import './AddInstructorForm.css';  // Ensure your CSS file is imported
import axios from 'axios';
import { toast } from "react-toastify";

interface InstructorData {
    firstName: string;
    lastName: string;
    username: string;
    email: string;
    password?: string | undefined;
}

interface InstructorErrors {
    firstName: string;
    lastName: string;
    username: string;
    email: string;
    password: string;
}

interface Props {
    onSubmit: (data: InstructorData) => void;
    instructor?: InstructorData | null;
}


const AddInstructorForm: React.FC<Props> = ({ onSubmit,instructor = undefined}) => {
    const [isEditing,setIsEditing] = useState(false);
    const [formData, setFormData] = useState<InstructorData>({
        firstName: '',
        lastName: '',
        username: '',
        email: '',
        password: '',
    });
    const [formErrors, setFormErrors] = useState<InstructorErrors>({
        firstName: '',
        lastName: '',
        username: '',
        email: '',
        password: '',
    });

    useEffect(() => {
        if (instructor) {
            setIsEditing(true);
            setFormData(instructor);
        }
    }, [instructor]);


    const validateEmail = (email: string): boolean => {
        const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    };

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setFormData(prev => ({ ...prev, [name]: value }));

        let errors = { ...formErrors };

        switch (name) {
            case 'firstName':
            case 'lastName':
                errors[name] = value.length < 1 ? 'This field cannot be empty.' : '';
                break;
            case 'email':
                errors.email = validateEmail(value) ? '' : 'Email is not valid.';
                break;
            case 'password':
                errors.password = value.length >= 8 ? '' : 'Password must be at least 8 characters.';
                break;
            default:
                break;
        }

        setFormErrors(errors);
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFormSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        if(!formErrors.firstName && !formErrors.lastName && !formErrors.email && !formErrors.password){
            if(!instructor){
                try {
                    const response = await axios.post('http://localhost:8080/signup', {
                        username: formData.username,
                        password: formData.password,
                        role: 'instructor',
                        profile: {
                            firstName: formData.firstName,
                            lastName: formData.lastName,
                            email: formData.email
                        }
                    });
                    if(response.status === 200){
                    toast.info('Instructor added successfully', {
                        position: toast.POSITION.TOP_CENTER,
                      });
                    }
                    onSubmit(formData);
                } catch (error:any) {
                    toast.error('Failed to add instructor:'+ error.response.data.message, {
                        position: toast.POSITION.TOP_CENTER,
                      });
                }   
            }
            else{
                try {
                    const response = await axios.post(`http://localhost:8080/updateInstructorDetails/${formData.username}`, {
                        username: formData.username,
                        // password: formData.password,
                        firstName: formData.firstName,
                        lastName: formData.lastName,
                        email: formData.email
                        
                    });
                    if(response.status === 200){
                        toast.info('Instructor updated successfully', {
                            position: toast.POSITION.TOP_CENTER,
                          });
                    }
                    onSubmit(formData);
                } catch (error:any) {
                    console.error('Error updating instructor:', error.response.data.message);
                    toast.error('Failed to add instructor:'+error.response.data.message, {
                        position: toast.POSITION.TOP_CENTER,
                      });
                }
            }
        }
        else{
            toast.error('Please fill in all required fields', {
                position: toast.POSITION.TOP_CENTER,
              });
        }
        
        
    };

    const generatePassword = () => {
        const newPassword = Math.random().toString(36).slice(-8);
        setFormData(prev => ({ ...prev, password: newPassword }));
    };
    return (
        <form onSubmit={handleFormSubmit} className="add-instructor-form">
            <div className="input-group">
                <label>First Name:</label>
                <input type="text" name="firstName" value={formData.firstName} onChange={handleInputChange} required />
                {formErrors.firstName && <div className="error">{formErrors.firstName}</div>}
            </div>
            <div className="input-group">
                <label>Last Name:</label>
                <input type="text" name="lastName" value={formData.lastName} onChange={handleInputChange} required />
                {formErrors.lastName && <div className="error">{formErrors.lastName}</div>}
            </div>
            <div className="input-group">
                <label>Username:</label>
                <input type="text" name="username" value={formData.username} onChange={handleInputChange} disabled={isEditing} required />
                {formErrors.username && <div className="error">{formErrors.username}</div>}
            </div>
            <div className="input-group">
                <label>Email:</label>
                <input type="email" name="email" value={formData.email} onChange={handleInputChange} required />
                {formErrors.email && <div className="error">{formErrors.email}</div>}

            </div>
            <div className="input-group password-group">
                <label>Password:</label>
                <input type="text" name="password" value={formData.password} readOnly disabled={!(formData.username.length < 1)}/>
                {!isEditing ? <button type="button" onClick={generatePassword} className="nes-btn is-success">Generate Password</button> :
                <button type="button" onClick={generatePassword} disabled={isEditing} className="nes-btn">Generate Password</button>}
                
                {formErrors.password && <div className="error">{formErrors.password}</div>}
            </div>

            <button type="submit" className="nes-btn is-primary">{instructor ? 'Update' : 'Add'}</button>
        </form>
    );
};

export default AddInstructorForm;
