import React from "react";
import { Link } from '@inertiajs/react';
import NavLink from '@/Components/NavLink';
import {Divider} from "@nextui-org/react";
import { usePermission } from '@/Composables/Permission';
import { useSidebarStore } from '@/Store/useStore';
import {User} from "@nextui-org/react";


export const Sidebar = ({user, visible, onHide }) => {
    //console.log(visible)
    const { sidebar,changeState} = useSidebarStore();
    const {hasRoles,hasPermission} = usePermission()

    return(
        <>
            <div className={`bg-slate-100 text-white fixed h-full transition-all p-3 duration-400 ease-in-out ${sidebar ? 'w-72' : 'w-20'}`}>
                <div className="text-black">
                    <User name={user.nombres}
                        description={(
                            <p>{user.roles[0]}</p>
                        )}
                        avatarProps={null}
                    />
                </div>
                <Divider className="my-4" />
                <nav className="flex flex-col items-start">
                    {
                        hasPermission('Ver todos documentos')? 
                        <>
                        <NavLink className="py-2 mb-3" href={route('documento.index')}
                        active={route().current('documento.index')}>
                            <div>
                                <i className="pi pi-check" style={{ fontSize: '1rem' }}></i>
                            </div>
                            <span className="text-medium">Documentos</span>
                        </NavLink>
                        </>:<></>
                    }{
                        hasPermission('Gestión de documentos')? 
                        <>
                        <NavLink href={route('documento.index')}
                        active={route().current('documento.index')} className="py-2 mb-3" >
                        <span className="text-medium">Gestion de documentos</span>
                        </NavLink>
                        </>:<></>
                    }{
                        hasPermission('Ver historial documento')? 
                        <>
                        <NavLink href={route('documento.index')}
                        active={route().current('documento.index')} className="py-2 mb-3">
                        <span className="text-medium">Historial de documentos</span>
                        </NavLink>
                        </>:<></>
                    }{
                        hasPermission('Ver historial documento anexo')? 
                        <>
                        <NavLink href={route('documento.index')}
                        active={route().current('documento.index')} className="py-2 mb-3">
                        <span className="text-medium">Historial de documentos anexos</span>
                        </NavLink>
                        </>:<></>
                    }{
                        hasPermission('Ver historial acción usuario')? 
                        <>
                        <NavLink href={route('documento.index')}
                        active={route().current('documento.index')} className="py-2 mb-3">
                        <span className="text-medium">Historial de accion usuario</span>
                        </NavLink>
                        </>:<></>
                    }{
                        hasPermission('Ver historial accion formulario')? 
                        <>
                        <NavLink href={route('documento.index')}
                        active={route().current('documento.index')} className="py-2 mb-3">
                        <span className="text-medium">Historial acción formulario</span>
                        </NavLink>
                        </>:<></>
                    }
                    
                </nav>
            </div>
        </>
    )
}