import { Link, Outlet } from "react-router-dom";

import type { AuthUser } from "../api/auth";

type Props = {
  user: AuthUser | null;
  onLogout: () => void;
};

function Layout({ user, onLogout }: Props) {
  return (
    <>
      <header>
        <Link to="/">Devotional App</Link>

        <div className="header-user">
          {user ? (
            <>
              <span>{user.email}</span>

              <button
                type="button"
                className="header-auth-button"
                onClick={onLogout}
              >
                Sign out
              </button>
            </>
          ) : (
            <Link className="header-auth-link" to="/auth">
              Sign in
            </Link>
          )}
        </div>
      </header>

      <Outlet />
    </>
  );
}

export default Layout;