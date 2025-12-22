import html2canvas from "html2canvas";
import jsPDF from "jspdf";

export async function exportElementAsPDF(element: HTMLElement, fileName: string) {
  const canvas = await html2canvas(element, {
    scale: 2,
    useCORS: true,
    backgroundColor: "#ffffff",
  });

  const imageData = canvas.toDataURL("image/png");
  const pdf = new jsPDF("p", "mm", "a4");
  const pdfWidth = pdf.internal.pageSize.getWidth();
  const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

  pdf.addImage(imageData, "PNG", 0, 0, pdfWidth, pdfHeight);
  pdf.save(fileName);
}

