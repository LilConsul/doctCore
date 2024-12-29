import React, {useEffect, useState} from 'react';
import axios from 'axios';
import {Button} from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import FormField from '@/components/form-field';
import SelectField from '@/components/select-field';

const Profile = () => {
    const [userData, setUserData] = useState({});
    const [currentField, setCurrentField] = useState(null);
    const [newFieldValue, setNewFieldValue] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

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

    const handleFieldClick = (field) => {
        setCurrentField(field);
        setErrorMessage('');
        setNewFieldValue(userData[field]);
    };

    const handleSaveChanges = async () => {
        if (currentField === 'email') {
            setErrorMessage('You cannot change your email address due to security reasons.');
            return;
        }
        try {
            setErrorMessage('');
            const token = localStorage.getItem('auth_token');
            const tokenType = localStorage.getItem('auth_token_type');
            const updatedData = {[currentField]: newFieldValue};
            const response = await axios.put('http://localhost:8000/users/update-profile', updatedData, {
                headers: {
                    Authorization: `${tokenType} ${token}`
                },
            });
            setUserData(prevState => ({...prevState, [currentField]: newFieldValue}));
            window.location.reload();
        } catch (error) {
            const errorDetail = error.response ? error.response.data.detail : error.message;
            setErrorMessage(typeof errorDetail === 'object' ? JSON.stringify(errorDetail) : errorDetail);
        }
    };

    return (
        <div className="flex flex-col gap-6">
            {Object.keys(userData).filter(field => field !== 'role').map((field) => (
                <div key={field} className="flex justify-between items-center">
                    <span>{field.charAt(0).toUpperCase() + field.slice(1)}: {userData[field]}</span>
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button variant="outline" onClick={() => handleFieldClick(field)}>Edit</Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                                <DialogTitle>Edit your {field}</DialogTitle>
                                <DialogDescription>
                                    Make changes to your {field} here. Click save when you're done.
                                </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                                <div className="grid grid-cols-1 items-center">
                                    {field === 'sex' ? (
                                        <SelectField
                                            id={field}
                                            label="Sex"
                                            options={[
                                                {value: "male", label: "Male"},
                                                {value: "female", label: "Female"},
                                            ]}
                                            value={newFieldValue}
                                            onChange={(id, value) => setNewFieldValue(value)}
                                        />
                                    ) : (
                                        <FormField
                                            id={field}
                                            label={field.charAt(0).toUpperCase() + field.slice(1)}
                                            value={newFieldValue}
                                            onChange={(e) => setNewFieldValue(e.target.value)}
                                        />
                                    )}
                                </div>
                            </div>
                            {errorMessage && <span className="text-red-500">{errorMessage}</span>}
                            <DialogFooter>
                                <Button type="submit" onClick={handleSaveChanges}>Save changes</Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>
            ))}
        </div>
    );
};

export default Profile;