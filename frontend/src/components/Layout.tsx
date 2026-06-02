import { Link, Outlet } from "react-router-dom";

function Layout() {
  return (
    <>
      <header>
        <Link to="/">Devotional App</Link>
      </header>

      <Outlet />
    </>
  );
}

export default Layout;