import React,{useRef} from "react";
import { Link } from '@inertiajs/react';
import NavLink from '@/Components/NavLink';
import {Divider,Accordion, AccordionItem} from "@nextui-org/react";
import { usePermission } from '@/Composables/Permission';
import { useSidebarStore } from '@/Store/useStore';
import {User} from "@nextui-org/react";
import Icon from '@mdi/react';
import { mdiFileMultiple, mdiFileDocument,mdiHistory} from '@mdi/js';


export const Sidebar = ({user, visible, onHide }) => {
    //console.log(visible)
    const { sidebar,changeState} = useSidebarStore();
    const {hasRoles,hasPermission} = usePermission()
    const btnRef2 = useRef(null);



    return(
        <>
            <div className={`bg-slate-100 text-white fixed h-full transition-all p-3 duration-250 ease-in-out ${sidebar ? 'w-72' : 'w-16'}`}>
                <div className="text-black">
                    <User name={ <span className="text-medium ps-3">{user.nombres}</span>} 
                        description={(
                            <span className="text-medium ps-3">{user.roles[0]}</span>
                        )}
                        avatarProps={null}
                    />
                </div>
                <Divider className="my-4" />
                <nav className="flex flex-col items-start text-gray-500 ">
                    {
                        hasPermission('Ver todos documentos')? 
                        <>
                        <NavLink className="py-2 px-2 mb-3" href={route('documento.index')}
                        active={route().current('documento.index')}>
                            <div className="me-3">
                                <Icon path={mdiFileDocument} size={1} />
                            </div>
                            <span className="text-medium">Documentos</span>
                        </NavLink>
                        </>:<></>
                    }{
                        hasPermission('Gestion-Ver documentos')? 
                        <>
                        <NavLink href={route('documento.gestion_index')}
                        active={route().current('documento.gestion_index')} className="py-2 px-2 mb-3" >
                             <div className="me-3">
                                <Icon path={mdiFileMultiple} size={1} />
                            </div>
                            <span className="text-medium">Gestion de documentos</span>
                        </NavLink>
                        </>:<></>
                    }
                    {
                        hasPermission('Ver todos usuarios')? 
                        <>
                        <NavLink href={route('usuario.gestion.index')}
                        active={route().current('usuario.gestion.index')} className="py-2 px-2 mb-3" >
                             <div className="me-3">
                                <Icon path={mdiFileMultiple} size={1} />
                            </div>
                            <span className="text-medium">Gestion de usuarios</span>
                        </NavLink>
                        </>:<></>
                    }{
                        hasPermission('Ver perfil')? 
                        <>
                        <NavLink href={route('usuario.index',user.id)}
                        active={route().current('usuario.index')} className="py-2 px-2 mb-3" >
                             <div className="me-3">
                                <Icon path={mdiFileMultiple} size={1} />
                            </div>
                            <span className="text-medium">Perfil</span>
                        </NavLink>
                        </>:<></>
                    }
                    <Accordion itemClasses={{title:"text-gray-500"}}
                    motionProps={{ variants: {
                            enter: {
                                y: 0,
                                opacity: 1,
                                height: "auto",
                                transition: {
                                height: {
                                    type: "spring",
                                    stiffness: 500,
                                    damping: 30,
                                    duration: 1,
                                },
                                opacity: {
                                    easings: "ease",
                                    duration: 1,
                                },
                                },
                            },
                            exit: {
                                y: -10,
                                opacity: 0,
                                height: 0,
                                transition: {
                                height: {
                                    easings: "ease",
                                    duration: 0.25,
                                },
                                opacity: {
                                    easings: "ease",
                                    duration: 0.3,
                                },
                                },
                            },
                            },
                        }}>
                        <AccordionItem key="1" aria-label="Accordion 1" title="Historial" className="text-gray-500" 
                        startContent={<Icon path={mdiHistory} size={1} />} style={{ overflow: 'hidden', transition: 'width 0.3s'}}>
                            {
                                hasPermission('Ver historial documento')? 
                                <>
                                <NavLink href={route('documento.index')}
                                active={route().current('documento.index')} className=" px-2 mb-3">
                                    <div className="me-2">
                                    <Icon path={mdiHistory} size={1} />
                                    </div>
                                    <span className="text-medium">Historial de documentos</span>
                                </NavLink>
                                </>:<></>
                            }{
                                hasPermission('Ver historial documento anexo')? 
                                <>
                                <NavLink href={route('documento.index')}
                                active={route().current('documento.index')} className="py-2 px-2 mb-3">
                                    <div className="me-2">
                                    <Icon path={mdiHistory} size={1} />
                                    </div>
                                    <span className="text-medium">Historial de documentos anexos</span>
                                </NavLink>
                                </>:<></>
                            }{
                                hasPermission('Ver historial acción usuario')? 
                                <>
                                <NavLink href={route('documento.index')}
                                active={route().current('documento.index')} className="py-2 px-2 mb-3">
                                    <div className="me-2">
                                    <Icon path={mdiHistory} size={1} />
                                    </div>
                                    <span className="text-medium">Historial de accion usuario</span>
                                </NavLink>
                                </>:<></>
                            }
                            {
                                hasPermission('Ver historial accion formulario')? 
                                <>
                                <NavLink href={route('documento.index')}
                                active={route().current('documento.index')} className="py-2 px-2 mb-3">
                                    <div className="me-2">
                                    <Icon path={mdiFileDocument} size={1} />
                                    </div>
                                    <span className="text-medium">Historial acción formulario</span>
                                </NavLink>
                                </>:<></>
                            } 
                        </AccordionItem>
                    </Accordion>
                    
                </nav>
            </div>
        </>
    )
}