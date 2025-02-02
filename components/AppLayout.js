import Image from "next/image";
import Link from "next/link";
import {useUser} from "@auth0/nextjs-auth0/client";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCoins} from "@fortawesome/free-solid-svg-icons";
import { Logo } from "./Logo";

export const AppLayout = ({ children }) =>{
    const { user } = useUser();

    return (
        <main className={"grid grid-cols-[320px_1fr] h-screen max-h-screen"}>
            <section className={"flex flex-col text-white overflow-hidden"}>
                {/* first section */}
                <header className={"bg-slate-800 px-2"}>
                    <Logo/>
                    <Link href={"/post/new"} className={"btn"}>
                        New Post
                    </Link>
                    <Link href={"/token-topup"} className={"block mt-2 text-center"}>
                        <FontAwesomeIcon icon={faCoins} className={"text-yellow-500"} />
                        <span className={"pl-1"}>0 tokens available</span>
                    </Link>
                </header>

                {/* second section */}
                <ul className={"flex-1 overflow-auto bg-gradient-to-b " +
                    "from-slate-800 to-cyan-800"}>
                    list of posts:
                    {
                        // render list of 100 posts
                        Array.from({length: 100}, (_, i) => (
                            <li key={i} className={"p-2 border-b border-slate-700"}>
                                <div>post title {i}</div>
                                <div>post author</div>
                            </li>
                        ))
                    }

                </ul>

                {/* third section */}
                <footer className={"bg-cyan-800 flex items-center gap-2 border-t border-t-black/50" +
                    "h-20 p-2"}>
                        {
                            !!user ? (
                                <>
                                    <div className={"min-w-[50px]"}>
                                        <Image
                                            src={user.picture}
                                            alt={user.name}
                                            width={50}
                                            height={50}
                                            className={"rounded-full"}
                                        />
                                    </div>

                                    <div className={"flex-1"}>
                                        <div className={"font-bold text-sm"}>{user.email}</div>
                                        <Link className={"text-sm hover:text-blue-200 hover:text-2xl"} href={`/api/auth/logout`}>Logout</Link>
                                    </div>
                                </>
                            ) : (
                                <Link href="/api/auth/login">Login</Link>
                            )
                        }
                </footer>
            </section>

            <section>{children}</section>
        </main>
    );
};