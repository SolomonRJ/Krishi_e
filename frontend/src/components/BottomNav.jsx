import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, ScanLine, Sprout, Droplets } from 'lucide-react';
import { cn } from '../lib/utils'; // Assuming I'll make a utils file, but I can just use inline logic for now. Or standard template literals.

const BottomNav = () => {
    const navItems = [
        { path: '/', icon: Home, label: 'Home' },
        { path: '/disease', icon: ScanLine, label: 'Disease' },
        { path: '/crop', icon: Sprout, label: 'Crop' },
        { path: '/fertilizer', icon: Droplets, label: 'Fertilizer' },
    ];

    return (
        <nav className="fixed bottom-0 left-0 right-0 z-50 flex h-16 items-center justify-around border-t bg-background">
            {navItems.map(({ path, icon: Icon, label }) => (
                <NavLink
                    key={path}
                    to={path}
                    className={({ isActive }) => `flex flex-col items-center justify-center gap-1 transition-colors ${isActive ? 'text-primary font-medium' : 'text-muted-foreground hover:text-foreground'}`}
                >
                    {({ isActive }) => (
                        <>
                            <Icon className={`h-6 w-6 ${isActive ? 'fill-current' : ''}`} strokeWidth={1.5} />
                            <span className="text-[10px] uppercase tracking-wider">{label}</span>
                        </>
                    )}
                </NavLink>
            ))}
        </nav>
    );
};

export default BottomNav;
