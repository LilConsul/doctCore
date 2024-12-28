import { cn, validateField } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export function RegisterDoctorForm({ className, ...props }) {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        password: "",
        sex: "male",
        role: "doctor",
        user_id: 0,
        specialization: "cardiology",
        bio: "",
        fee: 0,
    });

    const [errors, setErrors] = useState({});
    const [errorMessage, setErrorMessage] = useState("");
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [id]: value,
        }));
        setErrors(validateField(id, value, formData, errors));
    };

    const handleSelectChange = (id, value) => {
        setFormData((prevData) => ({
            ...prevData,
            [id]: value,
        }));
        setErrors(validateField(id, value, formData, errors));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (Object.keys(errors).length === 0) {
            try {
                const response = await axios.post('http://localhost:8000/auth/register-doctor', formData);
                if (response.data.detail === "Doctor registered successfully") {
                    navigate('/');
                } else {
                    setErrorMessage(response.data.detail);
                }
            } catch (error) {
                const errorDetail = error.response ? error.response.data.detail : error.message;
                setErrorMessage(typeof errorDetail === 'object' ? JSON.stringify(errorDetail) : errorDetail);
            }
        }
    };

    return (
        <div className={cn("flex flex-col gap-6", className)} {...props}>
            <Card>
                <CardHeader>
                    <CardTitle className="text-2xl">Register as Doctor</CardTitle>
                    <CardDescription>
                        Enter your details below to create a new doctor account
                    </CardDescription>
                    {errorMessage && <span className="text-red-500">{errorMessage}</span>}
                </CardHeader>
                <CardContent className="max-h-96 overflow-y-auto">
                    <form onSubmit={handleSubmit}>
                        <div className="flex flex-col gap-6">
                            <div className="grid gap-2">
                                <Label htmlFor="name">Name</Label>
                                <Input
                                    id="name"
                                    type="text"
                                    placeholder="John Doe"
                                    required
                                    onChange={handleChange}
                                />
                                {errors.name && <span className="text-red-500">{errors.name}</span>}
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="johny@example.com"
                                    required
                                    onChange={handleChange}
                                />
                                {errors.email && <span className="text-red-500">{errors.email}</span>}
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="phone">Phone</Label>
                                <Input
                                    id="phone"
                                    type="tel"
                                    placeholder="+48 123 456 789"
                                    required
                                    onChange={handleChange}
                                />
                                {errors.phone && <span className="text-red-500">{errors.phone}</span>}
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="password">Password</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    required
                                    onChange={handleChange}
                                />
                                {errors.password && <span className="text-red-500">{errors.password}</span>}
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="confirm_password">Confirm Password</Label>
                                <Input
                                    id="confirm_password"
                                    type="password"
                                    required
                                    onChange={handleChange}
                                />
                                {errors.confirm_password && <span className="text-red-500">{errors.confirm_password}</span>}
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="specialization">Specialization</Label>
                                <Select onValueChange={(value) => handleSelectChange("specialization", value)}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select your specialization"/>
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            <SelectItem value="cardiology">Cardiology</SelectItem>
                                            <SelectItem value="pediatrics">Pediatrics</SelectItem>
                                            <SelectItem value="neurology">Neurology</SelectItem>
                                            <SelectItem value="otorhinolaryngology">Otorhinolaryngology</SelectItem>
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                                {errors.specialization && <span className="text-red-500">{errors.specialization}</span>}
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="bio">Bio</Label>
                                <Input
                                    id="bio"
                                    type="text"
                                    placeholder="Short bio"
                                    required
                                    onChange={handleChange}
                                />
                                {errors.bio && <span className="text-red-500">{errors.bio}</span>}
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="fee">Consultation Fee</Label>
                                <Input
                                    id="fee"
                                    type="number"
                                    placeholder="100"
                                    required
                                    onChange={handleChange}
                                />
                                {errors.fee && <span className="text-red-500">{errors.fee}</span>}
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="sex">Sex</Label>
                                <Select onValueChange={(value) => handleSelectChange("sex", value)}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select your sex"/>
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            <SelectItem value="male">Male</SelectItem>
                                            <SelectItem value="female">Female</SelectItem>
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                                {errors.sex && <span className="text-red-500">{errors.sex}</span>}
                            </div>
                            <Button type="submit" className="w-full">
                                Register
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}