import jsPDF from "jspdf";

import type { ExperienceItem, Language, ProfileState } from "@/stores/profile";

/**
 * Options for generating a CV PDF
 */
interface CvGeneratorOptions {
  /** The profile data to include in the CV */
  profile: ProfileState;
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
   * Formats an ISO date string to a human-readable format.
   * @param dateStr - ISO date string (YYYY-MM-DD)
   * @returns Formatted date string (e.g., "Nov 2023")
   */
  function formatDate(dateStr: string): string {
    const [year, month, day] = dateStr.split("-").map(Number);
    const date = new Date(year, month - 1, day, 12, 0, 0);

    return date.toLocaleDateString("en-GB", {
      month: "short",
      year: "numeric",
    });
  }

  /**
   * Generates a PDF CV from the provided profile data and triggers a download.
   * @param options - Configuration options containing the profile data
   */
  function generateCv({ profile }: CvGeneratorOptions): void {
    const doc = new jsPDF({
      format: "a4",
      orientation: "portrait",
      unit: "mm",
    });

    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 20;
    const contentWidth = pageWidth - margin * 2;
    let y = margin;

    // Colors
    const primaryColor: [number, number, number] = [37, 99, 235]; // Blue-600
    const textColor: [number, number, number] = [31, 41, 55]; // Gray-800
    const mutedColor: [number, number, number] = [107, 114, 128]; // Gray-500

    // Helper function to add text with word wrapping
    function addWrappedText(
      text: string,
      x: number,
      maxWidth: number,
      fontSize: number,
      color: [number, number, number] = textColor
    ): number {
      doc.setFontSize(fontSize);
      doc.setTextColor(...color);
      const lines = doc.splitTextToSize(text, maxWidth);
      doc.text(lines, x, y);

      return lines.length * (fontSize * 0.4);
    }

    // Helper to check and add new page if needed
    function checkPageBreak(requiredSpace: number): void {
      const pageHeight = doc.internal.pageSize.getHeight();

      if (y + requiredSpace > pageHeight - margin) {
        doc.addPage();
        y = margin;
      }
    }

    // Header
    doc.setFillColor(...primaryColor);
    doc.rect(0, 0, pageWidth, 40, "F");

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.setFont("helvetica", "bold");
    doc.text(profile.name, margin, 18);

    doc.setFontSize(14);
    doc.setFont("helvetica", "normal");
    doc.text(profile.title, margin, 28);

    doc.setFontSize(10);
    doc.text(`${profile.location} | ${profile.company}`, margin, 36);

    y = 50;

    // Contact info
    const linkedinSocial = profile.socials.find((s) => s.name === "LinkedIn");
    const emailSocial = profile.socials.find((s) => s.name === "Email");

    doc.setFontSize(9);
    doc.setTextColor(...mutedColor);

    const contactParts: string[] = [];
    if (emailSocial) contactParts.push(emailSocial.href.replace("mailto:", ""));
    if (linkedinSocial) contactParts.push(linkedinSocial.href);

    if (contactParts.length > 0) {
      doc.text(contactParts.join(" | "), margin, y);
      y += 8;
    }

    // Summary
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...primaryColor);
    doc.text("PROFESSIONAL SUMMARY", margin, y);
    y += 6;

    doc.setFont("helvetica", "normal");
    y += addWrappedText(profile.summary, margin, contentWidth, 10);
    y += 8;

    // Skills
    checkPageBreak(30);
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...primaryColor);
    doc.text("SKILLS", margin, y);
    y += 6;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(...textColor);

    // Format skills into rows
    const skillsPerRow = 4;
    const skillWidth = contentWidth / skillsPerRow;

    for (let i = 0; i < profile.skills.length; i += skillsPerRow) {
      const rowSkills = profile.skills.slice(i, i + skillsPerRow);

      rowSkills.forEach((skill, idx) => {
        doc.text(`• ${skill}`, margin + idx * skillWidth, y);
      });

      y += 5;
    }

    y += 6;

    // Experience
    checkPageBreak(40);
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...primaryColor);
    doc.text("EXPERIENCE", margin, y);
    y += 8;

    profile.experience.forEach((exp: ExperienceItem) => {
      checkPageBreak(35);

      doc.setFontSize(11);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(...textColor);
      doc.text(exp.title, margin, y);

      const dateRange = `${formatDate(exp.startDate)} - ${exp.endDate ? formatDate(exp.endDate) : "Present"}`;
      doc.setFontSize(9);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(...mutedColor);
      doc.text(dateRange, pageWidth - margin - doc.getTextWidth(dateRange), y);
      y += 5;

      doc.setFontSize(10);
      doc.setTextColor(...mutedColor);
      doc.text(`${exp.company} | ${exp.location}`, margin, y);
      y += 5;

      doc.setFont("helvetica", "normal");
      y += addWrappedText(exp.description, margin, contentWidth, 9);

      if (exp.skills && exp.skills.length > 0) {
        y += 2;
        doc.setFontSize(8);
        doc.setTextColor(...mutedColor);
        doc.text(`Technologies: ${exp.skills.join(", ")}`, margin, y);
      }

      y += 8;
    });

    // Education
    checkPageBreak(30);
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...primaryColor);
    doc.text("EDUCATION", margin, y);
    y += 8;

    profile.education.forEach((edu: ExperienceItem) => {
      checkPageBreak(20);

      doc.setFontSize(11);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(...textColor);
      doc.text(edu.title, margin, y);
      y += 5;

      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(...mutedColor);
      doc.text(`${edu.company} | ${edu.location}`, margin, y);
      y += 4;

      doc.setFontSize(9);
      doc.text(edu.description, margin, y);
      y += 8;
    });

    // Languages
    checkPageBreak(20);
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...primaryColor);
    doc.text("LANGUAGES", margin, y);
    y += 6;

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...textColor);

    const languageStr = profile.languages
      .map((l: Language) => `${l.name} (${l.level})`)
      .join(", ");

    doc.text(languageStr, margin, y);

    // Save the PDF
    doc.save(`cv_${profile.name.toLowerCase().replace(/\s+/g, "_")}.pdf`);
  }

  return {
    generateCv,
  };
}
