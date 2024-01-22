import React from "react";
import { useState } from 'react';
import {Navbar, NavbarBrand, NavbarContent, NavbarItem, Link, Button} from "@nextui-org/react";
import { Button as BtnPrime } from 'primereact/button';
import { useSidebarStore } from '@/Store/useStore';
import ResponsiveNavLink from '@/Components/ResponsiveNavLink';
import Icon from '@mdi/react';
import { mdiLogout } from '@mdi/js';

export default function NavbarComponent() {
    const menuItems = [
        "Profile",
        "Dashboard",
        "Activity",
        "Analytics",
        "System",
        "Deployments",
        "My Settings",
        "Team Settings",
        "Help & Feedback",
        "Log Out",
      ];
    const { sidebar,changeState} = useSidebarStore();
    return (
        <Navbar maxWidth="full" position="sticky">
            <NavbarBrand>
                    <BtnPrime onClick={() => changeState()} className='align-middle'>
                        <i className="pi pi-bars" ></i>
                    </BtnPrime>
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
                    <ResponsiveNavLink method="post" href={route('logout')} as="button">
                        <Icon path={mdiLogout} size={1} className="me-2" />
                        Salir
                    </ResponsiveNavLink>
                </NavbarItem>
            </NavbarContent>
        </Navbar>
  );
}