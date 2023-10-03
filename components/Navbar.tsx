import React from "react";
import Image from "next/image";
import Link from "next/link";

const Navbar = () => {
  const navIcons = [
    { src: "./assets/icons/search.svg", alt: "search" },
    { src: "./assets/icons/black-heart.svg", alt: "search" },
    { src: "./assets/icons/user.svg", alt: "search" },
  ];
  return (
    <header className="w-full">
      <nav className="nav">
        <Link href="/" className="flex items-center gap-1">
          <Image
            src="/assets/icons/logo.svg"
            width={24}
            height={24}
            alt="Home"
          />

          <p className="nav-logo">
            {" "}
            Jumia<span className="text-primary">Scrapper</span>{" "}
          </p>
        </Link>

        <div className="flex items-center gap-5">
          {navIcons.map((icon) => (
            <Image
              key={icon.alt}
              src={icon.src}
              alt={icon.alt}
              width={28}
              height={28}
              className="object-contain"
            />
          ))}
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
