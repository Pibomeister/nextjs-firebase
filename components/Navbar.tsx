import Link from 'next/link';
import { useContext } from 'react';
import { UserContext } from '../lib/context';

export default function Navbar() {
  const { user, username } = useContext(UserContext);

  return (
    <nav className="navbar">
      <ul>
        <li>
          <Link href="/">
            <a>
              <button className="btn-logo">FEED</button>
            </a>
          </Link>
        </li>

        {/* user is signed-in and has username */}
        {username && (
          <>
            <li className="push-left">
              <Link href="/admin">
                <a>
                  <button className="btn-blue">Write Posts</button>
                </a>
              </Link>
            </li>
            <li>
              <Link href={`/${username}`}>
                <a>
                  <img src={user?.photoURL} />
                </a>
              </Link>
            </li>
          </>
        )}

        {/* user is not signed OR has not created username */}
        {!username && (
          <li>
            <Link href="/enter">
              <a>
                <button className="btn-blue">Log in</button>
              </a>
            </Link>
          </li>
        )}
      </ul>
    </nav>
  );
}
