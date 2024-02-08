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
                <Button onClick={() => changeState()} isIconOnly className='align-middle border-indigo-900  bg-transparent text-indigo-900'>
                    <Icon path={mdiMenu}></Icon>
                </Button>
            </NavbarBrand>
            <NavbarContent justify="end">
                <NavbarItem>
                    <Button onPress={()=>setVariables()} isIconOnly className="bg-indigo-900 text-white">
                            <Icon path={mdiLogout} size={1} />
                    </Button>
                </NavbarItem>
            </NavbarContent>
        </Navbar>
  );
}