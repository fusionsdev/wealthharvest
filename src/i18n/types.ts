export type Dict = {
  meta: { title: string; description: string };
  nav: {
    capabilities: string;
    process: string;
    systems: string;
    ventures: string;
    about: string;
    cta: string;
    menu: string;
    close: string;
    skip: string;
    language: string;
  };
  hero: {
    eyebrow: string;
    line1: string;
    line2Accent: string;
    line2Rest: string;
    body: string;
    cta: string;
    secondary: string;
    scroll: string;
  };
  philosophy: {
    label: string;
    a: string;
    b: string;
    bAccent: string;
    c: string;
    cols: { title: string; body: string }[];
    note: string;
  };
  capabilities: {
    label: string;
    title: string;
    hint: string;
    items: { letter: string; title: string; body: string; list: string[] }[];
  };
  process: {
    label: string;
    title: string;
    stepLabel: string;
    loop: string;
    steps: { name: string; line: string }[];
  };
  systems: {
    label: string;
    title: string;
    body: string;
    disclaimer: string;
    axis: string;
    layers: { name: string; items: string }[];
  };
  ventures: {
    label: string;
    title: string;
    body: string;
    tag: string;
    status: string;
    hint: string;
    note: string;
    items: { name: string; category: string }[];
  };
  about: {
    label: string;
    statement: string;
    principlesLabel: string;
    principles: { title: string; body: string }[];
  };
  contact: {
    label: string;
    line1: string;
    accent: string;
    cta: string;
    pending: string;
    email: string;
    messaging: string;
    location: string;
    social: string;
    top: string;
    rights: string;
  };
};
