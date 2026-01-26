import jsPDF from "jspdf";

import type { ProfileState } from "@/stores/profile";

type RgbColor = [number, number, number];

interface CvGeneratorOptions {
  doc?: jsPDF;
  profile: ProfileState;
}

interface CvGeneratorResult {
  doc: jsPDF;
  filename: string;
}

/**
 * Formats an ISO date string to a human-readable format.
 * @param dateStr - ISO date string (YYYY-MM-DD)
 * @returns Formatted date string (e.g., "Nov 2023")
 */
export function formatDate(dateStr: string): string {
  const [year, month, day] = dateStr.split("-").map(Number);
  const date = new Date(year, month - 1, day, 12, 0, 0);

  return date.toLocaleDateString("en-GB", {
    month: "short",
    year: "numeric",
  });
}

/**
 * Generates a filename for the CV PDF.
 * @param name - The person's name
 * @returns Formatted filename
 */
export function generateFilename(name: string): string {
  return `cv_${name.toLowerCase().replace(/\s+/g, "_")}.pdf`;
}

/**
 * Composable for generating PDF CVs from profile data.
 *
 * @returns Object containing the generateCv function
 *
 * @example
 * ```ts
 * const { generateCv } = useCvGenerator()
 * generateCv({ profile: store.$state })
 * ```
 */
