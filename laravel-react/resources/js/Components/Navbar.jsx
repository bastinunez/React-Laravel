import React from "react";
import { useState } from 'react';
import {Navbar, NavbarBrand, NavbarContent, NavbarItem, Link, Button} from "@nextui-org/react";
import { Button as BtnPrime } from 'primereact/button';
import { useSidebarStore } from '@/Store/useStore';
import ResponsiveNavLink from '@/Components/ResponsiveNavLink';
import Icon from '@mdi/react';
import { mdiLogout,mdiMenu } from '@mdi/js';
import { useForm } from "@inertiajs/react";

export default function NavbarComponent() {
    const {post} = useForm()
    const {resetSidebar} = useSidebarStore()
    
    const setVariables = () => {
        resetSidebar()
        post(route('logout'))
    }
    const { sidebar,changeState} = useSidebarStore();
    return (
        <Navbar maxWidth="full" position="sticky" className="">
            <NavbarBrand>
                <Button onClick={() => changeState()} variant="ghost" isIconOnly className='align-middle border-indigo-500  bg-transparent text-indigo-500'>
                    <Icon path={mdiMenu}></Icon>
                </Button>
            </NavbarBrand>
            {/* <NavbarContent className="hidden sm:flex gap-4" justify="center">
                <NavbarItem>
                <Link color="foreground" href="#">
                    Features
                </Link>
                </NavbarItem>
                <NavbarItem isActive>
                <Link href="#" aria-current="page">
                    Customers
                </Link>
                </NavbarItem>
                <NavbarItem>
                <Link color="foreground" href="#">
                    Integrations
                </Link>
                </NavbarItem>
            </NavbarContent> */}
            <NavbarContent justify="end">
                <NavbarItem>
                    {/* <ResponsiveNavLink method="post" href={route('logout')} as="button"> */}
                    <Button onPress={()=>setVariables()} isIconOnly className="bg-indigo-500 text-white">
                            <Icon path={mdiLogout} size={1} />
                    </Button>
                    {/* <ResponsiveNavLink method="post" href={route('logout')} as="button">                 
                        <Icon path={mdiLogout} size={1} className="me-2" />
                        Salir
                    </ResponsiveNavLink> */}
                </NavbarItem>
            </NavbarContent>
        </Navbar>
  );
}