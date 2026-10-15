export type ContactChannelKind = "ig" | "tt" | "fb" | "mail";

export type ContactChannelItem = {
  kind: ContactChannelKind;
  label: string;
  value: string;
  href: string;
  external: boolean;
};

export type ContactChannelsSectionProps = {
  title: string;
  sub: string;
  note: string;
  channels: ContactChannelItem[];
};
