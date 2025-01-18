import React, { useState, useEffect } from "react";
import { ModalFormProps } from "../types/modalType";
import { CreateWorkplace } from "../../utils/createJob";
import { UpdateWorkplace } from "../../utils/updateJob";
import { components } from "../lib/api/v1";

type postWork = components["schemas"]["WorkplaceRequest"];

const ModalForm: React.FC<ModalFormProps> = ({
  isOpen,
  onClose,
  existingJob,
}) => {
  const [position, setPosition] = useState("");
  const [contactPerson, setContactPerson] = useState("");
  const [email, setEmail] = useState("");
  const [location, setLocation] = useState("");
  const [company, setCompany] = useState("");
  const [link, setLink] = useState("");
  const [status, setStatus] = useState("");
  const [deadline, setDeadline] = useState("");
  const [interviewDateTime, setInterviewDateTime] = useState("");
  const [statusTimestamp, setStatusTimestamp] = useState<string>("");

  useEffect(() => {
    if (existingJob) {
      setPosition(existingJob?.position ?? "");
      setContactPerson(existingJob?.contactPerson ?? "");
      setEmail(existingJob?.email ?? "");
      setLocation(existingJob?.location ?? "");
      setCompany(existingJob?.company ?? "");
      setLink(existingJob?.link ?? "");
      setStatus(existingJob?.status ?? "");
      setDeadline(existingJob?.deadline ?? "");
      setInterviewDateTime(existingJob?.interviewDate ?? "");
      setStatusTimestamp(existingJob?.statusTimeStamp ?? "");
    }
  }, [existingJob]);

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value;
    setStatus(newStatus);
    setStatusTimestamp(new Date().toISOString());
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !position ||
      !contactPerson ||
      !email ||
      !location ||
      !company ||
      !link ||
      !status ||
      !deadline
    ) {
      console.error("All fields are required");
      return;
    }
    if (status === "interview booked" && !interviewDateTime) {
      console.error(
        "Interview Date & Time is required when the status is 'interview booked'"
      );
      return;
    }
    const workplaceData: postWork = {
      position,
      contactPerson,
      email,
      location,
      company,
      link,
      status,
      deadline,
      interviewDate:
        status === "interview booked" ? interviewDateTime : undefined,
      statusTimeStamp: status
        ? new Date(new Date().setDate(new Date().getDate() - 14)).toISOString()
        : null,
    };

    try {
      if (existingJob) {
        await UpdateWorkplace(existingJob.id!, workplaceData);
      } else {
        await CreateWorkplace(workplaceData);
      }
      onClose();
    } catch (error) {
      console.error("Error saving workplace:", error);
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
      <div
        className="bg-white rounded-lg p-6 w-full max-w-3xl shadow-lg"
        role="document"
      >
        <header className="mb-6">
          <h2 id="modal-title" className="text-2xl font-bold">
            {existingJob ? "Edit Job" : "Add Your Job"}
          </h2>
        </header>
        <form onSubmit={handleSubmit} className="space-y-6">
          <fieldset className="border rounded-lg p-4">
            <legend className="text-lg font-semibold">Job Details</legend>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
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
              <div>
                <label htmlFor="company" className="block text-sm font-medium">
                  Company
                </label>
                <input
                  type="text"
                  id="company"
                  name="company"
                  className="input input-bordered w-full"
                  placeholder="Company Name"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  required
                />
              </div>
              <div>
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
              <div>
                <label htmlFor="link" className="block text-sm font-medium">
                  Link
                </label>
                <input
                  type="url"
                  id="link"
                  name="link"
                  className="input input-bordered w-full"
                  placeholder="Job Link"
                  value={link}
                  onChange={(e) => setLink(e.target.value)}
                  required
                />
              </div>
            </div>
          </fieldset>
          <fieldset className="border rounded-lg p-4">
            <legend className="text-lg font-semibold">Contact Details</legend>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
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
              <div>
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
            </div>
          </fieldset>
          <fieldset className="border rounded-lg p-4">
            <legend className="text-lg font-semibold">Status & Deadline</legend>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="status" className="block text-sm font-medium">
                  Status
                </label>
                <select
                  id="status"
                  name="status"
                  className="select select-bordered w-full"
                  value={status}
                  onChange={handleStatusChange}
                  required
                >
                  <option value="" disabled>
                    Select status
                  </option>
                  <option value="waiting for an answer">
                    Waiting for an answer
                  </option>
                  <option value="interview booked">Interview booked</option>
                  <option value="no">No</option>
                  <option value="yes">Yes</option>
                </select>
              </div>
              <div>
                <label htmlFor="deadline" className="block text-sm font-medium">
                  Deadline
                </label>
                <input
                  type="date"
                  id="deadline"
                  name="deadline"
                  className="input input-bordered w-full"
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                  required
                />
              </div>
            </div>
            {status === "interview booked" && (
              <div className="mt-4">
                <label
                  htmlFor="interviewDateTime"
                  className="block text-sm font-medium"
                >
                  Interview Date & Time
                </label>
                <input
                  type="datetime-local"
                  id="interviewDateTime"
                  name="interviewDateTime"
                  className="input input-bordered w-full"
                  value={interviewDateTime}
                  onChange={(e) => setInterviewDateTime(e.target.value)}
                  required={status === "interview booked"}
                />
              </div>
            )}
          </fieldset>

          <footer className="flex justify-end gap-4">
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