export function useCvGenerator() {
  /**
   * Generates a PDF CV from the provided profile data.
   * @param options - Configuration options containing the profile data and optional doc
   * @returns The generated document and filename
   */
  function generateCv({ profile, doc }: CvGeneratorOptions): CvGeneratorResult {
    const pdfDoc =
      doc ??
      new jsPDF({
        format: "a4",
        orientation: "portrait",
        unit: "mm",
      });

    const pageWidth = pdfDoc.internal.pageSize.getWidth();
    const margin = 20;
    const contentWidth = pageWidth - margin * 2;
    let y = margin;

    // Colors
    const primaryColor: RgbColor = [37, 99, 235]; // Blue-600
    const textColor: RgbColor = [31, 41, 55]; // Gray-800
    const mutedColor: RgbColor = [107, 114, 128]; // Gray-500

    function addWrappedText(
      text: string,
      x: number,
      maxWidth: number,
      fontSize: number,
      color: RgbColor = textColor
    ): number {
      pdfDoc.setFontSize(fontSize);
      pdfDoc.setTextColor(...color);
      const lines = pdfDoc.splitTextToSize(text, maxWidth);
      pdfDoc.text(lines, x, y);

      return lines.length * (fontSize * 0.4);
    }

    function checkPageBreak(requiredSpace: number): void {
      const pageHeight = pdfDoc.internal.pageSize.getHeight();

      if (y + requiredSpace > pageHeight - margin) {
        pdfDoc.addPage();
        y = margin;
      }
    }

    function addSectionHeader(title: string): void {
      pdfDoc.setFontSize(12);
      pdfDoc.setFont("helvetica", "bold");
      pdfDoc.setTextColor(...primaryColor);
      pdfDoc.text(title, margin, y);
      y += 6;
      pdfDoc.setFont("helvetica", "normal");
    }

    // Header
    pdfDoc.setFillColor(...primaryColor);
    pdfDoc.rect(0, 0, pageWidth, 40, "F");

    pdfDoc.setTextColor(255, 255, 255);
    pdfDoc.setFontSize(24);
    pdfDoc.setFont("helvetica", "bold");
    pdfDoc.text(profile.name, margin, 18);

    pdfDoc.setFontSize(14);
    pdfDoc.setFont("helvetica", "normal");
    pdfDoc.text(profile.title, margin, 28);

    pdfDoc.setFontSize(10);
    pdfDoc.text(`${profile.location} | ${profile.company}`, margin, 36);

    y = 50;

    // Contact info
    const email = profile.socials.find((s) => s.name === "Email");
    const linkedin = profile.socials.find((s) => s.name === "LinkedIn");

    const contactParts = [
      email?.href.replace("mailto:", ""),
      linkedin?.href,
    ].filter(Boolean);

    if (contactParts.length > 0) {
      pdfDoc.setFontSize(9);
      pdfDoc.setTextColor(...mutedColor);
      pdfDoc.text(contactParts.join(" | "), margin, y);
      y += 8;
    }

    // Summary
    addSectionHeader("PROFESSIONAL SUMMARY");
    y += addWrappedText(profile.summary, margin, contentWidth, 10);
    y += 8;

    // Skills
    checkPageBreak(30);
    addSectionHeader("SKILLS");
    pdfDoc.setFontSize(10);
    pdfDoc.setTextColor(...textColor);

    // Format skills into rows
    const skillsPerRow = 4;
    const skillWidth = contentWidth / skillsPerRow;

    for (let i = 0; i < profile.skills.length; i += skillsPerRow) {
      const rowSkills = profile.skills.slice(i, i + skillsPerRow);

      rowSkills.forEach((skill, idx) => {
        pdfDoc.text(`• ${skill}`, margin + idx * skillWidth, y);
      });

      y += 5;
    }

    y += 6;

    // Experience
    checkPageBreak(40);
    addSectionHeader("EXPERIENCE");
    y += 2;

    profile.experience.forEach((exp) => {
      checkPageBreak(35);

      pdfDoc.setFontSize(11);
      pdfDoc.setFont("helvetica", "bold");
      pdfDoc.setTextColor(...textColor);
      pdfDoc.text(exp.title, margin, y);

      const endDate = exp.endDate ? formatDate(exp.endDate) : "Present";
      const dateRange = `${formatDate(exp.startDate)} - ${endDate}`;
      pdfDoc.setFontSize(9);
      pdfDoc.setFont("helvetica", "normal");
      pdfDoc.setTextColor(...mutedColor);

      pdfDoc.text(
        dateRange,
        pageWidth - margin - pdfDoc.getTextWidth(dateRange),
        y
      );

      y += 5;

      pdfDoc.setFontSize(10);
      pdfDoc.setTextColor(...mutedColor);
      pdfDoc.text(`${exp.company} | ${exp.location}`, margin, y);
      y += 5;

      pdfDoc.setFont("helvetica", "normal");
      y += addWrappedText(exp.description, margin, contentWidth, 9);

      if (exp.skills?.length) {
        y += 2;
        pdfDoc.setFontSize(8);
        pdfDoc.setTextColor(...mutedColor);
        pdfDoc.text(`Technologies: ${exp.skills.join(", ")}`, margin, y);
      }

      y += 8;
    });

    // Education
    checkPageBreak(30);
    addSectionHeader("EDUCATION");
    y += 2;

    profile.education.forEach((edu) => {
      checkPageBreak(20);

      pdfDoc.setFontSize(11);
      pdfDoc.setFont("helvetica", "bold");
      pdfDoc.setTextColor(...textColor);
      pdfDoc.text(edu.title, margin, y);
      y += 5;

      pdfDoc.setFontSize(10);
      pdfDoc.setFont("helvetica", "normal");
      pdfDoc.setTextColor(...mutedColor);
      pdfDoc.text(`${edu.company} | ${edu.location}`, margin, y);
      y += 4;

      pdfDoc.setFontSize(9);
      pdfDoc.text(edu.description, margin, y);
      y += 8;
    });

    // Languages
    checkPageBreak(20);
    addSectionHeader("LANGUAGES");
    pdfDoc.setFontSize(10);
    pdfDoc.setTextColor(...textColor);

    const languageStr = profile.languages
      .map((l) => `${l.name} (${l.level})`)
      .join(", ");

    pdfDoc.text(languageStr, margin, y);

    const filename = generateFilename(profile.name);

    return { doc: pdfDoc, filename };
  }

  /**
   * Generates a PDF CV and triggers a download.
   * @param options - Configuration options containing the profile data
   */
  function downloadCv(options: CvGeneratorOptions): void {
    const { doc, filename } = generateCv(options);
    doc.save(filename);
  }

  return {
    downloadCv,
    generateCv,
  };
}
