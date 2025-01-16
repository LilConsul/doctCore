import React, {useEffect, useState} from 'react';
import {Routes, Route, useNavigate} from 'react-router-dom';
import {AppSidebar} from "@/components/app-sidebar.jsx";
import {SidebarProvider} from "@/components/ui/sidebar";
import Account from "@/Account.jsx";
import Home from "@/Home.jsx";
import AppointmentsPage from "@/Appointments.jsx";
import AppointmentsHistory from "@/AppointmentsHistory.jsx";
import CreateAppointmentPage from "@/CreateAppointment.jsx";

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
            <SidebarProvider>
                <AppSidebar/>
                <main>
                    <Routes>
                        <Route path="/" element={<Home/>}/>
                        <Route path="/account" element={<Account/>}/>
                        <Route path="/appointments" element={<AppointmentsPage/>}/>
                        <Route path="/appointments/history" element={<AppointmentsHistory/>}/>
                        <Route path="/appointments/new" element={<CreateAppointmentPage/>}/>
                    </Routes>
                </main>
            </SidebarProvider>
        );
    }
}

export default App;