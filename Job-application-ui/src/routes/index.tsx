import { createFileRoute } from "@tanstack/react-router";
import { Jobs } from "../components/Jobs";
import { useState, useEffect } from "react";
import ModalForm from "../components/ModalForm";
import { CreateUser } from "../../utils/createuser";
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
      const createUserAsync = async () => {
        try {
          const userPayload: postUser = {
            name: user.fullName!,
          };
          await CreateUser(userPayload);
          setIsUserCreated(true);
        } catch (error) {
          console.error("Error creating user:", error);
        }
      };

      createUserAsync();
    }
  }, [isSignedIn, user]);

  return (
    <>
      {isSignedIn}(
      <>
        {isUserCreated ? (
          <div>Hello {user!.fullName}!</div>
        ) : (
          <p>Creating user...</p>
        )}
      </>
      )
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
