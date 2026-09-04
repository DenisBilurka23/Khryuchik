export type CategoryTabOption = {
  value: string;
  label: string;
};

export type CategoryTabsProps = {
  selectedValue: string;
  options: CategoryTabOption[];
  className?: string;
  queryParamName?: string;
  defaultValueWithoutQuery?: string;
  preserveQueryParams?: string[];
  variant?: "pills" | "text";
  label?: string;
};
