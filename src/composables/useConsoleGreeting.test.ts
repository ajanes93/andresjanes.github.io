import { getConsoleStyles, useConsoleGreeting } from "./useConsoleGreeting";

describe("useConsoleGreeting", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getConsoleStyles", () => {
    it("returns correct colors for dark mode", () => {
      const styles = getConsoleStyles(true);

      expect(styles).toEqual({
        header: "font-size: 16px; font-weight: bold; color: #60a5fa;",
        link: "font-size: 12px; color: #22d3ee;",
        text: "font-size: 12px; color: #d4d4d8;",
      });
    });

    it("returns correct colors for light mode", () => {
      const styles = getConsoleStyles(false);

      expect(styles).toEqual({
        header: "font-size: 16px; font-weight: bold; color: #2563eb;",
        link: "font-size: 12px; color: #0891b2;",
        text: "font-size: 12px; color: #525252;",
      });
    });
  });

  describe("useConsoleGreeting", () => {
    it("returns a print function", () => {
      const { print } = useConsoleGreeting();

      expect(typeof print).toBe("function");
    });
  });

  describe("print", () => {
    const mockMatchMedia = (matches: boolean) => {
      Object.defineProperty(window, "matchMedia", {
        writable: true,
        value: vi.fn().mockImplementation((query: string) => ({
          matches,
          media: query,
          onchange: null,
          addListener: vi.fn(),
          removeListener: vi.fn(),
          addEventListener: vi.fn(),
          removeEventListener: vi.fn(),
          dispatchEvent: vi.fn(),
        })),
      });
    };

    it("does nothing when window is undefined (SSR)", () => {
      const originalWindow = global.window;
      // @ts-expect-error - testing SSR behavior
      delete global.window;

      const consoleLogSpy = vi.spyOn(console, "log");
      const { print } = useConsoleGreeting();

      print();

      expect(consoleLogSpy).not.toHaveBeenCalled();

      // Restore window
      global.window = originalWindow;
    });

    it("logs all messages with correct styles in dark mode", () => {
      mockMatchMedia(true);
      const consoleLogSpy = vi.spyOn(console, "log");
      const { print } = useConsoleGreeting();

      print();

      expect(consoleLogSpy).toHaveBeenCalledTimes(5);

      expect(consoleLogSpy).toHaveBeenNthCalledWith(
        1,
        "%c👋 Hey, fellow developer!",
        "font-size: 16px; font-weight: bold; color: #60a5fa;"
      );

      expect(consoleLogSpy).toHaveBeenNthCalledWith(
        2,
        "%cCurious about the code? Check it out:",
        "font-size: 12px; color: #d4d4d8;"
      );

      expect(consoleLogSpy).toHaveBeenNthCalledWith(
        3,
        "%chttps://github.com/ajanes93/andresjanes.gitlab.io",
        "font-size: 12px; color: #22d3ee;"
      );

      expect(consoleLogSpy).toHaveBeenNthCalledWith(
        4,
        "%cLet's chat!",
        "font-size: 12px; color: #d4d4d8;"
      );

      expect(consoleLogSpy).toHaveBeenNthCalledWith(
        5,
        "%cmailto:dev@andresjanes.com",
        "font-size: 12px; color: #22d3ee;"
      );
    });

    it("logs all messages with correct styles in light mode", () => {
      mockMatchMedia(false);
      const consoleLogSpy = vi.spyOn(console, "log");
      const { print } = useConsoleGreeting();

      print();

      expect(consoleLogSpy).toHaveBeenCalledTimes(5);

      expect(consoleLogSpy).toHaveBeenNthCalledWith(
        1,
        "%c👋 Hey, fellow developer!",
        "font-size: 16px; font-weight: bold; color: #2563eb;"
      );

      expect(consoleLogSpy).toHaveBeenNthCalledWith(
        2,
        "%cCurious about the code? Check it out:",
        "font-size: 12px; color: #525252;"
      );

      expect(consoleLogSpy).toHaveBeenNthCalledWith(
        3,
        "%chttps://github.com/ajanes93/andresjanes.gitlab.io",
        "font-size: 12px; color: #0891b2;"
      );

      expect(consoleLogSpy).toHaveBeenNthCalledWith(
        4,
        "%cLet's chat!",
        "font-size: 12px; color: #525252;"
      );

      expect(consoleLogSpy).toHaveBeenNthCalledWith(
        5,
        "%cmailto:dev@andresjanes.com",
        "font-size: 12px; color: #0891b2;"
      );
    });
  });
});
