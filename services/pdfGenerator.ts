import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { ApplicantData } from '../types';

// Use a type intersection to ensure all jsPDF methods are inherited correctly.
// This resolves errors where methods like `setFontSize`, `text`, etc., were not found on the extended type.
type jsPDFWithAutoTable = jsPDF & {
  autoTable: (options: any) => jsPDF;
};

export const generatePdf = async (data: ApplicantData): Promise<void> => {
  const doc = new jsPDF() as jsPDFWithAutoTable;

  // --- PDF Header ---
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('FORMULIR BIODATA', doc.internal.pageSize.getWidth() / 2, 20, { align: 'center' });
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('HARAP DIISI LENGKAP DENGAN HURUF CETAK', doc.internal.pageSize.getWidth() / 2, 26, { align: 'center' });

  // --- Photo and Position ---
  if (data.photo) {
    try {
        doc.addImage(data.photo, 'JPEG', 15, 40, 30, 40);
    } catch(e) {
        console.error("Error adding image to PDF", e);
        doc.rect(15, 40, 30, 40);
        doc.text("Image Error", 20, 60);
    }
  } else {
    doc.rect(15, 40, 30, 40);
    doc.text('Pas Foto 3x4', 17, 60);
  }
  
  doc.text(`Jabatan yang dilamar: ${data.appliedPosition}`, 50, 45);
  
  let yPos = 90;

  // --- Section 1: IDENTITAS PRIBADI ---
  doc.setFillColor(0, 61, 121); // mandiri-blue
  doc.rect(14, yPos, doc.internal.pageSize.getWidth() - 28, 8, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.text('I. IDENTITAS PRIBADI', 16, yPos + 5.5);
  yPos += 12;
  doc.setTextColor(0, 0, 0);
  doc.setFont('helvetica', 'normal');

  doc.autoTable({
    startY: yPos,
    body: [
      ['Nama Lengkap', data.personal.fullName],
      ['Jenis Kelamin', data.personal.gender],
      ['Tempat/Tanggal Lahir', `${data.personal.birthPlace}, ${data.personal.birthDate}`],
      ['Tinggi / Berat Badan', `${data.personal.height} cm / ${data.personal.weight} kg`],
      ['Alamat E-mail', data.personal.email],
      ['Nomor Telepon & HP', data.personal.phone],
      // Add more personal details here
    ],
    theme: 'plain',
    styles: { fontSize: 10, cellPadding: 1.5 },
    columnStyles: { 0: { fontStyle: 'bold', cellWidth: 50 } },
    didDrawPage: (hookData) => { yPos = hookData.cursor.y }
  });

  // Subsequent sections would follow a similar pattern using autoTable for structured data.
  // For example: Work Experience
  if (data.workExperience.length > 0) {
      yPos += 10;
      doc.setFillColor(0, 61, 121);
      doc.rect(14, yPos, doc.internal.pageSize.getWidth() - 28, 8, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFont('helvetica', 'bold');
      doc.text('VII. PENGALAMAN KERJA', 16, yPos + 5.5);
      yPos += 10;
      doc.setTextColor(0, 0, 0);
      
      doc.autoTable({
          startY: yPos,
          head: [['Tahun', 'Perusahaan', 'Jabatan/Status', 'Alasan Berhenti']],
          body: data.workExperience.map(exp => [
              `${exp.from} - ${exp.to}`,
              exp.companyInfo,
              exp.positionStatus,
              exp.reasonForLeaving,
          ]),
          theme: 'grid',
          headStyles: { fillColor: [220, 220, 220], textColor: 0, fontStyle: 'bold' },
          styles: { fontSize: 9 },
          didDrawPage: (hookData) => { yPos = hookData.cursor.y }
      });
  }


  // --- Save the PDF ---
  doc.save(`Biodata_${data.personal.fullName.replace(/\s/g, '_')}.pdf`);
};