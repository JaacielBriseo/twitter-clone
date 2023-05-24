import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";

export const Sidebar = () => {
  const session = useSession();
  const user = session.data?.user;
  console.log({ user });
  return (
    <aside className="sticky top-0 px-2 py-2">
      <ul className="flex flex-col items-start gap-2 whitespace-nowrap">
        <li>
          <Link href="/">Home</Link>
        </li>
        {user && (
          <li>
            <Link href={"/profiles/asdf"}>Profile</Link>
          </li>
        )}
        {!user ? (
          <li>
            <button onClick={() => void signIn()}>Log In</button>
          </li>
        ) : (
          <li>
            <button onClick={() => void signOut()}>Log Out</button>
          </li>
        )}
      </ul>
    </aside>
  );
};