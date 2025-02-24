import { Button } from "../ui/button";
import Image from "next/image";
import { JSX } from "react";

export default function HeroSection(): JSX.Element {
  return (
    <div>
      <div className="flex flex-col justify-between items-center mx-4 mt-8">
        <div className="flex flex-col justify-between items-center mt-8">
          <h1 className="font-bold text-4xl my-2">
            Revolutionizing Recruitment with AI-Powered Solutions.
          </h1>
          <p>
            Empowering businesses to hire top talent & helping job seekers find
            their perfect fit – all with AI-driven efficiency.
          </p>
          <div className="my-4 flex space-x-4">
            <Button>Post a Job</Button>
            <Button>Find a Job</Button>
          </div>
        </div>
        <div className="w-1/3">
          <Image src="/home.png" alt="" width={500} height={500} />
        </div>
      </div>
    </div>
  );
}
