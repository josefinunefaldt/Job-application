import { createRootRoute, Link, Outlet } from "@tanstack/react-router";
export const Route = createRootRoute({
  component: () => (
    <>
      <div className=" index-text p-2 flex gap-2 bg-[#5f7470]">
        <Link className="text-[#F4E4BA] hover:text-[#FFCF56] " to="/">
          HOME
        </Link>
        <Link
          className=" hover:text-[#FFCF56]  index-text text-[#F4E4BA] "
          to="/jobs"
        >
          APPLICATIONS
        </Link>
        <Link
          className=" hover:text-[#FFCF56] index-text text-[#F4E4BA] "
          to="/jobs"
        >
          GUIDE
        </Link>
      </div>
      <Outlet />
    </>
  ),
});
