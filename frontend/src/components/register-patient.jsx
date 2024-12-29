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

export function RegisterPatientForm({className, ...props}) {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        password: "",
        confirm_password: "",
        sex: "male",
        role: "patient",
        user_id: 0,
        blood_type: "A+",
        address: "",
        birth: "",
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
                const [year, month, day] = formData.birth.split('-');
                const formattedBirthDate = `${day}-${month}-${year}`;
                const updatedFormData = {...formData, birth: formattedBirthDate};
                const response = await axios.post('http://localhost:8000/auth/register-patient', updatedFormData);
                if (response.data.detail === "Patient registered successfully") {
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
                    <CardTitle className="text-2xl">Register as Patient</CardTitle>
                    <CardDescription>
                        Enter your details below to create a new patient account
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
                            <FormField
                                id="birth"
                                label="Birth Date"
                                type="date"
                                required
                                value={formData.birth}
                                onChange={handleChange}
                                error={errors.birth}
                            />
                            <FormField
                                id="address"
                                label="Address"
                                placeholder="al. Adama Mickiewicza 30, Kraków"
                                required
                                value={formData.address}
                                onChange={handleChange}
                                error={errors.address}
                            />
                            <SelectField
                                id="blood_type"
                                label="Blood Type"
                                options={[
                                    {value: "A+", label: "A+"},
                                    {value: "A-", label: "A-"},
                                    {value: "B+", label: "B+"},
                                    {value: "B-", label: "B-"},
                                    {value: "AB+", label: "AB+"},
                                    {value: "AB-", label: "AB-"},
                                    {value: "O+", label: "O+"},
                                    {value: "O-", label: "O-"},
                                ]}
                                value={formData.blood_type}
                                onChange={handleSelectChange}
                                error={errors.blood_type}
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