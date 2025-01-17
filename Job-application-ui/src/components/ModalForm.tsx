import React from "react";
import { ModalFormProps } from "../types/modalType";

const ModalForm: React.FC<ModalFormProps> = ({ isOpen, onClose }) => {
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
        <form>
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
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="notification" className="block text-sm font-medium">
              Notification
            </label>
            <select
              id="notification"
              name="notification"
              className="select select-bordered w-full"
              aria-describedby="notification-help"
              required
            >
              <option value="" disabled selected>
                Select notification type
              </option>
              <option value="waiting">Waiting for an answer</option>
              <option value="interview">Interview booked</option>
              <option value="no">No</option>
              <option value="yes">Yes</option>
            </select>
          </div>
          <div className="mb-4">
            <label htmlFor="deadline" className="block text-sm font-medium">
              Deadline
            </label>
            <input
              type="date"
              id="deadline"
              name="deadline"
              className="input input-bordered w-full"
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
