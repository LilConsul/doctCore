import React, {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {Button} from '@/components/ui/button';

function App() {
    const [token, setToken] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const storedToken = localStorage.getItem('auth_token');
        if (storedToken) {
            setToken(storedToken);
        } else {
            navigate('/auth');
        }
    }, [navigate]);

    if (token == null) {
        return null;
    } else {
        return (
            <div>
                <h1>Welcome to the app</h1>
                <Button onClick={() => {
                    localStorage.removeItem('token');
                    setToken(null);
                    navigate('/auth');
                }}>Logout</Button>
            </div>
        );
    }
}

export default App;