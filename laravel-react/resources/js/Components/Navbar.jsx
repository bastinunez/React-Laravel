import React from "react";
import { useState } from 'react';
import {Navbar, NavbarBrand, NavbarContent, NavbarItem, Link, Button} from "@nextui-org/react";
import { Button as BtnPrime } from 'primereact/button';
import { useSidebarStore } from '@/Store/useStore';
import ResponsiveNavLink from '@/Components/ResponsiveNavLink';

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
        <Navbar maxWidth="full">
            <NavbarBrand>
                    <BtnPrime onClick={() => changeState()} className='align-middle'>
                        <i className="pi pi-bars" style={{ color: 'slateblue' }}></i>
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
                                        Log Out
                    </ResponsiveNavLink>
                </NavbarItem>
            </NavbarContent>
        </Navbar>
  );
}