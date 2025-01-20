import { createRootRoute, Link, Outlet } from "@tanstack/react-router";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
  useUser,
} from "@clerk/clerk-react";
import { useEffect, useState } from "react";
import { CreateUser } from "../../utils/createuser";
import { GetUser } from "../../utils/fetchuser";
import { components } from "../lib/api/v1";

type postUser = components["schemas"]["User"];

export const Route = createRootRoute({
  component: RouteComponent,
});

function RouteComponent() {
  const { user, isSignedIn } = useUser();
  const [previouslySignedIn, setPreviouslySignedIn] = useState<boolean | null>(
    null
  );

  useEffect(() => {
    if (previouslySignedIn === true && !isSignedIn) {
      localStorage.removeItem("userFullName");
    }
    setPreviouslySignedIn(isSignedIn ?? false);
  }, [isSignedIn, previouslySignedIn]);

  useEffect(() => {
    if (isSignedIn && user) {
      const initializeUser = async () => {
        try {
          const existingUser = await GetUser(user.fullName!);

          if (existingUser?.data) {
            console.log("User exists:", existingUser.data);
          } else {
            const userName: postUser = {
              name: user.fullName!,
            };
            await CreateUser(userName);
          }
          localStorage.setItem("userFullName", user.fullName!);
        } catch (error) {
          console.error("Error initializing user:", error);
        }
      };

      initializeUser();
    }
  }, [isSignedIn, user]);
  return (
    <>
      <div className="index-text p-2  flex justify-between items-center bg-[#5f7470]">
        <div className="flex gap-2">
          <Link className="text-[#F4E4BA] hover:text-[#FFCF56]" to="/">
            HOME
          </Link>
          <Link
            className="hover:text-[#FFCF56] index-text text-[#F4E4BA] transition-all duration-200 ease-in-out"
            to="/jobs"
          >
            APPLICATIONS
          </Link>
          <Link
            className="hover:text-[#FFCF56] index-text text-[#F4E4BA] transition-all duration-200 ease-in-out"
            to="/guide"
          >
            GUIDE
          </Link>
        </div>

        <div className="flex items-center mr-3">
          <SignedOut>
            <SignInButton>
              <button className="hover:text-[#FFCF56] index-text text-[#F4E4BA]">
                Sign in
              </button>
            </SignInButton>
          </SignedOut>
          <SignedIn>
            <UserButton />
          </SignedIn>
        </div>
      </div>
      <Outlet />
    </>
  );
}
