import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { Button } from 'primereact/button';     
import React, { useState } from "react";
import { Chips } from 'primereact/chips';   

import { Rating } from 'primereact/rating';
        

export default function Dashboard({ auth }) {
    const [value, setValue] = useState([]);
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Dashboard</h2>}
        >
            <Head title="Dashboard" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-2">
                        {/* <div className="p-6 text-gray-900">You're logged in!</div> */}
                        <div className="card p-fluid">
                            {/* <Chips value={value} onChange={(e) => setValue(e.value)} /> */}
                            <Rating value={value} onChange={(e) => setValue(e.value)} />
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
