type StyleType = "header" | "link" | "text";

interface ConsoleStyles {
  header: string;
  link: string;
  text: string;
}

interface ConsoleMessage {
  style: StyleType;
  text: string;
}

const COLORS = {
  dark: { header: "#60a5fa", link: "#22d3ee", text: "#d4d4d8" },
  light: { header: "#2563eb", link: "#0891b2", text: "#525252" },
} as const;

const MESSAGES: ConsoleMessage[] = [
  { style: "header", text: "👋 Hey, fellow developer!" },
  { style: "text", text: "Curious about the code? Check it out:" },
  { style: "link", text: "https://github.com/ajanes93/andresjanes.gitlab.io" },
  { style: "text", text: "Let's chat!" },
  { style: "link", text: "mailto:dev@andresjanes.com" },
];

export function getConsoleStyles(isDark: boolean): ConsoleStyles {
  const palette = isDark ? COLORS.dark : COLORS.light;

  return {
    header: `font-size: 16px; font-weight: bold; color: ${palette.header};`,
    link: `font-size: 12px; color: ${palette.link};`,
    text: `font-size: 12px; color: ${palette.text};`,
  };
}

export function useConsoleGreeting(): { print: () => void } {
  function print(): void {
    if (typeof window === "undefined") return;

    const isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const styles = getConsoleStyles(isDark);

    MESSAGES.forEach((msg) => {
      console.log(`%c${msg.text}`, styles[msg.style]);
    });
  }

  return { print };
}
