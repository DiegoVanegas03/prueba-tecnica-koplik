export interface Question {
  id: string;
  type: "open" | "single_choice" | "multiple_choice" | "matching";
  label: string;
  options?: string[];
  optionsMatch?: string[];
}

export interface ResponseApi {
  thumbline: string;
  title: string;
  description: string;
  questions: Question[];
}
