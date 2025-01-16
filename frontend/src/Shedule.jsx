import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { useToast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";
import { Loader2, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";

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

const DayScheduleCard = ({ schedule }) => {
    const formatTime = (time) => {
        return time.slice(0, 5); // Takes "09:00:00" and returns "09:00"
    };

    return (
        <Card className="flex-1 min-w-[250px]">
            <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium">
                    {schedule.day}
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                        {formatTime(schedule.start_time)} - {formatTime(schedule.end_time)}
                    </span>
                </div>
                <Badge className="mt-2" variant="secondary">
                    {
                        Math.round(
                            (new Date(`2000/01/01 ${schedule.end_time}`) -
                             new Date(`2000/01/01 ${schedule.start_time}`)) /
                            (1000 * 60 * 60)
                        )
                    } hours
                </Badge>
            </CardContent>
        </Card>
    );
};

const SchedulePage = () => {
    const [schedule, setSchedule] = useState([]);
    const [loading, setLoading] = useState(true);
    const { toast } = useToast();

    const weekDays = [
        'Monday', 'Tuesday', 'Wednesday', 'Thursday',
        'Friday', 'Saturday', 'Sunday'
    ];

    useEffect(() => {
        fetchSchedule();
    }, []);

    const getAuthHeaders = () => {
        const token = localStorage.getItem('auth_token');
        const tokenType = localStorage.getItem('auth_token_type');
        return {
            Authorization: `${tokenType} ${token}`
        };
    };

    const fetchSchedule = async () => {
        try {
            const response = await api.get('/schedule', {
                headers: getAuthHeaders()
            });

            if (Array.isArray(response.data?.result)) {
                setSchedule(response.data.result);
            } else {
                console.error('Invalid schedule data:', response.data);
                toast({
                    variant: "destructive",
                    title: "Error",
                    description: "Invalid schedule data received"
                });
                setSchedule([]);
            }
        } catch (error) {
            console.error('Error fetching schedule:', error);
            toast({
                variant: "destructive",
                title: "Error",
                description: "Failed to fetch schedule"
            });
            setSchedule([]);
        } finally {
            setLoading(false);
        }
    };

    const getScheduleForDay = (day) => {
        return schedule.find(s => s.day === day);
    };

    return (
        <div className="container mx-auto py-6">
            <Card>
                <CardHeader>
                    <CardTitle className="text-2xl">My Schedule</CardTitle>
                    <CardDescription>
                        View your weekly working hours
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="text-center py-4">
                            <Loader2 className="h-6 w-6 animate-spin mx-auto" />
                            <p className="mt-2">Loading schedule...</p>
                        </div>
                    ) : schedule.length === 0 ? (
                        <div className="text-center py-4 text-muted-foreground">
                            No schedule has been set yet
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                            {weekDays.map((day) => {
                                const daySchedule = getScheduleForDay(day);
                                if (!daySchedule) {
                                    return (
                                        <Card key={day} className="flex-1 min-w-[250px] opacity-50">
                                            <CardHeader className="pb-2">
                                                <CardTitle className="text-lg font-medium">
                                                    {day}
                                                </CardTitle>
                                            </CardHeader>
                                            <CardContent>
                                                <span className="text-sm text-muted-foreground">
                                                    No hours scheduled
                                                </span>
                                            </CardContent>
                                        </Card>
                                    );
                                }
                                return (
                                    <DayScheduleCard
                                        key={day}
                                        schedule={daySchedule}
                                    />
                                );
                            })}
                        </div>
                    )}
                </CardContent>
            </Card>
            <Toaster />
        </div>
    );
};

export default SchedulePage;