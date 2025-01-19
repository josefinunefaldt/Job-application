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
import { Link } from "@tanstack/react-router";
import ModalForm from "../components/ModalForm";

export const Route = createFileRoute("/")({
  component: RouteComponent,
});

type postUser = components["schemas"]["User"];

function RouteComponent() {
  const { user, isSignedIn } = useUser();
  const [previouslySignedIn, setPreviouslySignedIn] = useState<boolean | null>(
    null
  );
  const [isModalOpen, setIsModalOpen] = useState(false);

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
    <div
      className="min-h-screen bg-cover bg-center"
      style={{ backgroundImage: "url(./bg.jpg)" }}
    >
      <header>
        <SignedOut>
          <SignInButton />
        </SignedOut>
        <SignedIn>
          <UserButton />
        </SignedIn>
      </header>

      <div className="flex flex-col items-center justify-center mt-[5%]">
        <h1 className="text-4xl font-bold mb-16 text-[#5f7470] ">
          Track your application process
        </h1>
        <div className="flex space-x-12 ">
          <button
            className=" hover:bg-[#FFCF56]  hover:text-[#5f7470] btn rounded-full w-32 h-32 text-lg index-text flex border-0 text-[#F4E4BA]  bg-[#5f7470] items-center justify-center"
            onClick={() => setIsModalOpen(true)}
          >
            ADD JOB
          </button>
          <Link to="/guide">
            <button className=" text-lg btn rounded-full index-text hover:bg-[#FFCF56]  hover:text-[#5f7470]  text-[#F4E4BA] border-0 bg-[#5f7470] w-32 h-32 flex items-center justify-center">
              GUIDE ME
            </button>
          </Link>
        </div>
      </div>

      <ModalForm
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        existingJob={null}
      />
    </div>
  );
}
