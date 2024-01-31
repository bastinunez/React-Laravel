import React,{useRef} from "react";
import { Link } from '@inertiajs/react';
import NavLink from '@/Components/NavLink';
import {Divider,Accordion, AccordionItem} from "@nextui-org/react";
import { usePermission } from '@/Composables/Permission';
import { useSidebarStore } from '@/Store/useStore';
import {User} from "@nextui-org/react";
import Icon from '@mdi/react';
import { mdiFileMultiple, mdiFileDocument,mdiHistory,mdiAccountGroup} from '@mdi/js';


export const Sidebar = ({user}) => {
    //console.log(visible)
    const { sidebar,changeState} = useSidebarStore();
    const {hasRoles,hasPermission} = usePermission();

    return(
        <>
            <div className={`bg-slate-100 text-white fixed h-full transition-all p-3 duration-300 ease-in-out ${sidebar ? 'w-72' : 'w-16'}`}>
                <div className="text-black">
                    <User name={  <span className=" ps-3">{user.nombres}</span>} 
                        classNames={{name:`text-medium overflow-hidden whitespace-nowrap text-ellipsis ${sidebar ? '' : 'hidden'}`,description:`${sidebar ? '' : 'hidden'}`}}
                        description={(
                            <span className="text-medium overflow-hidden whitespace-nowrap text-ellipsis ps-3">{user.roles[0]}</span>
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
                            <span className={`overflow-hidden whitespace-nowrap text-ellipsis text-medium`}>Documentos</span>
                        </NavLink>
                        </>:<></>
                    }{
                        hasPermission('Gestion-Ver documentos')? 
                        <>
                        <NavLink href={route('gestion-documento.index')}
                        active={route().current('gestion-documento.index')} className="py-2 px-2 mb-3" >
                             <div className="me-3">
                                <Icon path={mdiFileMultiple} size={1} />
                            </div>
                            <span className={`overflow-hidden whitespace-nowrap text-ellipsis text-medium`}>Gestion de documentos</span>
                        </NavLink>
                        </>:<></>
                    }
                    {
                        hasPermission('Ver todos usuarios')? 
                        <>
                        <NavLink href={route('gestion-usuarios.index')}
                        active={route().current('gestion-usuarios.index')} className="py-2 px-2 mb-3" >
                             <div className="me-3">
                                <Icon path={mdiAccountGroup} size={1} />
                            </div>
                            <span className={`overflow-hidden whitespace-nowrap text-ellipsis text-medium`}>Gestion de usuarios</span>
                        </NavLink>
                        </>:<></>
                    }{
                        hasPermission('Gestion-Funcionarios')? 
                        <>
                        <NavLink href={route('funcionario.index')}
                        active={route().current('funcionario.index')} className="py-2 px-2 mb-3" >
                             <div className="me-3">
                                <Icon path={mdiAccountGroup} size={1} />
                            </div>
                            <span className={`overflow-hidden whitespace-nowrap text-ellipsis text-medium`}>Gestion de funcionarios</span>
                        </NavLink>
                        </>:<></>
                    }{
                        hasPermission('Gestion-Direcciones')? 
                        <>
                        <NavLink href={route('direccion.index')}
                        active={route().current('direccion.index')} className="py-2 px-2 mb-3" >
                             <div className="me-3">
                                <Icon path={mdiAccountGroup} size={1} />
                            </div>
                            <span className={`overflow-hidden whitespace-nowrap text-ellipsis text-medium`}>Gestion de direcciones</span>
                        </NavLink>
                        </>:<></>
                    }
                    {
                        hasPermission('Ver perfil')? 
                        <>
                        <NavLink href={route('usuario.index',user.id)}
                        active={route().current('usuario.index')} className="py-2 px-2 mb-3" >
                             <div className="me-3">
                                <Icon path={mdiFileMultiple} size={1} />
                            </div>
                            <span className={`overflow-hidden whitespace-nowrap text-ellipsis text-medium`}>Perfil</span>
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
                                <NavLink href={route('historial-documentos.index')}
                                active={route().current('historial-documentos.index')} className="py-2 px-2 mb-3">
                                    <div className="me-2">
                                    <Icon path={mdiHistory} size={1} />
                                    </div>
                                    <span className="text-medium">Documentos</span>
                                </NavLink>
                                </>:<></>
                            }{
                                hasPermission('Ver historial documento anexo')? 
                                <>
                                <NavLink href={route('historial-documentos-anexos.index')}
                                active={route().current('historial-documentos-anexos.index')} className="py-2 px-2 mb-3">
                                    <div className="me-2">
                                    <Icon path={mdiHistory} size={1} />
                                    </div>
                                    <span className="text-medium">Documentos anexos</span>
                                </NavLink>
                                </>:<></>
                            }{
                                hasPermission('Ver historial accion usuario')? 
                                <>
                                <NavLink href={route('historial-accion-usuario.index')}
                                active={route().current('historial-accion-usuario.index')} className="py-2 px-2 mb-3">
                                    <div className="me-2">
                                    <Icon path={mdiHistory} size={1} />
                                    </div>
                                    <span className="text-medium">Acción usuario</span>
                                </NavLink>
                                </>:<></>
                            }
                            {
                                hasPermission('Ver historial accion formulario')? 
                                <>
                                <NavLink href={route('historial-accion-formulario.index')}
                                active={route().current('historial-accion-formulario.index')} className="py-2 px-2 mb-3">
                                    <div className="me-2">
                                    <Icon path={mdiFileDocument} size={1} />
                                    </div>
                                    <span className="text-medium">Acción formulario</span>
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