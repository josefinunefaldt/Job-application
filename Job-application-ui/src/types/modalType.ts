import { fetchJobs } from "../..//src/types/workplaceResponseType";

export type ModalFormProps = {
  isOpen: boolean;
  onClose: () => void;
  existingJob: fetchJobs | null;
};
