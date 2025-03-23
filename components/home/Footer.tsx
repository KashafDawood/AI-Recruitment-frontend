"use client";
import Image from "next/image";
import Link from "next/link";
import { menuItems } from "./header";

export default function FooterSection() {
  return (
    <footer className="py-12 md:py-16 border-t-2 border-gray-400">
      <div className="mx-auto max-w-5xl px-6">
        <Link href="/" aria-label="go home" className="mx-auto block size-fit">
          <Image src="/StaffeeLogo.svg" alt="Logo" width={25} height={25} />
        </Link>

        <div className="my-8 flex flex-wrap justify-center gap-6 text-sm">
          {menuItems.map((item, index) => (
            <Link
              key={index}
              href={item.href}
              className="text-muted-foreground hover:text-accent-foreground block duration-150"
            >
              <span>{item.name}</span>
            </Link>
          ))}
        </div>
        <span className="text-muted-foreground block text-center text-sm">
          {" "}
          © {new Date().getFullYear()} Staffee, All rights reserved
        </span>
      </div>
    </footer>
  );
}
