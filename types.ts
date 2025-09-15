
export interface ApplicantData {
  appliedPosition: string;
  photo: string | null;
  personal: PersonalData;
  family: FamilyData;
  education: EducationData;
  nonFormalEducation: NonFormalCourse[];
  skills: SkillsData;
  organizations: OrganizationExperience[];
  workExperience: WorkExperience[];
  health: HealthData;
  other: OtherData;
  declaration: DeclarationData;
}

export interface PersonalData {
  fullName: string;
  gender: 'Laki-Laki' | 'Perempuan' | '';
  birthPlace: string;
  birthDate: string;
  height: string;
  weight: string;
  bloodType: string;
  nationality: string;
  religion: string;
  address: string;
  postalCode: string;
  residenceStatus: string[];
  ktpAddress: string;
  ktpPostalCode: string;
  phone: string;
  email: string;
  ktpNumber: string;
  ktpExpiry: string;
  ktpCity: string;
  socialMedia: {
    instagram: string;
    twitter: string;
    facebook: string;
    tiktok: string;
    other: string;
  };
}

export interface FamilyData {
  civilStatus: 'Belum Menikah' | 'Sudah Menikah' | 'Janda' | 'Duda' | '';
  marriageDate: string;
  divorceDate: string;
  spouseAndChildren: FamilyMember[];
  parentsAndSiblings: ParentSibling[];
}

export interface FamilyMember {
  id: string;
  name: string;
  gender: 'L' | 'P' | '';
  birthDate: string;
  education: string;
  occupation: string;
}

export interface ParentSibling {
    id: string;
    relationship: string;
    name: string;
    gender: 'L' | 'P' | '';
    birthDate: string;
    lastEducation: string;
    occupation: string;
    company: string;
    phone: string;
}

export interface EducationEntry {
  level: string;
  schoolName: string;
  major: string;
  graduationYear: string;
  gpa: string;
  scholarship: 'Ya' | 'Tidak' | '';
}

export interface EducationData {
    formal: EducationEntry[];
}

export interface NonFormalCourse {
  id: string;
  courseName: string;
  organizer: string;
  year: string;
  duration: string;
  certificate: 'Ada' | 'Tidak' | '';
  fundedBy: string;
}

export interface SkillsData {
  computer: {
    canOperate: boolean;
    cannotOperate: boolean;
    programs: string[];
    other: string;
  };
  language: {
    canUse: boolean;
    cannotUse: boolean;
    languages: LanguageSkill[];
  };
}

export interface LanguageSkill {
  id: string;
  name: string;
  level: 'Aktif' | 'Pasif' | '';
}

export interface OrganizationExperience {
  id: string;
  name: string;
  position: string;
  type: string;
  year: string;
}

export interface WorkExperience {
  id: string;
  from: string;
  to: string;
  companyInfo: string;
  positionStatus: string;
  isContract: boolean;
  isPermanent: boolean;
  salary: string;
  reasonForLeaving: string;
}

export interface HealthIssue {
    id: string;
    illnessName: string;
    since: string;
    symptoms: string;
    disruptsActivities: 'Ya' | 'Tidak' | '';
}

export interface HealthData {
    hasHealthIssues: 'Ya' | 'Tidak' | '';
    issues: HealthIssue[];
}

export interface OtherData {
    attendedSelection: 'Ya' | 'Tidak' | '';
    selectionDetails: {
        times: string;
        position: string;
        month: string;
        year: string;
    };
    hasRelative: 'Ya' | 'Tidak' | '';
    relatives: Relative[];
    references: Reference[];
}

export interface Relative {
    id: string;
    name: string;
    position: string;
    unit: string;
    relationship: string;
}

export interface Reference {
    id: string;
    name: string;
    company: string;
    phone: string;
    notes: string;
}

export interface DeclarationData {
    city: string;
    date: string;
    fullName: string;
}
