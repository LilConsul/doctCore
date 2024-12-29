import React, {useEffect, useState} from 'react';
import axios from 'axios';
import ProfileField from '@/components/profile-field';
import {validateField} from "@/lib/utils.js";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card.jsx";

const Account = () => {
    const [userData, setUserData] = useState({});
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const token = localStorage.getItem('auth_token');
                const tokenType = localStorage.getItem('auth_token_type');
                axios.get("http://localhost:8000/users", {
                    headers: {
                        Authorization: `${tokenType} ${token}`
                    }
                }).then(response => {
                    setUserData(response.data.result);
                }).catch(error => {
                    console.error("Error fetching user data:", error);
                });
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };

        fetchUserData();
    }, []);

    const handleSaveChanges = async (field, newFieldValue) => {
        setSuccessMessage('');
        setErrorMessage('');
        if (field === 'email') {
            setErrorMessage('You cannot change your email address due to security reasons.');
            return;
        }
        if (field === 'phone') {
            const validationErrors = validateField(field, newFieldValue, {}, {});
            if (validationErrors.phone) {
                setErrorMessage(validationErrors.phone + '. Example: +48 123 456 789');
                return;
            }
        }
        try {
            setErrorMessage('');
            const token = localStorage.getItem('auth_token');
            const tokenType = localStorage.getItem('auth_token_type');
            const updatedData = {[field]: newFieldValue};
            const response = await axios.put('http://localhost:8000/users/update-profile', updatedData, {
                headers: {
                    Authorization: `${tokenType} ${token}`
                },
            });
            setUserData(response.data.result);
            setSuccessMessage('Changes saved successfully');
        } catch (error) {
            const errorDetail = error.response ? error.response.data.detail : error.message;
            setErrorMessage(typeof errorDetail === 'object' ? JSON.stringify(errorDetail) : errorDetail);
        }
    };

    return (
        <div className="h-screen ml-10 flex items-center justify-center">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle className="flex justify-center w-full">Profile</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col gap-6">
                        {Object.keys(userData).filter(field => field !== 'role').map((field) => (
                            <ProfileField
                                key={field}
                                field={field}
                                value={userData[field]}
                                onEdit={handleSaveChanges}
                                setErrorMessage={setErrorMessage}
                            />
                        ))}
                    </div>
                    {errorMessage && <div className="mx-4 text-red-500">{errorMessage}</div>}
                    {successMessage && <div className="text-green-500">{successMessage}</div>}
                </CardContent>
            </Card>
        </div>
    );
};

export default Account;