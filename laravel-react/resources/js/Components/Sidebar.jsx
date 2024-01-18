import React from "react";
import { Link } from '@inertiajs/react';
import NavLink from '@/Components/NavLink';
import {Divider} from "@nextui-org/react";
import { usePermission } from '@/Composables/Permission';


export const Sidebar = ({user, visible, onHide }) => {
    console.log(visible)
    const {hasRoles,hasPermission} = usePermission()
    return(
        <>
            <div className={`bg-slate-100 text-white h-full transition-all duration-300 ease-in-out ${visible ? 'w-64' : 'w-20'}`}>
                <div className="text-black">
                   Bienvenido {user.nombres} {user.apellidos} 
                </div>
                <Divider className="my-4" />
                <nav className="flex flex-col items-start">
                    {
                        hasPermission('Ver todos documentos')? 
                        <>
                        <NavLink className="py-4" href={route('documento.index')}
                        active={route().current('documento.index')}> 
                        <span className="text-lg">Documentos</span>
                        </NavLink>
                        </>:<></>
                    }{
                        hasPermission('Gestión de documentos')? 
                        <>
                        <NavLink href={route('documento.index')}
                        active={route().current('documento.index')} className="py-4" >
                        <span className="text-lg">Gestion de documentos</span>
                        </NavLink>
                        </>:<></>
                    }{
                        hasPermission('Ver historial documento')? 
                        <>
                        <NavLink href={route('documento.index')}
                        active={route().current('documento.index')} className="py-4">
                        <span className="text-lg">Historial de documentos</span>
                        </NavLink>
                        </>:<></>
                    }{
                        hasPermission('Ver historial documento anexo')? 
                        <>
                        <NavLink href={route('documento.index')}
                        active={route().current('documento.index')} className="py-4">
                        <span className="text-lg">Historial de documentos anexos</span>
                        </NavLink>
                        </>:<></>
                    }{
                        hasPermission('Ver historial acción usuario')? 
                        <>
                        <NavLink href={route('documento.index')}
                        active={route().current('documento.index')} className="py-4">
                        <span className="text-lg">Historial de accion usuario</span>
                        </NavLink>
                        </>:<></>
                    }{
                        hasPermission('Ver historial accion formulario')? 
                        <>
                        <NavLink href={route('documento.index')}
                        active={route().current('documento.index')} className="py-4">
                        <span className="text-lg">Historial acción formulario</span>
                        </NavLink>
                        </>:<></>
                    }
                    
                </nav>
            </div>
        </>
    )
}