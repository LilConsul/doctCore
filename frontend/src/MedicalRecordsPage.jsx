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
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useToast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";

const MedicalRecords = () => {
    const [records, setRecords] = useState([]);
    const [loading, setLoading] = useState(true);
    const { toast } = useToast();

    const getAuthHeaders = () => {
        const token = localStorage.getItem('auth_token');
        const tokenType = localStorage.getItem('auth_token_type');
        return {
            Authorization: `${tokenType} ${token}`
        };
    };

    useEffect(() => {
        fetchMedicalRecords();
    }, []);

    const fetchMedicalRecords = async () => {
        try {
            const response = await axios.get('http://localhost:8000/medical-records', {
                headers: getAuthHeaders()
            });
            setRecords(response.data.result);
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Error",
                description: "Failed to fetch medical records"
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto py-6">
            <Card>
                <CardHeader>
                    <CardTitle className="text-2xl">Medical Records</CardTitle>
                    <CardDescription>
                        View patient medical history and diagnoses
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="text-center py-4">Loading medical records...</div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Patient Information</TableHead>
                                    <TableHead>Contact Details</TableHead>
                                    <TableHead>Diagnosis & Treatment</TableHead>
                                    <TableHead>Date</TableHead>
                                    <TableHead>Blood Type</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {records.map((record) => (
                                    <TableRow key={record.id}>
                                        <TableCell>
                                            <div className="font-medium">{record.name}</div>
                                            <div className="text-sm text-gray-500">
                                                Born: {format(new Date(record.birthdate), 'dd MMM yyyy')}
                                            </div>
                                            <div className="text-sm text-gray-500">{record.address}</div>
                                        </TableCell>
                                        <TableCell>
                                            <div>{record.phone}</div>
                                            <div className="text-sm text-gray-500">{record.email}</div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="font-medium">{record.diagnosis}</div>
                                            <div className="text-sm text-gray-500">{record.treatment}</div>
                                        </TableCell>
                                        <TableCell>
                                            {format(new Date(record.date), 'dd MMM yyyy')}
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="outline">{record.blood_type}</Badge>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>
            <Toaster />
        </div>
    );
};

export default MedicalRecords;