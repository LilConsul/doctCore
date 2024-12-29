import * as React from "react";
import {useState, useEffect} from "react";
import axios from "axios";
import {
    Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarRail,
} from "@/components/ui/sidebar";
import {Button} from "@/components/ui/button";
import {useNavigate} from "react-router-dom";
import {NavMain} from "@/components/nav-main";
import logo from "@/assets/logo.svg";

const defaultUser = {
    name: "Unknown User", email: "unknown@example.com", avatar: "/avatars/default.jpg",
    navMain: []
};

const adminData = {
    navMain: [{
        title: "Admin Dashboard", url: "#", items: [{
            title: "User Management", url: "#",
        }, {
            title: "System Settings", url: "#",
        },],
    }, {
        title: "Settings", url: "#", items: [{
            title: "Profile", url: "/profile",
        }, {
            title: "Account", url: "#",
        }]
    }]
};

const doctorData = {
    navMain: [{
        title: "Dashboard", url: "#", items: [{
            title: "Overview", url: "#",
        }, {
            title: "Reports", url: "#",
        },],
    }, {
        title: "Appointments", url: "#", items: [{
            title: "My Appointments", url: "#",
        }, {
            title: "New Appointment", url: "#",
        },],
    }, {
        title: "Settings", url: "#", items: [{
            title: "Profile", url: "/profile",
        }, {
            title: "Account", url: "#",
        },],
    },]
};

const patientData = {
    navMain: [{
        title: "Dashboard", url: "#", items: [{
            title: "Overview", url: "#",
        }, {
            title: "My Health", url: "#",
        },],
    }, {
        title: "Appointments", url: "#", items: [{
            title: "My Appointments", url: "#",
        }, {
            title: "New Appointment", url: "#",
        },],
    }, {
        title: "Settings", url: "#", items: [{
            title: "Profile", url: "/profile",
        }, {
            title: "Account", url: "#",
        },],
    },]
};

export function AppSidebar({...props}) {
    const navigate = useNavigate();
    const [userData, setUserData] = useState(null);

    useEffect(() => {
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
            logout();
        });
    }, []);


    const logout = () => {
        localStorage.removeItem("auth_token");
        localStorage.removeItem("auth_token_type");
        navigate('/auth');
    };

    if (!userData) {
        return (
            <Sidebar collapsible="icon" {...props}>
                <SidebarHeader>
                    <div className="flex flex-col items-center">
                        <img src={logo} alt="DoctCore Logo" className="w-12 h-12 mb-2"/>
                        <span className="text-3xl font-bold">DoctCore</span>
                        <span className="mt-2 text-sm">Retrieving your data...</span>
                        <span className="mt-2 text-sm">If it takes too long try to logout</span>
                    </div>
                </SidebarHeader>
                <SidebarContent/>
                <SidebarFooter>
                    <Button variant="outline" onClick={logout} className="hover:bg-red-500 hover:text-white">
                        Logout
                    </Button>
                </SidebarFooter>
                <SidebarRail/>
            </Sidebar>);
    }

    let data;
    switch (userData.role) {
        case "admin":
            data = adminData;
            break;
        case "doctor":
            data = doctorData;
            break;
        case "patient":
            data = patientData;
            break;
        default:
            data = {user: defaultUser};
    }


    return (
        <Sidebar collapsible="icon" {...props}>
            <SidebarHeader>
                <div className="flex flex-col items-center">
                    <img src={logo} alt="DoctCore Logo" className="w-12 h-12 mb-2"/>
                    <span className="text-3xl font-bold">DoctCore</span>
                    <span className="mt-2 text-sm">Welcome, {userData.name}</span>
                    <span className="mt-2 text-sm font-medium">Role: {userData.role}</span>
                </div>
            </SidebarHeader>
            <SidebarContent>
                <NavMain items={data.navMain}/>
            </SidebarContent>
            <SidebarFooter>
                <Button variant="outline" onClick={logout} className="hover:bg-red-500 hover:text-white">
                    Logout
                </Button>
            </SidebarFooter>
            <SidebarRail/>
        </Sidebar>
    );
}