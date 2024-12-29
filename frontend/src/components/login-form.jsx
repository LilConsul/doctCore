import {cn} from "@/lib/utils";
import {Button} from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {useState} from "react";
import axios from 'axios';
import {useNavigate} from 'react-router-dom';
import FormField from "@/components/form-field";

export function LoginForm({className, ...props}) {
    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });
    const [errorMessage, setErrorMessage] = useState("");
    const navigate = useNavigate();

    const handleChange = (e) => {
        const {id, value} = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [id]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:8000/auth/login', formData);
            if (response.data.detail !== 'Login successful') {
                throw new Error('Email or password is incorrect');
            }
            const {token_type, access_token} = response.data.result;
            localStorage.setItem("auth_token", access_token);
            localStorage.setItem("auth_token_type", token_type);
            navigate('/');
        } catch (error) {
            const errorDetail = error.response ? error.response.data.detail : error.message;
            setErrorMessage(typeof errorDetail === 'object' ? JSON.stringify(errorDetail) : errorDetail);
        }
    };

    return (
        <div className={cn("flex flex-col gap-6", className)} {...props}>
            <Card>
                <CardHeader>
                    <CardTitle className="text-2xl">Login</CardTitle>
                    <CardDescription>
                        Enter your email below to login to your account
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit}>
                        <div className="flex flex-col gap-6">
                            <FormField
                                id="email"
                                label="Email"
                                type="email"
                                placeholder="your@email.com"
                                required
                                value={formData.email}
                                onChange={handleChange}
                            />
                            <FormField
                                id="password"
                                label="Password"
                                type="password"
                                required
                                value={formData.password}
                                onChange={handleChange}
                            />
                            {errorMessage && <span className="text-red-500">{errorMessage}</span>}
                            <Button type="submit" className="w-full">
                                Login
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}