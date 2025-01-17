import { createFileRoute } from "@tanstack/react-router";
import { Jobs } from "../components/Jobs";
import { useState, useEffect } from "react";
import ModalForm from "../components/ModalForm";
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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { user, isSignedIn } = useUser();
  const [isUserCreated, setIsUserCreated] = useState(false);

  useEffect(() => {
    if (isSignedIn && user) {
      const initializeUser = async () => {
        try {
          // Check if the user exists in the database using GetUser
          const existingUser = await GetUser(user.fullName!);

          if (existingUser?.data) {
            console.log("User exists:", existingUser.data);
            setIsUserCreated(true);
          } else {
            const userName: postUser = {
              name: user.fullName!,
            };
            await CreateUser(userName);
            setIsUserCreated(true);
          }
        } catch (error) {
          console.error("Error initializing user:", error);
        }
      };

      initializeUser();
    }
  }, [isSignedIn, user]);

  return (
    <>
      {isSignedIn && (
        <>
          {isUserCreated ? (
            <div>Hello {user!.fullName}!</div>
          ) : (
            <p>Checking user...</p>
          )}
        </>
      )}
      <header>
        <SignedOut>
          <SignInButton />
        </SignedOut>
        <SignedIn>
          <UserButton />
        </SignedIn>
      </header>
      <div className="flex flex-col">
        <div className="overflow-x-auto">
          <div className=" flex justify-end">
            <button
              className="btn btn-primary"
              onClick={() => setIsModalOpen(true)}
            >
              Add Workplace
            </button>
            <ModalForm
              isOpen={isModalOpen}
              onClose={() => setIsModalOpen(false)}
            />
          </div>
          <Jobs />
        </div>
      </div>
    </>
  );
}
