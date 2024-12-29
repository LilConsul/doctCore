import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx';

const Home = () => {
    const Technologies = () => {
        const technologies = [
            "Docker",
            "FastAPI",
            "PostgreSQL",
            "React",
            "shadcn/ui",
            "tailwindcss"
        ];
        return (
            <div className="h-screen ml-10 flex items-center justify-center">
                <Card className="w-full max-w-md">
                    <CardHeader>
                        <CardTitle className="flex justify-center w-full">DoctCore</CardTitle>
                    </CardHeader>
                    <CardContent>
                        Project was made by <a className="text-cyan-500" href="#">Shevchenko Denys</a> as a part of
                        Database
                        course. <br/><br/> Used technologies:
                        <ul className="list-disc list-inside">
                            {technologies.map((tech, index) => (
                                <li key={index}>{tech}</li>
                            ))}
                        </ul>
                    </CardContent>
                </Card>
            </div>
        );
    };

    return <Technologies />;
};

export default Home;