import * as XLSX from 'xlsx';
import { ApplicantData } from '../types';

// Generates an Excel file for a SINGLE applicant with multiple sheets
export const generateExcel = (data: ApplicantData): void => {
  const wb = XLSX.utils.book_new();

  // --- Personal Data Sheet ---
  const personalData = [
    { 'Kategori': 'Posisi Dilamar', 'Data': data.appliedPosition },
    { 'Kategori': 'Nama Lengkap', 'Data': data.personal.fullName },
    { 'Kategori': 'Jenis Kelamin', 'Data': data.personal.gender },
    { 'Kategori': 'Tempat Lahir', 'Data': data.personal.birthPlace },
    { 'Kategori': 'Tanggal Lahir', 'Data': data.personal.birthDate },
    { 'Kategori': 'Tinggi Badan (cm)', 'Data': data.personal.height },
    { 'Kategori': 'Berat Badan (kg)', 'Data': data.personal.weight },
    { 'Kategori': 'Golongan Darah', 'Data': data.personal.bloodType },
    { 'Kategori': 'Kewarganegaraan', 'Data': data.personal.nationality },
    { 'Kategori': 'Agama', 'Data': data.personal.religion },
    { 'Kategori': 'Alamat Tinggal', 'Data': data.personal.address },
    { 'Kategori': 'Kode Pos Tinggal', 'Data': data.personal.postalCode },
    { 'Kategori': 'Alamat KTP', 'Data': data.personal.ktpAddress },
    { 'Kategori': 'Kode Pos KTP', 'Data': data.personal.ktpPostalCode },
    { 'Kategori': 'No. Telepon/HP', 'Data': data.personal.phone },
    { 'Kategori': 'Alamat E-mail', 'Data': data.personal.email },
    { 'Kategori': 'No. KTP', 'Data': data.personal.ktpNumber },
    // ... add all other personal fields
  ];
  const wsPersonal = XLSX.utils.json_to_sheet(personalData);
  XLSX.utils.book_append_sheet(wb, wsPersonal, 'Identitas Pribadi');

  // --- Work Experience Sheet ---
  if(data.workExperience.length > 0) {
      const workData = data.workExperience.map(exp => ({
          'Dari': exp.from,
          'Sampai': exp.to,
          'Informasi Perusahaan': exp.companyInfo,
          'Jabatan & Status': exp.positionStatus,
          'Gaji & Tunjangan': exp.salary,
          'Alasan Berhenti': exp.reasonForLeaving,
      }));
      const wsWork = XLSX.utils.json_to_sheet(workData);
      XLSX.utils.book_append_sheet(wb, wsWork, 'Pengalaman Kerja');
  }
  
  // --- Education Sheet ---
  if(data.education.formal.length > 0) {
      const eduData = data.education.formal.filter(edu => edu.schoolName).map(edu => ({
          'Tingkat': edu.level,
          'Nama Sekolah/Universitas': edu.schoolName,
          'Jurusan': edu.major,
          'Tahun Lulus': edu.graduationYear,
          'IPK/NEM': edu.gpa,
          'Beasiswa': edu.scholarship,
      }));
      const wsEdu = XLSX.utils.json_to_sheet(eduData);
      XLSX.utils.book_append_sheet(wb, wsEdu, 'Pendidikan Formal');
  }

  // --- Skills Sheet ---
  const skillsData = [
      {'Kategori': 'Komputer', 'Detail': data.skills.computer.canOperate ? `Mampu: ${data.skills.computer.programs.join(', ')} ${data.skills.computer.other}` : 'Tidak Mampu'},
      ...data.skills.language.languages.map(lang => ({
          'Kategori': 'Bahasa Asing',
          'Detail': `${lang.name} (${lang.level})`
      }))
  ];
  const wsSkills = XLSX.utils.json_to_sheet(skillsData);
  XLSX.utils.book_append_sheet(wb, wsSkills, 'Keterampilan');


  // Add other sheets for family, organizations, etc.

  // --- Save the Excel file ---
  XLSX.writeFile(wb, `Biodata_${data.personal.fullName.replace(/\s/g, '_')}.xlsx`);
};

// Generates a recap Excel file for ALL applicants in a single sheet
export const generateRecapExcel = (allData: ApplicantData[]): void => {
    const recapData = allData.map(data => ({
        'Nama Lengkap': data.personal.fullName,
        'Posisi Dilamar': data.appliedPosition,
        'Email': data.personal.email,
        'Telepon': data.personal.phone,
        'Tempat, Tgl Lahir': `${data.personal.birthPlace}, ${data.personal.birthDate}`,
        'Pendidikan Terakhir': data.education.formal.filter(e => e.schoolName).pop()?.schoolName || 'N/A',
        'Pengalaman Kerja Terakhir': data.workExperience[data.workExperience.length - 1]?.companyInfo || 'N/A',
    }));

    const ws = XLSX.utils.json_to_sheet(recapData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Rekapitulasi Pelamar");

    // Auto-size columns
    const cols = Object.keys(recapData[0] || {}).map(key => ({
        wch: recapData.reduce((w, r) => Math.max(w, (r[key as keyof typeof r] || '').toString().length), 10)
    }));
    ws['!cols'] = cols;

    XLSX.writeFile(wb, `Rekapitulasi_Pelamar_${new Date().toLocaleDateString('id-ID')}.xlsx`);
}