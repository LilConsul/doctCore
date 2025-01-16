import React, { useState, useEffect } from 'react';
import axios from 'axios';
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
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";
import { Loader2 } from "lucide-react";

const api = axios.create({
    baseURL: 'http://localhost:8000',
    withCredentials: true,
    transformResponse: [(data) => {
        if (typeof data !== 'string') return data;
        try {
            return JSON.parse(data);
        } catch (e) {
            console.error('JSON Parse Error:', e);
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

const CreateMedicalRecordPage = () => {
    const [patients, setPatients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const { toast } = useToast();

    const [formData, setFormData] = useState({
        patient_id: '',
        diagnosis: '',
        treatment: ''
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

            const validPatients = patientData.filter(patient => (
                patient &&
                typeof patient === 'object' &&
                typeof patient.id === 'number' &&
                typeof patient.name === 'string'
            ));

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

        if (!formData.patient_id || !formData.diagnosis || !formData.treatment) {
            toast({
                variant: "destructive",
                title: "Validation Error",
                description: "Please fill in all fields"
            });
            return;
        }

        setSubmitting(true);

        try {
            const medicalRecordData = {
                patient_id: parseInt(formData.patient_id),
                diagnosis: formData.diagnosis,
                treatment: formData.treatment
            };

            await api.post('/medical-records/new', medicalRecordData, {
                headers: getAuthHeaders()
            });

            toast({
                title: "Success",
                description: "Medical record created successfully"
            });

            setFormData({
                patient_id: '',
                diagnosis: '',
                treatment: ''
            });
        } catch (error) {
            const errorMessage = typeof error.response?.data?.detail === 'string'
                ? error.response.data.detail
                : "Failed to create medical record";

            toast({
                variant: "destructive",
                title: "Error",
                description: errorMessage
            });
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="container mx-auto py-6">
            <Card>
                <CardHeader>
                    <CardTitle className="text-2xl">Create Medical Record</CardTitle>
                    <CardDescription>
                        Add a new medical record for a patient
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
                                <label className="text-sm font-medium">Diagnosis</label>
                                <Textarea
                                    value={formData.diagnosis}
                                    onChange={(e) =>
                                        setFormData(prev => ({ ...prev, diagnosis: e.target.value }))
                                    }
                                    placeholder="Enter diagnosis details"
                                    className="min-h-[100px]"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Treatment</label>
                                <Textarea
                                    value={formData.treatment}
                                    onChange={(e) =>
                                        setFormData(prev => ({ ...prev, treatment: e.target.value }))
                                    }
                                    placeholder="Enter treatment plan"
                                    className="min-h-[100px]"
                                />
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
                                    'Create Medical Record'
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

export default CreateMedicalRecordPage;