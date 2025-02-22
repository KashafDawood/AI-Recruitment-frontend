import Button from "@/components/Button";
import Image from 'next/image';
import { JSX } from "react";

export default function HeroSection(): JSX.Element {
  return (
    <div>
        <div className="flex flex-col justify-between items-center mx-4 mt-8 h-screen">
            <div className="flex flex-col justify-between items-center mt-8 h-[60vh]">
                <h1 className="font-bold text-4xl my-2">
                  Revolutionizing Recruitment with AI-Powered Solutions.
                </h1>
                <p>
                  Empowering businesses to hire top talent & helping job seekers find their perfect fit – all with AI-driven efficiency.
                </p>
                <div className="my-4 flex space-x-4">
                    <Button text="Post a Job" />
                    <Button text="Find a Job" />
                </div>
            </div>
            <div className="w-1/3 h-[40vh]">
                <img src="/home.png" alt="" />
            </div>
        </div>
        

    </div>
  );
}