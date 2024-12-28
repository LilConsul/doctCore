import { useState } from 'react';
import { LoginForm } from "@/components/login-form.jsx";
import { RegisterPatientForm } from "@/components/register-patient.jsx";
import { RegisterDoctorForm } from "@/components/register-doctor.jsx";
import { Button } from "@/components/ui/button.jsx";

export default function Authentication() {
    const [isRegistering, setIsRegistering] = useState(false);
    const [isDoctorRegistering, setIsDoctorRegistering] = useState(false);

    return (
        <div className="flex items-center min-h-svh justify-center bg-muted p-6 md:p-10">
            <div className="flex flex-col items-center w-full max-w-sm gap-6">
                <a href="#" className="flex items-center gap-2 text-9xl" style={{ fontSize: '2.5rem' }}>
                    DoctCore
                </a>
                {isRegistering ? (
                    <RegisterPatientForm />
                ) : isDoctorRegistering ? (
                    <RegisterDoctorForm />
                ) : (
                    <LoginForm />
                )}
                <div className="flex gap-4">
                    {isRegistering || isDoctorRegistering ? (
                        <Button variant="outline" onClick={() => { setIsRegistering(false); setIsDoctorRegistering(false); }}>
                            Back to Login
                        </Button>
                    ) : (
                        <>
                            <Button variant="outline" onClick={() => setIsRegistering(true)}>
                                Sign Up as Patient
                            </Button>
                            <Button variant="outline" onClick={() => setIsDoctorRegistering(true)}>
                                Sign Up as Doctor
                            </Button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}