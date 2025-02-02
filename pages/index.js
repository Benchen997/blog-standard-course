import Link from "next/link";
import { useUser } from "@auth0/nextjs-auth0";

export default function Home() {
  const { user } = useUser();
  return (
    <div>
      <h1>Home Page</h1>
      <p>Content goes here</p>
      <div>
        <Link href="/api/auth/login"> Login </Link>
      </div>
    </div>
  )
}
