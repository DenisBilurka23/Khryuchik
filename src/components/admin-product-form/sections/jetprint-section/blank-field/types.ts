export type AdminJetprintBlankOption = {
  id: string;
  name: string;
};

export type AdminJetprintBlankFieldProps = {
  name: string;
  blanks: AdminJetprintBlankOption[];
  value: string;
  onChangeAction: (blankId: string) => void;
};
