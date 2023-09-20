"use client"

import { useState } from 'react';
import { Group, Code } from '@mantine/core';
import {
    IconCategory,
    IconUserCircle,
    IconHeadphones,
    IconAdjustmentsHorizontal,
    IconHelp,
} from '@tabler/icons-react';

import { ThemeToggle } from './themeToggle';
import Link from 'next/link';

const data = [
    { link: '/explore', label: 'Explore', icon: IconCategory },
    { link: '/profile', label: 'My Profile', icon: IconUserCircle },
    { link: '/sounds', label: 'My Sounds', icon: IconHeadphones }, // todo: use figma svg
    { link: '/create', label: 'Music Maker', icon: IconAdjustmentsHorizontal },
    { link: '/help', label: 'Help', icon: IconHelp },
];

export function SideNav() {
    const [active, setActive] = useState('Explore');

    const links = data.map((item) => (
        <Link
            className="flex my-3"
            href={item.link}
            key={item.label}
        >
            <item.icon className='my-auto' stroke={1.5} />
            <span className='my-auto mx-3'>{item.label}</span>
        </Link>
    ));

    return (
        <nav className="w-max border-r-2">
            <div className='flex flex-col justify-between p-5 h-screen'>
                <div className='flex flex-col gap-5'>
                    <Group justify="space-between">
                        <Link href='/'>
                            <div>
                                Logo goes here
                            </div>
                        </Link>
                    </Group>
                    {links}
                </div>

                <div>
                    <a href="#" className="flex gap-5" onClick={(event) => event.preventDefault()}>
                        <span><ThemeToggle /> </span>
                        <span className='my-auto'></span>
                    </a>

                    {/* <a href="#" className='flex gap-2'  onClick={(event) => event.preventDefault()}>
                        <span><IconLogout size="0px" stroke={1.5} /></span>
                        <span>Logout</span>
                    </a> */}
                </div>

            </div>
        </nav>
    );
}