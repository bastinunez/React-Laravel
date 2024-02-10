import { useState } from 'react';
import { Sidebar } from '@/Components/Sidebar';
import NavbarComponent from '@/Components/Navbar';
import { useSidebarStore } from '@/Store/useStore';
import { useDisclosure,Modal,ModalContent } from '@nextui-org/react';


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
            <div className={`flex-grow ${sidebar ? 'md:ml-64 ml-14' : 'ml-14'}`}>
                <NavbarComponent></NavbarComponent>
                
                <main className=''>
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
