import React from 'react';
import { Sprout, Bell, Globe } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { UserButton, SignedIn } from "@clerk/clerk-react";
import { Button } from './ui/button';

const Header = () => {
    const { t, i18n } = useTranslation();

    const changeLanguage = (e) => {
        i18n.changeLanguage(e.target.value);
    };

    return (
        <header className="sticky top-0 z-50 w-full border-b glass">
            <div className="container flex h-16 items-center justify-between">
                <div className="flex items-center gap-2 font-bold tracking-tight text-xl">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm">
                        <Sprout className="h-5 w-5" />
                    </div>
                    <span className="text-foreground">Krishi<span className="text-primary">AI</span></span>
                </div>

                <div className="flex items-center gap-2 md:gap-4">
                    {/* Language Selector */}
                    <div className="relative flex items-center bg-secondary/50 rounded-full px-3 py-1.5 border border-border/50">
                        <Globe className="h-4 w-4 text-muted-foreground mr-2" />
                        <select
                            onChange={changeLanguage}
                            value={i18n.language}
                            className="bg-transparent border-none text-sm font-medium focus:ring-0 cursor-pointer text-foreground appearance-none pr-4 outline-none"
                            style={{ backgroundImage: 'none' }} // Hide default arrow if possible or keep minimal
                        >
                            <option value="en">English</option>
                            <option value="hi">हिंदी</option>
                            <option value="kn">ಕನ್ನಡ</option>
                            <option value="ta">தமிழ்</option>
                            <option value="te">తెలుగు</option>
                            <option value="ml">മലയാളം</option>
                        </select>
                    </div>

                    <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary transition-colors">
                        <Bell className="h-5 w-5" />
                    </Button>

                    <SignedIn>
                        <UserButton afterSignOutUrl="/sign-in" appearance={{
                            elements: {
                                avatarBox: "h-9 w-9 ring-2 ring-primary/20 hover:ring-primary/50 transition-all"
                            }
                        }} />
                    </SignedIn>
                </div>
            </div>
        </header>
    );
};

export default Header;
