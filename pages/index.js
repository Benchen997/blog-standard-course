import HeroImage from '../public/hero.webp';
import Image from "next/image";
import {Logo} from "../components/Logo";
import Link from "next/link";


export default function Home() {
  return (
    <div className={"w-screen h-screen overflow-hidden flex justify-around items-center relative"}>
        <Image src={HeroImage} alt={"hero"} layout={"fill"} objectFit={"cover"} className={"absolute"} />
        <div className={"relative z-10 text-white px-10 py-5 text-center max-w-screen-sm " +
            "bg-slate-900/90 rounded-md backdrop-blur-0"}>
            <Logo/>
            <p className={"p-2"}>
                The AI-powered platform for creating and sharing posts in minutes. Get high-quality content,
                without sacrificing your time.
            </p>
            <Link href={"/post/new"} className={"btn"}>
                Begin!
            </Link>
        </div>
    </div>
  )
}
