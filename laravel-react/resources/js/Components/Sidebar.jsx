import React,{useEffect, useRef, useState} from "react";
import { Link } from '@inertiajs/react';
import NavLink from '@/Components/NavLink';
import {Divider,Accordion, AccordionItem,Tooltip} from "@nextui-org/react";
import { usePermission } from '@/Composables/Permission';
import { useSidebarStore,useAccordionStore } from '@/Store/useStore';
import {User} from "@nextui-org/react";
import Icon from '@mdi/react';
import { mdiFileMultiple,mdiAccountCircleOutline, mdiFileDocument,mdiShieldAccountVariantOutline,mdiAccountSettingsOutline,mdiHistory,mdiWrenchCogOutline,mdiAccountGroup,mdiBadgeAccount,mdiOfficeBuildingOutline} from '@mdi/js';


export const Sidebar = ({user}) => {
    //console.log(visible)
    const { sidebar,changeState} = useSidebarStore();
    const { accordion, changeStateAccordion, resetAccordion} = useAccordionStore();
    const {hasRoles,hasPermission} = usePermission();
    const [selectedKeys, setSelectedKeys] = useState(new Set([accordion]));
    useEffect(()=>{
        changeStateAccordion(Array.from(selectedKeys)[0])
    },[selectedKeys])
    return(
        <>
            <div className={`bg-indigo-900 text-white fixed h-full transition-all p-3 duration-300 ease-in-out ${sidebar ? 'w-72' : 'w-16'}`}>
                <div className="text-white">
                    <User name={  <span className=" ps-3">{user.nombres}</span>} 
                        classNames={{name:`text-medium overflow-hidden whitespace-nowrap text-ellipsis ${sidebar ? '' : 'hidden'}`,description:`${sidebar ? '' : 'hidden'}`}}
                        description={(
                            <span className="text-medium overflow-hidden whitespace-nowrap text-ellipsis ps-3">{user.roles[0]}</span>
                        )}
                        avatarProps={null}
                    />
                </div>
                <Divider className="mt-2 mb-1 bg-white" />
                <nav className="flex flex-col items-start text-gray-500 ">
                    {
                        hasPermission('Ver perfil')? 
                        <>
                        <NavLink href={route('usuario.index',user.id)} tooltip={"Perfil"}
                        active={route().current('usuario.index')} className="py-2 px-2 my-1" >
                             <div className="me-3">
                                <Icon path={mdiAccountCircleOutline} size={1} />
                            </div>
                            <span className={`overflow-hidden whitespace-nowrap text-ellipsis text-medium`}>Perfil</span>
                        </NavLink>
                        </>:<></>
                    }
                    <Divider className="my-1 bg-white" />
                    {
                        hasPermission('Ver todos documentos')? 
                        <>
                        <NavLink className="py-2 px-2 my-1" href={route('documento.index')} tooltip={"Documentos"}
                        active={route().current('documento.index')}>
                            <div className="me-3">
                                <Icon path={mdiFileDocument} size={1} />
                            </div>
                            <span className={`overflow-hidden whitespace-nowrap text-ellipsis text-medium`}>Documentos</span>
                        </NavLink>
                        </>:<></>
                    }
                    <Divider className="my-2 bg-white" />
                    {
                        hasPermission('Gestion-Ver documentos')? 
                        <>
                        <NavLink href={route('gestion-documento.index')} tooltip={"Gestion de documentos"}
                        active={route().current('gestion-documento.index')} className="py-2 px-2 my-1" >
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
                        <NavLink href={route('gestion-usuarios.index')} tooltip={"Gestion de usuarios"}
                        active={route().current('gestion-usuarios.index')} className="py-2 px-2 my-1" >
                             <div className="me-3">
                                <Icon path={mdiAccountGroup} size={1} />
                            </div>
                            <span className={`overflow-hidden whitespace-nowrap text-ellipsis text-medium`}>Gestion de usuarios</span>
                        </NavLink>
                        </>:<></>
                    }{
                        hasPermission('Gestion-Funcionarios')? 
                        <>
                        <NavLink href={route('funcionario.index')} tooltip={"Gestion de funcionarios"}
                        active={route().current('funcionario.index')} className="py-2 px-2 my-1" >
                             <div className="me-3">
                                <Icon path={mdiBadgeAccount} size={1} />
                            </div>
                            <span className={`overflow-hidden whitespace-nowrap text-ellipsis text-medium`}>Gestion de funcionarios</span>
                        </NavLink>
                        </>:<></>
                    }{
                        hasPermission('Gestion-Direcciones')? 
                        <>
                        <NavLink href={route('direccion.index')} tooltip={"Gestion de direcciones"}
                        active={route().current('direccion.index')} className="py-2 px-2 my-1" >
                             <div className="me-3">
                                <Icon path={mdiOfficeBuildingOutline} size={1} />
                            </div>
                            <span className={`overflow-hidden whitespace-nowrap text-ellipsis text-medium`}>Gestion de direcciones</span>
                        </NavLink>
                        </>:<></>
                    }
                    <Divider className="my-2 bg-white" />
                    {
                        hasPermission('Gestion-Roles')?
                        <>
                             <NavLink href={route('rol.index')} tooltip={"Roles"}
                            active={route().current('rol.index')} className="py-2 px-2 my-1" >
                                <div className="me-3">
                                    <Icon path={mdiAccountSettingsOutline} size={1} />
                                </div>
                                <span className={`overflow-hidden whitespace-nowrap text-ellipsis text-medium`}>Roles</span>
                            </NavLink>
                        </>
                        :<></>
                    }
                    {
                        hasPermission('Gestion-Permisos')? 
                        <>
                            <NavLink href={route('permiso.index')} tooltip={"Permisos"}
                            active={route().current('permiso.index')} className="py-2 px-2 my-1" >
                                <div className="me-3">
                                    <Icon path={mdiShieldAccountVariantOutline} size={1} />
                                </div>
                                <span className={`overflow-hidden whitespace-nowrap text-ellipsis text-medium`}>Permisos</span>
                            </NavLink>
                        </>
                        :<></>
                    }
                    <Divider className="my-2 bg-white" />
                    
                    {
                        hasPermission('Ver historial documento') || hasPermission('Ver historial documento anexo') || 
                        hasPermission('Ver historial accion usuario') || hasPermission('Ver historial accion formulario')?
                        <>  
                            <Accordion itemClasses={{title:"text-white py-0"}} //defaultExpandedKeys={0}
                            selectedKeys={selectedKeys} onSelectionChange={setSelectedKeys}
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
                            <AccordionItem key={1} aria-label="Accordion 1" title="Historial" isCompact={true}
                            className="text-white rounded-md"
                                startContent={<Icon path={mdiHistory} size={1} />} style={{ overflow: 'hidden', transition: 'width 0.3s'}}>
                                    {
                                        hasPermission('Ver historial documento')? 
                                        <>
                                        <NavLink href={route('historial-documentos.index')} tooltip={"Documentos"}
                                        active={route().current('historial-documentos.index')} className="py-2 px-2 mb-3">
                                            <div className="me-2">
                                            <Icon path={mdiHistory} size={1} />
                                            </div>
                                            <span className={`overflow-hidden whitespace-nowrap text-ellipsis text-medium`}>Documentos</span>
                                        </NavLink>
                                        </>:<></>
                                    }{
                                        hasPermission('Ver historial documento anexo')? 
                                        <>
                                        <NavLink href={route('historial-documentos-anexos.index')} tooltip={"Documentos anexos"}
                                        active={route().current('historial-documentos-anexos.index')} className="py-2 px-2 mb-3">
                                            <div className="me-2">
                                            <Icon path={mdiHistory} size={1} />
                                            </div>
                                            <span className={`overflow-hidden whitespace-nowrap text-ellipsis text-medium`}>Documentos anexos</span>
                                        </NavLink>
                                        </>:<></>
                                    }{
                                        hasPermission('Ver historial accion usuario')? 
                                        <>
                                        <NavLink href={route('historial-accion-usuario.index')} tooltip={"Acción sobre usuario"}
                                        active={route().current('historial-accion-usuario.index')} className="py-2 px-2 mb-3">
                                            <div className="me-2">
                                            <Icon path={mdiHistory} size={1} />
                                            </div>
                                            <span className={`overflow-hidden whitespace-nowrap text-ellipsis text-medium`}>Acción sobre usuario</span>
                                        </NavLink>
                                        </>:<></>
                                    }
                                    {
                                        hasPermission('Ver historial accion formulario')? 
                                        <>
                                        <NavLink href={route('historial-accion-formulario.index')} tooltip={"Acción sobre formulario"}
                                        active={route().current('historial-accion-formulario.index')} className="py-2 px-2 mb-3">
                                            <div className="me-2">
                                            <Icon path={mdiFileDocument} size={1} />
                                            </div>
                                            <span className={`overflow-hidden whitespace-nowrap text-ellipsis text-medium`}>Acción sobre formulario</span>
                                        </NavLink>
                                        </>:<></>
                                    } 
                                </AccordionItem>
                            </Accordion>
                        </>
                        :<></>
                    }
                    
                </nav>
            </div>
        </>
    )
}