import React, { useEffect, useState } from "react";
import { FetchJobs } from "../../utils/fetchJobs";
import type { components } from "../lib/api/v1";

type fetchJobs = components["schemas"]["WorkplaceResponse"];
export const Jobs = () => {
  const [jobs, setJobs] = useState<fetchJobs[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data: fetchJobs[] = await FetchJobs();

        setJobs(data ?? []);
      } catch (err) {
        console.error("Error fetching jobs:", err);
        setError("Failed to fetch jobs.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="overflow-x-auto">
      <table className="table">
        <thead>
          <tr>
            <th>Position</th>
            <th>Contact Person</th>
            <th>Email</th>
            <th>Location</th>
            <th>Notification</th>
            <th>Deadline</th>
          </tr>
        </thead>
        <tbody>
          {jobs.map((job) => (
            <tr key={job.id}>
              <td>{job.position}</td>
              <td>{job.contactPerson}</td>
              <td>{job.email}</td>
              <td>{job.location}</td>
              <td>{job.notification}</td>
              <td>{job.deadline}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
