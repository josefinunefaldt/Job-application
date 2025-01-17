import React, { useState } from "react";
import { ModalFormProps } from "../types/modalType";
import { CreateWorkplace } from "../../utils/createJob";
import { components } from "../lib/api/v1";

const ModalForm: React.FC<ModalFormProps> = ({ isOpen, onClose }) => {
  const [position, setPosition] = useState("");
  const [contactPerson, setContactPerson] = useState("");
  const [email, setEmail] = useState("");
  const [location, setLocation] = useState("");
  const [notification, setNotification] = useState("");
  const [deadline, setDeadline] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !position ||
      !contactPerson ||
      !email ||
      !location ||
      !notification ||
      !deadline
    ) {
      console.error("All fields are required");
      return;
    }
    type postWork = components["schemas"]["WorkplaceRequest"];
    const workplaceData: postWork = {
      position,
      contactPerson,
      email,
      location,
      notification,
      deadline,
    };

    try {
      await CreateWorkplace(workplaceData);
      onClose();
    } catch (error) {
      console.error("Error creating workplace:", error);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
    >
      <div className="bg-white rounded-lg p-6 w-96 shadow-lg" role="document">
        <header className="mb-4">
          <h2 id="modal-title" className="text-xl font-bold">
            Add Your Job
          </h2>
        </header>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="position" className="block text-sm font-medium">
              Position
            </label>
            <input
              type="text"
              id="position"
              name="position"
              className="input input-bordered w-full"
              placeholder="Position"
              value={position}
              onChange={(e) => setPosition(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="contactPerson"
              className="block text-sm font-medium"
            >
              Contact Person
            </label>
            <input
              type="text"
              id="contactPerson"
              name="contactPerson"
              className="input input-bordered w-full"
              placeholder="Contact Person"
              value={contactPerson}
              onChange={(e) => setContactPerson(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              className="input input-bordered w-full"
              placeholder="Your Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="location" className="block text-sm font-medium">
              Location
            </label>
            <input
              type="text"
              id="location"
              name="location"
              className="input input-bordered w-full"
              placeholder="Location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="deadline" className="block text-sm font-medium">
              Deadline
            </label>
            <input
              type="text"
              id="deadline"
              name="deadline"
              className="input input-bordered w-full"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="Notification" className="block text-sm font-medium">
              Notification
            </label>
            <input
              type="text"
              id="Notification"
              name="Notification"
              className="input input-bordered w-full"
              value={notification}
              onChange={(e) => setNotification(e.target.value)}
              required
            />
          </div>
          <footer className="flex justify-end gap-2">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Submit
            </button>
          </footer>
        </form>
      </div>
    </div>
  );
};

export default ModalForm;
