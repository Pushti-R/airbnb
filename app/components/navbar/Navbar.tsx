"use client"

import Container from "../Container"
import { ThemeSwitcher } from "../toggle"
import Categories from "./Categories"
import Logo from "./Logo"
import Search from "./Search"
import UserMenu from "./UserMenu"
import { SafeUser } from "@/app/types"

interface NavbarProps {
    currentUser?: SafeUser | null;
}

const Navbar: React.FC<NavbarProps> = ({
    currentUser
}) => {
    return (
        <div className="fixed w-full bg-white z-10 shadow-sm dark:bg-[#0d1117]">
            <div className="py-4 border-b-[1px]">
                <Container>
                    <div className="flex flex-row items-center justify-between gap-3 md:gap-0">
                        <Logo />
                        <Search />
                        <div className="flex">
                        <ThemeSwitcher />
                        <UserMenu user={currentUser} />
                        </div>
                    </div>
                </Container>
            </div>
            <Categories />
        </div>
    )
}

export default Navbar