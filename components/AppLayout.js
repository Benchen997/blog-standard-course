import Image from "next/image";
import Link from "next/link";
import {useUser} from "@auth0/nextjs-auth0/client";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCoins} from "@fortawesome/free-solid-svg-icons";
import { Logo } from "./Logo";

export const AppLayout = ({ children, availableTokens, posts, postId }) =>{
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
                        <span className={"pl-1"}>{availableTokens} tokens available</span>
                    </Link>
                </header>

                {/* second section */}
                <ul className={"px-4 flex-1 overflow-auto bg-gradient-to-b from-slate-800 to-cyan-800"}>
                    {!posts ? (
                        <li className={"text-center p-4"}>No posts yet</li>
                    ) : (
                        posts.map((post) => (
                            <Link
                                className={`list-none py-1 border border-white/0 block text-ellipsis overflow-hidden whitespace-nowrap my-1 px-2 bg-white/10 cursor-pointer rounded-md ${post._id === postId ? "bg-white/20 border-white" : ""}`}
                                key={post._id}
                                href={`/post/${post._id}`}
                            >
                                {post.topic}
                            </Link>
                        ))
                    )}
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
            {/* render children outside the container because
            it will be rendered on the right side of the screen,
            and it will be scrollable independently without affecting left side
              */}
            {children}
        </main>
    );
};