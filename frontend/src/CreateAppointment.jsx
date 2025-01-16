import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { format } from 'date-fns';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import { useToast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";
import { cn } from "@/lib/utils";
import { CalendarIcon, Loader2 } from "lucide-react";

const api = axios.create({
    baseURL: 'http://localhost:8000',
    withCredentials: true,
    transformResponse: [(data) => {
        // Custom response transformer to handle malformed JSON
        if (typeof data !== 'string') return data;
        try {
            return JSON.parse(data);
        } catch (e) {
            console.error('JSON Parse Error:', e);
            // Return a valid data structure even if parsing fails
            return { result: [], detail: 'Failed to parse server response' };
        }
    }]
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('auth_token');
    const tokenType = localStorage.getItem('auth_token_type');
    if (token && tokenType) {
        config.headers.Authorization = `${tokenType} ${token}`;
    }
    return config;
});

const CreateAppointmentPage = () => {
    const [patients, setPatients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const { toast } = useToast();

    const [formData, setFormData] = useState({
        patient_id: '',
        date: null,
        time: '09:00'
    });

    useEffect(() => {
        fetchPatients();
    }, []);

    const getAuthHeaders = () => {
        const token = localStorage.getItem('auth_token');
        const tokenType = localStorage.getItem('auth_token_type');
        return {
            Authorization: `${tokenType} ${token}`
        };
    };

    const fetchPatients = async () => {
        try {
            const response = await api.get('/users/list-patients', {
                headers: getAuthHeaders()
            });

            // Validate the response structure
            const patientData = response.data?.result;
            if (!Array.isArray(patientData)) {
                console.error('Invalid patients data structure:', response.data);
                toast({
                    variant: "destructive",
                    title: "Error",
                    description: "Invalid data received from server"
                });
                setPatients([]);
                return;
            }

            // Filter and validate each patient object
            const validPatients = patientData.filter(patient => (
                patient &&
                typeof patient === 'object' &&
                typeof patient.id === 'number' &&
                typeof patient.name === 'string'
            ));

            if (validPatients.length === 0 && patientData.length > 0) {
                console.warn('No valid patients found in:', patientData);
                toast({
                    variant: "destructive",
                    title: "Warning",
                    description: "No valid patient data found"
                });
            }

            setPatients(validPatients);
        } catch (error) {
            console.error('Error fetching patients:', error);
            toast({
                variant: "destructive",
                title: "Error",
                description: "Failed to fetch patients list"
            });
            setPatients([]);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.patient_id || !formData.date || !formData.time) {
            toast({
                variant: "destructive",
                title: "Validation Error",
                description: "Please fill in all fields"
            });
            return;
        }

        setSubmitting(true);

        try {
            const dateTime = new Date(formData.date);
            const [hours, minutes] = formData.time.split(':');
            dateTime.setHours(parseInt(hours), parseInt(minutes));
            const formattedDateTime = dateTime.toISOString().split("Z")[0];

            const appointmentData = {
                patient_id: parseInt(formData.patient_id),
                date_time: formattedDateTime,
                status: 'pending'
            };

            await api.post('/appointments/new', appointmentData, {
                headers: getAuthHeaders()
            });

            toast({
                title: "Success",
                description: "Appointment created successfully"
            });

            setFormData({
                patient_id: '',
                date: null,
                time: '09:00'
            });
        } catch (error) {
            const errorMessage = typeof error.response?.data?.detail === 'string'
                ? error.response.data.detail
                : "Failed to create appointment";

            toast({
                variant: "destructive",
                title: "Error",
                description: errorMessage
            });
        } finally {
            setSubmitting(false);
        }
    };

    const timeSlots = Array.from({ length: 17 }, (_, i) => {
        const hour = Math.floor(i / 2) + 9;
        const minute = (i % 2) * 30;
        return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
    });

    return (
        <div className="container mx-auto py-6">
            <Card>
                <CardHeader>
                    <CardTitle className="text-2xl">Create New Appointment</CardTitle>
                    <CardDescription>
                        Schedule a new appointment with a patient
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="text-center py-4">
                            <Loader2 className="h-6 w-6 animate-spin mx-auto" />
                            <p className="mt-2">Loading patients...</p>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">
                                    Select Patient {patients.length === 0 && '(No patients available)'}
                                </label>
                                <Select
                                    value={formData.patient_id}
                                    onValueChange={(value) =>
                                        setFormData(prev => ({ ...prev, patient_id: value }))
                                    }
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select a patient" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {patients.map((patient) => (
                                            <SelectItem
                                                key={patient.id}
                                                value={patient.id.toString()}
                                            >
                                                {`${patient.name}${patient.blood_type ? ` - ${patient.blood_type}` : ''}`}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Select Date</label>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant="outline"
                                            className={cn(
                                                "w-full justify-start text-left font-normal",
                                                !formData.date && "text-muted-foreground"
                                            )}
                                        >
                                            <CalendarIcon className="mr-2 h-4 w-4" />
                                            {formData.date ? format(formData.date, "PPP") : "Pick a date"}
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0">
                                        <Calendar
                                            mode="single"
                                            selected={formData.date}
                                            onSelect={(date) =>
                                                setFormData(prev => ({ ...prev, date }))
                                            }
                                            disabled={(date) =>
                                                date < new Date() || date.getDay() === 0 || date.getDay() === 6
                                            }
                                            initialFocus
                                        />
                                    </PopoverContent>
                                </Popover>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Select Time</label>
                                <Select
                                    value={formData.time}
                                    onValueChange={(value) =>
                                        setFormData(prev => ({ ...prev, time: value }))
                                    }
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select time" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {timeSlots.map((time) => (
                                            <SelectItem key={time} value={time}>
                                                {time}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <Button
                                type="submit"
                                className="w-full"
                                disabled={submitting}
                            >
                                {submitting ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Creating...
                                    </>
                                ) : (
                                    'Create Appointment'
                                )}
                            </Button>
                        </form>
                    )}
                </CardContent>
            </Card>
            <Toaster />
        </div>
    );
};

export default CreateAppointmentPage;