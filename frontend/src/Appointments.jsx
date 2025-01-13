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
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";

const AppointmentsPage = () => {
    const [appointments, setAppointments] = useState([]);
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
        fetchAppointments();
    }, []);

    const fetchAppointments = async () => {
        try {
            const response = await axios.get('http://localhost:8000/appointments', {
                headers: getAuthHeaders()
            });
            setAppointments(response.data.result);
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Error",
                description: "Failed to fetch appointments"
            });
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (appointmentId, newStatus) => {
        try {
            await axios.post('http://localhost:8000/appointments/change_status', null, {
                params: {
                    appointment_id: appointmentId,
                    status: newStatus
                },
                headers: getAuthHeaders()
            });

            // Update local state
            setAppointments(appointments.map(apt =>
                apt.id === appointmentId ? { ...apt, status: newStatus } : apt
            ));

            toast({
                title: "Success",
                description: `Appointment ${newStatus} successfully`
            });
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Error",
                description: `Failed to ${newStatus} appointment`
            });
        }
    };

    const getStatusBadge = (status) => {
        const variants = {
            pending: "bg-yellow-100 text-yellow-800",
            approved: "bg-green-100 text-green-800",
            rejected: "bg-red-100 text-red-800"
        };
        return (
            <Badge className={variants[status]}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
            </Badge>
        );
    };

    return (
        <div className="container mx-auto py-6">
            <Card>
                <CardHeader>
                    <CardTitle className="text-2xl">Appointments</CardTitle>
                    <CardDescription>
                        Manage your upcoming appointments
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="text-center py-4">Loading appointments...</div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Patient</TableHead>
                                    <TableHead>Date & Time</TableHead>
                                    <TableHead>Contact</TableHead>
                                    <TableHead>Blood Type</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {appointments.map((appointment) => (
                                    <TableRow key={appointment.id}>
                                        <TableCell>
                                            <div className="font-medium">{appointment.name}</div>
                                            <div className="text-sm text-gray-500">
                                                {format(new Date(appointment.birthdate), 'dd MMM yyyy')}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            {format(new Date(appointment.date_time), 'dd MMM yyyy HH:mm')}
                                        </TableCell>
                                        <TableCell>
                                            <div>{appointment.phone}</div>
                                            <div className="text-sm text-gray-500">{appointment.email}</div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="outline">{appointment.blood_type}</Badge>
                                        </TableCell>
                                        <TableCell>
                                            {getStatusBadge(appointment.status)}
                                        </TableCell>
                                        <TableCell>
                                            {appointment.status === 'pending' && appointment.blood_type && (
                                                <div className="flex gap-2">
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        className="bg-green-100 hover:bg-green-200 text-green-800"
                                                        onClick={() => handleStatusUpdate(appointment.id, 'approved')}
                                                    >
                                                        Approve
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        className="bg-red-100 hover:bg-red-200 text-red-800"
                                                        onClick={() => handleStatusUpdate(appointment.id, 'rejected')}
                                                    >
                                                        Reject
                                                    </Button>
                                                </div>
                                            )}
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

export default AppointmentsPage;