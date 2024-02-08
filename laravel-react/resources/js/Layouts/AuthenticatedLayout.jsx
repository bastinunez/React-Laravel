import { useState } from 'react';
import { Sidebar } from '@/Components/Sidebar';
import NavbarComponent from '@/Components/Navbar';
import { useSidebarStore } from '@/Store/useStore';


export default function Authenticated({ user, header, children }) {
    const { sidebar,changeState} = useSidebarStore();
    
    return (
        <div className=" flex h-screen bg-slate-200">
            {/* SIDEBAR */}
            <div>
                <Sidebar user={user} visible={sidebar}>
                    
                </Sidebar>
               
            </div>
            {/* NAVBAR Y MAIN */}
            <div className={`flex-grow ${sidebar ? 'ml-72' : 'ml-16'}`}>
                <NavbarComponent></NavbarComponent>
                
                <main>
                    <div className="align-center justify-center full-width h-full flex-col bg-slate-200">
                        <div className="d-flex w-100 justify-center py-6 container mx-auto">
                            <div>
                             {children}
                            </div>
                        </div>
                        
                    </div>
                </main>
            </div>

            
        </div>
    );
}
