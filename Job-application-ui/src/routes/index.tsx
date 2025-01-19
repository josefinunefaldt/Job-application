import { useState, useEffect } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { CreateUser } from "../../utils/createuser";
import { GetUser } from "../../utils/fetchuser";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
  useUser,
} from "@clerk/clerk-react";
import { components } from "../lib/api/v1";

export const Route = createFileRoute("/")({
  component: RouteComponent,
});

type postUser = components["schemas"]["User"];

function RouteComponent() {
  const { user, isSignedIn } = useUser();
  const [previouslySignedIn, setPreviouslySignedIn] = useState<boolean | null>(
    null
  );

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
          localStorage.setItem("userFullName", user!.fullName!);
        } catch (error) {
          console.error("Error initializing user:", error);
        }
      };

      initializeUser();
    }
  }, [isSignedIn, user]);

  useEffect(() => {
    if (previouslySignedIn === true && !isSignedIn) {
      localStorage.removeItem("userFullName");
    }
    setPreviouslySignedIn(isSignedIn ?? false);
  }, [isSignedIn, previouslySignedIn]);

  return (
    <>
      <header className="">
        <SignedOut>
          <SignInButton />
        </SignedOut>
        <SignedIn>
          <UserButton />
        </SignedIn>
      </header>
    </>
  );
}
