import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import FloatingChatbot from '../chat/FloatingChatbot';

export default function DashboardLayout() {
    return (
        <div className="flex h-screen overflow-hidden bg-slate-950 text-slate-100 relative">
            <div className="absolute top-[20%] left-[50%] w-[50%] h-[50%] rounded-full bg-primary/5 blur-[150px] pointer-events-none" />
            <Sidebar />
            <main className="flex-1 overflow-y-auto relative z-10 p-6 md:p-10">
                <Outlet />
            </main>
            <FloatingChatbot />
        </div>
    );
}
