export interface Question {
  type: "open" | "single_choice" | "multiple_choice" | "matching";
  label: string;
  options?: string[];
  optionsMatch?: string[];
}
