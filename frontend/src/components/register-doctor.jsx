import {cn, validateField} from "@/lib/utils";
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
import SelectField from "@/components/select-field";

export function RegisterDoctorForm({className, ...props}) {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        password: "",
        confirm_password: "",
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
        const {id, value} = e.target;
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
                            <FormField
                                id="name"
                                label="Name"
                                placeholder="John Doe"
                                required
                                value={formData.name}
                                onChange={handleChange}
                                error={errors.name}
                            />
                            <FormField
                                id="email"
                                label="Email"
                                type="email"
                                placeholder="johny@example.com"
                                required
                                value={formData.email}
                                onChange={handleChange}
                                error={errors.email}
                            />
                            <FormField
                                id="phone"
                                label="Phone"
                                type="tel"
                                placeholder="+48 123 456 789"
                                required
                                value={formData.phone}
                                onChange={handleChange}
                                error={errors.phone}
                            />
                            <FormField
                                id="password"
                                label="Password"
                                type="password"
                                required
                                value={formData.password}
                                onChange={handleChange}
                                error={errors.password}
                            />
                            <FormField
                                id="confirm_password"
                                label="Confirm Password"
                                type="password"
                                required
                                value={formData.confirm_password}
                                onChange={handleChange}
                                error={errors.confirm_password}
                            />
                            <SelectField
                                id="specialization"
                                label="Specialization"
                                options={[
                                    {value: "cardiology", label: "Cardiology"},
                                    {value: "pediatrics", label: "Pediatrics"},
                                    {value: "neurology", label: "Neurology"},
                                    {value: "otorhinolaryngology", label: "Otorhinolaryngology"},
                                ]}
                                value={formData.specialization}
                                onChange={handleSelectChange}
                                error={errors.specialization}
                            />
                            <FormField
                                id="bio"
                                label="Bio"
                                placeholder="Short bio"
                                required
                                value={formData.bio}
                                onChange={handleChange}
                                error={errors.bio}
                            />
                            <FormField
                                id="fee"
                                label="Consultation Fee"
                                type="number"
                                placeholder="100"
                                required
                                value={formData.fee}
                                onChange={handleChange}
                                error={errors.fee}
                            />
                            <SelectField
                                id="sex"
                                label="Sex"
                                options={[
                                    {value: "male", label: "Male"},
                                    {value: "female", label: "Female"},
                                ]}
                                value={formData.sex}
                                onChange={handleSelectChange}
                                error={errors.sex}
                            />
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