import { components } from "../lib/api/v1";

type fetchJobs = components["schemas"]["WorkplaceResponse"];

export type ModalFormProps = {
  isOpen: boolean;
  onClose: () => void;
  existingJob: fetchJobs | null;
};
