import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import './index.css';
import App from './App.jsx';
import Authentication from './AuthService.jsx';
import Profile from './Profile.jsx';

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <Router>
            <Routes>
                <Route path="/auth" element={<Authentication/>}/>
                <Route path="/edit-profile" element={<Profile/>}/>
                <Route path="*" element={<App/>}/>
            </Routes>
        </Router>
    </StrictMode>,
);