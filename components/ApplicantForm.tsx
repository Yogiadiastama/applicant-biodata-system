import React, { useReducer, useState, ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PaperAirplaneIcon, PlusCircleIcon, TrashIcon, CheckCircleIcon } from '@heroicons/react/24/solid';
import { ApplicantData, PersonalData, FamilyData, EducationData, NonFormalCourse, SkillsData, OrganizationExperience, WorkExperience, HealthData, OtherData, DeclarationData, EducationEntry, FamilyMember, ParentSibling, LanguageSkill, HealthIssue, Relative, Reference } from '../types';
import PhotoUpload from './PhotoUpload';
import SectionHeader from './SectionHeader';

// --- Reducer Actions ---
type Action =
  | { type: 'UPDATE_FIELD'; payload: { field: keyof ApplicantData; value: any } }
  | { type: 'UPDATE_NESTED_FIELD'; payload: { section: keyof ApplicantData; field: string; value: any; subField?: string } }
  | { type: 'UPDATE_ARRAY_ITEM'; payload: { section: keyof ApplicantData; index: number; field: string; value: any } }
  | { type: 'UPDATE_NESTED_ARRAY_ITEM'; payload: { section: keyof ApplicantData; nestedKey: string; index: number; field: string; value: any } }
  | { type: 'ADD_ARRAY_ITEM'; payload: { section: keyof ApplicantData; newItem: any } }
  | { type: 'ADD_NESTED_ARRAY_ITEM'; payload: { section: keyof ApplicantData; nestedKey: string; newItem: any } }
  | { type: 'REMOVE_ARRAY_ITEM'; payload: { section: keyof ApplicantData; id: string } }
  | { type: 'REMOVE_NESTED_ARRAY_ITEM'; payload: { section: keyof ApplicantData; nestedKey: string; id: string } }
  | { type: 'RESET_FORM' };


const createInitialEducation = (): EducationEntry[] => [
    { level: 'SD', schoolName: '', major: '-', graduationYear: '', gpa: '-', scholarship: 'Tidak' },
    { level: 'SMP', schoolName: '', major: '-', graduationYear: '', gpa: '-', scholarship: 'Tidak' },
    { level: 'SMA/SMK', schoolName: '', major: '', graduationYear: '', gpa: '', scholarship: 'Tidak' },
    { level: 'AKADEMI', schoolName: '', major: '', graduationYear: '', gpa: '', scholarship: 'Tidak' },
    { level: 'STRATA 1', schoolName: '', major: '', graduationYear: '', gpa: '', scholarship: 'Tidak' },
    { level: 'PROFESI', schoolName: '', major: '', graduationYear: '', gpa: '', scholarship: 'Tidak' },
    { level: 'STRATA 2', schoolName: '', major: '', graduationYear: '', gpa: '', scholarship: 'Tidak' },
];

const initialApplicantData: ApplicantData = {
    appliedPosition: '',
    photo: null,
    personal: {
        fullName: '', gender: '', birthPlace: '', birthDate: '', height: '', weight: '', bloodType: '',
        nationality: 'Indonesia', religion: '', address: '', postalCode: '', residenceStatus: [], ktpAddress: '',
        ktpPostalCode: '', phone: '', email: '', ktpNumber: '', ktpExpiry: 'Seumur Hidup', ktpCity: '',
        socialMedia: { instagram: '', twitter: '', facebook: '', tiktok: '', other: '' }
    },
    family: {
        civilStatus: '', marriageDate: '', divorceDate: '',
        spouseAndChildren: [],
        parentsAndSiblings: [
             { id: crypto.randomUUID(), relationship: 'Ayah', name: '', gender: 'L', birthDate: '', lastEducation: '', occupation: '', company: '', phone: ''},
             { id: crypto.randomUUID(), relationship: 'Ibu', name: '', gender: 'P', birthDate: '', lastEducation: '', occupation: '', company: '', phone: ''},
        ],
    },
    education: {
        formal: createInitialEducation()
    },
    nonFormalEducation: [],
    skills: {
        computer: { canOperate: true, cannotOperate: false, programs: [], other: '' },
        language: { canUse: true, cannotUse: false, languages: [] }
    },
    organizations: [],
    workExperience: [],
    health: { hasHealthIssues: 'Tidak', issues: [] },
    other: {
        attendedSelection: 'Tidak', selectionDetails: { times: '', position: '', month: '', year: '' },
        hasRelative: 'Tidak', relatives: [],
        references: [{ id: crypto.randomUUID(), name: '', company: '', phone: '', notes: '' }],
    },
    declaration: { city: '', date: new Date().toISOString().split('T')[0], fullName: '' },
};

// --- The Reducer Function ---
const formReducer = (state: ApplicantData, action: Action): ApplicantData => {
    switch (action.type) {
        case 'UPDATE_FIELD':
            return { ...state, [action.payload.field]: action.payload.value };
        
        case 'UPDATE_NESTED_FIELD': {
            const { section, field, value, subField } = action.payload;
            if (subField) { // Handles tertiary nesting like personal.socialMedia.instagram
                 return {
                    ...state,
                    [section]: {
                        ...(state[section] as any),
                        [field]: {
                            ...((state[section] as any)[field]),
                            [subField]: value,
                        }
                    },
                };
            }
            return { // Handles secondary nesting like personal.fullName
                ...state,
                [section]: {
                    ...(state[section] as any),
                    [field]: value,
                },
            };
        }

        case 'UPDATE_ARRAY_ITEM': {
            const { section, index, field, value } = action.payload;
            const array = (state[section] as any[]).map((item, i) =>
                i === index ? { ...item, [field]: value } : item
            );
            return { ...state, [section]: array as any };
        }

        case 'UPDATE_NESTED_ARRAY_ITEM': {
            const { section, nestedKey, index, field, value } = action.payload;
            const sectionState = state[section] as any;
            const array = (sectionState[nestedKey] as any[]).map((item, i) =>
                i === index ? { ...item, [field]: value } : item
            );
            return {
                ...state,
                [section]: {
                    ...sectionState,
                    [nestedKey]: array,
                },
            };
        }

        case 'ADD_ARRAY_ITEM': {
            const { section, newItem } = action.payload;
            const array = state[section] as any[];
            return { ...state, [section]: [...array, newItem] as any };
        }
        
        case 'REMOVE_ARRAY_ITEM': {
            const { section, id } = action.payload;
            const array = (state[section] as any[]).filter(item => item.id !== id);
            return { ...state, [section]: array as any };
        }

        case 'ADD_NESTED_ARRAY_ITEM': {
            const { section, nestedKey, newItem } = action.payload;
            const sectionState = state[section] as any;
            const array = [...(sectionState[nestedKey] as any[]), newItem];
            return {
                ...state,
                [section]: {
                    ...sectionState,
                    [nestedKey]: array,
                },
            };
        }

        case 'REMOVE_NESTED_ARRAY_ITEM': {
            const { section, nestedKey, id } = action.payload;
            const sectionState = state[section] as any;
            const array = (sectionState[nestedKey] as any[]).filter(item => item.id !== id);
            return {
                ...state,
                [section]: {
                    ...sectionState,
                    [nestedKey]: array,
                },
            };
        }

        case 'RESET_FORM':
            return initialApplicantData;
            
        default:
            return state;
    }
};


// --- Helper Components ---
const FormRow = ({ children, className = '' }: { children?: ReactNode, className?: string }) => <div className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-4 ${className}`}>{children}</div>;
const FormField = ({ label, children, className = '' }: { label: string, children?: ReactNode, className?: string }) => (
    <div className={`flex flex-col ${className}`}>
        <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
        {children}
    </div>
);
const TextInput = (props: React.InputHTMLAttributes<HTMLInputElement>) => <input {...props} className="block w-full text-gray-900 border-gray-300 rounded-md shadow-sm focus:ring-mandiri-blue focus:border-mandiri-blue sm:text-sm placeholder:text-gray-400 disabled:bg-gray-100" />;
const SelectInput = (props: React.SelectHTMLAttributes<HTMLSelectElement>) => <select {...props} className="block w-full text-gray-900 border-gray-300 rounded-md shadow-sm focus:ring-mandiri-blue focus:border-mandiri-blue sm:text-sm">{props.children}</select>;
const AddButton = ({ onClick, text }: { onClick: () => void; text: string }) => (
    <button type="button" onClick={onClick} className="mt-2 flex items-center gap-2 px-4 py-2 text-sm font-medium text-mandiri-blue hover:bg-blue-50 rounded-md">
        <PlusCircleIcon className="h-5 w-5"/> {text}
    </button>
);
// FIX: Refactored DynamicListItem to use React.FC and a separate props interface.
// This ensures TypeScript properly recognizes it as a component and handles the special `key` prop correctly, resolving type errors during list rendering.
interface DynamicListItemProps {
    id: string;
    onRemove: (id: string) => void;
    children: ReactNode;
}
const DynamicListItem: React.FC<DynamicListItemProps> = ({ id, onRemove, children }) => (
    <div className="p-4 mb-4 border rounded-lg bg-white relative">
        <button type="button" onClick={() => onRemove(id)} className="absolute top-2 right-2 text-gray-400 hover:text-red-600">
            <TrashIcon className="h-5 w-5"/>
        </button>
        {children}
    </div>
);


interface ApplicantFormProps {
    onSubmit: (data: ApplicantData) => Promise<'success' | 'error'>;
}

const ApplicantForm: React.FC<ApplicantFormProps> = ({ onSubmit }) => {
    const [data, dispatch] = useReducer(formReducer, initialApplicantData);
    const [activeSection, setActiveSection] = useState<string>('personal');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submissionStatus, setSubmissionStatus] = useState<'success' | 'error' | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setSubmissionStatus(null);
        
        let dataToSubmit = { ...data };
        if (!dataToSubmit.declaration.fullName && dataToSubmit.personal.fullName) {
            dataToSubmit = {...dataToSubmit, declaration: {...dataToSubmit.declaration, fullName: dataToSubmit.personal.fullName}};
        }

        const result = await onSubmit(dataToSubmit);
        setSubmissionStatus(result);
        setIsSubmitting(false);

        if (result === 'success') {
            setTimeout(() => {
                dispatch({ type: 'RESET_FORM' });
                setSubmissionStatus(null);
                setActiveSection('personal');
            }, 3000);
        }
    };
    
    const toggleSection = (section: string) => {
        setActiveSection(activeSection === section ? '' : section);
    };
    
    const Section = ({ title, id, children }: { title: string, id: string, children?: ReactNode }) => (
        <div className="border-b border-gray-200">
            <button type="button" onClick={() => toggleSection(id)} className="w-full text-left">
                <SectionHeader title={title} />
            </button>
            <AnimatePresence>
            {activeSection === id && (
                <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="overflow-hidden"
                >
                    <div className="p-4 bg-gray-50/50">{children}</div>
                </motion.div>
            )}
            </AnimatePresence>
        </div>
    );
    
    if (submissionStatus === 'success') {
        return (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-center py-20 bg-white rounded-xl shadow-lg">
                <CheckCircleIcon className="h-16 w-16 mx-auto text-green-500" />
                <h2 className="mt-4 text-2xl font-bold text-gray-800">Biodata Terkirim!</h2>
                <p className="mt-2 text-gray-600">Terima kasih telah melamar. Kami akan segera meninjau data Anda.</p>
            </motion.div>
        );
    }

    return (
        <motion.form onSubmit={handleSubmit} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }} className="bg-white p-4 sm:p-8 rounded-xl shadow-lg border border-gray-200">
            <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-mandiri-blue">FORMULIR BIODATA</h2>
                <p className="text-gray-600">HARAP DIISI LENGKAP DENGAN HURUF CETAK</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
                <div className="md:col-span-3">
                    <FormField label="Jabatan yang dilamar">
                        <TextInput type="text" value={data.appliedPosition} onChange={e => dispatch({ type: 'UPDATE_FIELD', payload: { field: 'appliedPosition', value: e.target.value } })} placeholder="e.g., Back End Developer" required/>
                    </FormField>
                </div>
                <div className="md:col-span-1 row-start-1 md:row-start-auto">
                    <PhotoUpload photo={data.photo} setPhoto={(p) => dispatch({ type: 'UPDATE_FIELD', payload: { field: 'photo', value: p } })} />
                </div>
            </div>

            <div className="space-y-2">
                <Section title="I. IDENTITAS PRIBADI" id="personal">
                    <FormRow>
                        <FormField label="Nama Lengkap"><TextInput value={data.personal.fullName} onChange={e => dispatch({ type: 'UPDATE_NESTED_FIELD', payload: { section: 'personal', field: 'fullName', value: e.target.value } })} required /></FormField>
                        <FormField label="Jenis Kelamin"><SelectInput value={data.personal.gender} onChange={e => dispatch({ type: 'UPDATE_NESTED_FIELD', payload: { section: 'personal', field: 'gender', value: e.target.value } })} required><option value="">Pilih...</option><option value="Laki-Laki">Laki-Laki</option><option value="Perempuan">Perempuan</option></SelectInput></FormField>
                        <FormField label="Tempat Lahir"><TextInput value={data.personal.birthPlace} onChange={e => dispatch({ type: 'UPDATE_NESTED_FIELD', payload: { section: 'personal', field: 'birthPlace', value: e.target.value } })} required /></FormField>
                        <FormField label="Tanggal Lahir"><TextInput type="date" value={data.personal.birthDate} onChange={e => dispatch({ type: 'UPDATE_NESTED_FIELD', payload: { section: 'personal', field: 'birthDate', value: e.target.value } })} required /></FormField>
                    </FormRow>
                     <FormRow>
                        <FormField label="Tinggi Badan (cm)"><TextInput type="number" value={data.personal.height} onChange={e => dispatch({ type: 'UPDATE_NESTED_FIELD', payload: { section: 'personal', field: 'height', value: e.target.value } })} /></FormField>
                        <FormField label="Berat Badan (kg)"><TextInput type="number" value={data.personal.weight} onChange={e => dispatch({ type: 'UPDATE_NESTED_FIELD', payload: { section: 'personal', field: 'weight', value: e.target.value } })} /></FormField>
                        <FormField label="Golongan Darah"><SelectInput value={data.personal.bloodType} onChange={e => dispatch({ type: 'UPDATE_NESTED_FIELD', payload: { section: 'personal', field: 'bloodType', value: e.target.value } })}><option value="">Pilih...</option><option>A</option><option>B</option><option>AB</option><option>O</option></SelectInput></FormField>
                         <FormField label="Agama"><SelectInput value={data.personal.religion} onChange={e => dispatch({ type: 'UPDATE_NESTED_FIELD', payload: { section: 'personal', field: 'religion', value: e.target.value } })}><option value="">Pilih...</option><option>Islam</option><option>Kristen Protestan</option><option>Katolik</option><option>Hindu</option><option>Budha</option><option>Kong Hu Cu</option></SelectInput></FormField>
                    </FormRow>
                    <FormRow>
                        <FormField label="Alamat Tinggal Saat Ini"><TextInput value={data.personal.address} onChange={e => dispatch({ type: 'UPDATE_NESTED_FIELD', payload: { section: 'personal', field: 'address', value: e.target.value } })} /></FormField>
                        <FormField label="Kode Pos"><TextInput value={data.personal.postalCode} onChange={e => dispatch({ type: 'UPDATE_NESTED_FIELD', payload: { section: 'personal', field: 'postalCode', value: e.target.value } })} /></FormField>
                        <FormField label="Alamat Sesuai KTP"><TextInput value={data.personal.ktpAddress} onChange={e => dispatch({ type: 'UPDATE_NESTED_FIELD', payload: { section: 'personal', field: 'ktpAddress', value: e.target.value } })} /></FormField>
                        <FormField label="Kode Pos KTP"><TextInput value={data.personal.ktpPostalCode} onChange={e => dispatch({ type: 'UPDATE_NESTED_FIELD', payload: { section: 'personal', field: 'ktpPostalCode', value: e.target.value } })} /></FormField>
                    </FormRow>
                     <FormRow>
                        <FormField label="No. Telepon/HP"><TextInput value={data.personal.phone} onChange={e => dispatch({ type: 'UPDATE_NESTED_FIELD', payload: { section: 'personal', field: 'phone', value: e.target.value } })} required /></FormField>
                        <FormField label="Alamat E-mail"><TextInput type="email" value={data.personal.email} onChange={e => dispatch({ type: 'UPDATE_NESTED_FIELD', payload: { section: 'personal', field: 'email', value: e.target.value } })} required /></FormField>
                        <FormField label="No. KTP"><TextInput value={data.personal.ktpNumber} onChange={e => dispatch({ type: 'UPDATE_NESTED_FIELD', payload: { section: 'personal', field: 'ktpNumber', value: e.target.value } })} required /></FormField>
                        <FormField label="KTP Berlaku Hingga"><TextInput value={data.personal.ktpExpiry} onChange={e => dispatch({ type: 'UPDATE_NESTED_FIELD', payload: { section: 'personal', field: 'ktpExpiry', value: e.target.value } })} /></FormField>
                    </FormRow>
                </Section>

                <Section title="II. SUSUNAN KELUARGA" id="family">
                    <FormRow>
                        <FormField label="Status Sipil">
                            <SelectInput value={data.family.civilStatus} onChange={e => dispatch({ type: 'UPDATE_NESTED_FIELD', payload: { section: 'family', field: 'civilStatus', value: e.target.value }})}>
                                <option value="">Pilih...</option>
                                <option value="Belum Menikah">Belum Menikah</option>
                                <option value="Sudah Menikah">Sudah Menikah</option>
                                <option value="Janda">Janda</option>
                                <option value="Duda">Duda</option>
                            </SelectInput>
                        </FormField>
                         {data.family.civilStatus === 'Sudah Menikah' && <FormField label="Tanggal Menikah"><TextInput type="date" value={data.family.marriageDate} onChange={e => dispatch({ type: 'UPDATE_NESTED_FIELD', payload: { section: 'family', field: 'marriageDate', value: e.target.value }})} /></FormField>}
                         {(data.family.civilStatus === 'Janda' || data.family.civilStatus === 'Duda') && <FormField label="Tanggal Bercerai/Meninggal"><TextInput type="date" value={data.family.divorceDate} onChange={e => dispatch({ type: 'UPDATE_NESTED_FIELD', payload: { section: 'family', field: 'divorceDate', value: e.target.value }})} /></FormField>}
                    </FormRow>

                    {['Sudah Menikah', 'Janda', 'Duda'].includes(data.family.civilStatus) && (
                        <>
                            <h4 className="font-bold text-md text-gray-800 mt-6 mb-2">Istri/Suami & Anak-Anak</h4>
                            {data.family.spouseAndChildren.map((member, index) => (
                                <DynamicListItem key={member.id} id={member.id} onRemove={(id) => dispatch({ type: 'REMOVE_NESTED_ARRAY_ITEM', payload: { section: 'family', nestedKey: 'spouseAndChildren', id }})}>
                                    <FormRow>
                                        <FormField label="Nama"><TextInput value={member.name} onChange={e => dispatch({ type: 'UPDATE_NESTED_ARRAY_ITEM', payload: { section: 'family', nestedKey: 'spouseAndChildren', index, field: 'name', value: e.target.value }})} /></FormField>
                                        <FormField label="L/P"><SelectInput value={member.gender} onChange={e => dispatch({ type: 'UPDATE_NESTED_ARRAY_ITEM', payload: { section: 'family', nestedKey: 'spouseAndChildren', index, field: 'gender', value: e.target.value }})}><option value="">...</option><option value="L">L</option><option value="P">P</option></SelectInput></FormField>
                                        <FormField label="Tgl. Lahir"><TextInput type="date" value={member.birthDate} onChange={e => dispatch({ type: 'UPDATE_NESTED_ARRAY_ITEM', payload: { section: 'family', nestedKey: 'spouseAndChildren', index, field: 'birthDate', value: e.target.value }})} /></FormField>
                                        <FormField label="Pendidikan"><TextInput value={member.education} onChange={e => dispatch({ type: 'UPDATE_NESTED_ARRAY_ITEM', payload: { section: 'family', nestedKey: 'spouseAndChildren', index, field: 'education', value: e.target.value }})} /></FormField>
                                        <FormField label="Pekerjaan"><TextInput value={member.occupation} onChange={e => dispatch({ type: 'UPDATE_NESTED_ARRAY_ITEM', payload: { section: 'family', nestedKey: 'spouseAndChildren', index, field: 'occupation', value: e.target.value }})} /></FormField>
                                    </FormRow>
                                </DynamicListItem>
                            ))}
                            <AddButton text="Tambah Anggota Keluarga" onClick={() => dispatch({ type: 'ADD_NESTED_ARRAY_ITEM', payload: { section: 'family', nestedKey: 'spouseAndChildren', newItem: { id: crypto.randomUUID(), name: '', gender: '', birthDate: '', education: '', occupation: '' } }})} />
                        </>
                    )}

                    <h4 className="font-bold text-md text-gray-800 mt-6 mb-2">Orang Tua & Saudara Kandung</h4>
                     {data.family.parentsAndSiblings.map((p, index) => (
                         <div key={p.id} className="p-3 mb-2 border rounded-md bg-white relative">
                             {index > 1 && ( // Allow deleting only siblings, not parents
                                 <button type="button" onClick={() => dispatch({ type: 'REMOVE_NESTED_ARRAY_ITEM', payload: { section: 'family', nestedKey: 'parentsAndSiblings', id: p.id }})} className="absolute top-2 right-2 text-gray-400 hover:text-red-600"><TrashIcon className="h-5 w-5"/></button>
                             )}
                             <FormRow>
                                <FormField label="Hubungan"><TextInput value={p.relationship} onChange={e => dispatch({ type: 'UPDATE_NESTED_ARRAY_ITEM', payload: { section: 'family', nestedKey: 'parentsAndSiblings', index, field: 'relationship', value: e.target.value } })} disabled={index < 2} /></FormField>
                                <FormField label="Nama"><TextInput value={p.name} onChange={e => dispatch({ type: 'UPDATE_NESTED_ARRAY_ITEM', payload: { section: 'family', nestedKey: 'parentsAndSiblings', index, field: 'name', value: e.target.value } })} /></FormField>
                                <FormField label="L/P"><SelectInput value={p.gender} onChange={e => dispatch({ type: 'UPDATE_NESTED_ARRAY_ITEM', payload: { section: 'family', nestedKey: 'parentsAndSiblings', index, field: 'gender', value: e.target.value } })} disabled={index < 2}><option value="">...</option><option value="L">L</option><option value="P">P</option></SelectInput></FormField>
                                <FormField label="Tgl. Lahir"><TextInput type="date" value={p.birthDate} onChange={e => dispatch({ type: 'UPDATE_NESTED_ARRAY_ITEM', payload: { section: 'family', nestedKey: 'parentsAndSiblings', index, field: 'birthDate', value: e.target.value } })} /></FormField>
                                <FormField label="Pendidikan Terakhir"><TextInput value={p.lastEducation} onChange={e => dispatch({ type: 'UPDATE_NESTED_ARRAY_ITEM', payload: { section: 'family', nestedKey: 'parentsAndSiblings', index, field: 'lastEducation', value: e.target.value } })} /></FormField>
                                <FormField label="Pekerjaan"><TextInput value={p.occupation} onChange={e => dispatch({ type: 'UPDATE_NESTED_ARRAY_ITEM', payload: { section: 'family', nestedKey: 'parentsAndSiblings', index, field: 'occupation', value: e.target.value } })} /></FormField>
                             </FormRow>
                         </div>
                     ))}
                     <AddButton text="Tambah Saudara Kandung" onClick={() => dispatch({ type: 'ADD_NESTED_ARRAY_ITEM', payload: { section: 'family', nestedKey: 'parentsAndSiblings', newItem: { id: crypto.randomUUID(), relationship: 'Saudara', name: '', gender: '', birthDate: '', lastEducation: '', occupation: '' } }})} />
                </Section>
                
                <Section title="III. RIWAYAT PENDIDIKAN FORMAL" id="education">
                     <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50"><tr><th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tingkat</th><th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama Institusi</th><th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Jurusan</th><th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tahun Lulus</th><th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">IPK/NEM</th></tr></thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                            {data.education.formal.map((edu, index) => (
                                <tr key={edu.level}>
                                    <td className="px-3 py-2 whitespace-nowrap text-sm font-semibold text-gray-900">{edu.level}</td>
                                    <td className="px-3 py-2"><TextInput type="text" value={edu.schoolName} onChange={e => dispatch({ type: 'UPDATE_NESTED_ARRAY_ITEM', payload: { section: 'education', nestedKey: 'formal', index, field: 'schoolName', value: e.target.value } })}/></td>
                                    <td className="px-3 py-2"><TextInput type="text" value={edu.major} onChange={e => dispatch({ type: 'UPDATE_NESTED_ARRAY_ITEM', payload: { section: 'education', nestedKey: 'formal', index, field: 'major', value: e.target.value } })}/></td>
                                    <td className="px-3 py-2"><TextInput type="text" value={edu.graduationYear} onChange={e => dispatch({ type: 'UPDATE_NESTED_ARRAY_ITEM', payload: { section: 'education', nestedKey: 'formal', index, field: 'graduationYear', value: e.target.value } })}/></td>
                                    <td className="px-3 py-2"><TextInput type="text" value={edu.gpa} onChange={e => dispatch({ type: 'UPDATE_NESTED_ARRAY_ITEM', payload: { section: 'education', nestedKey: 'formal', index, field: 'gpa', value: e.target.value } })}/></td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                </Section>

                <Section title="IV. PENDIDIKAN NON-FORMAL / KURSUS" id="nonFormal">
                    {data.nonFormalEducation.map((course, index) => (
                        <DynamicListItem key={course.id} id={course.id} onRemove={id => dispatch({ type: 'REMOVE_ARRAY_ITEM', payload: { section: 'nonFormalEducation', id }})}>
                            <FormRow>
                                <FormField label="Nama Kursus/Pelatihan"><TextInput value={course.courseName} onChange={e => dispatch({ type: 'UPDATE_ARRAY_ITEM', payload: { section: 'nonFormalEducation', index, field: 'courseName', value: e.target.value }})} /></FormField>
                                <FormField label="Penyelenggara"><TextInput value={course.organizer} onChange={e => dispatch({ type: 'UPDATE_ARRAY_ITEM', payload: { section: 'nonFormalEducation', index, field: 'organizer', value: e.target.value }})} /></FormField>
                                <FormField label="Tahun"><TextInput value={course.year} onChange={e => dispatch({ type: 'UPDATE_ARRAY_ITEM', payload: { section: 'nonFormalEducation', index, field: 'year', value: e.target.value }})} /></FormField>
                                <FormField label="Durasi"><TextInput value={course.duration} onChange={e => dispatch({ type: 'UPDATE_ARRAY_ITEM', payload: { section: 'nonFormalEducation', index, field: 'duration', value: e.target.value }})} /></FormField>
                            </FormRow>
                        </DynamicListItem>
                    ))}
                    <AddButton text="Tambah Kursus" onClick={() => dispatch({ type: 'ADD_ARRAY_ITEM', payload: { section: 'nonFormalEducation', newItem: { id: crypto.randomUUID(), courseName: '', organizer: '', year: '', duration: '', certificate: 'Tidak', fundedBy: '' } }})} />
                </Section>
                
                 <Section title="V. KETERAMPILAN" id="skills">
                     <h4 className="font-bold text-md text-gray-800 mb-2">Bahasa Asing</h4>
                     {data.skills.language.languages.map((lang, index) => (
                         <DynamicListItem key={lang.id} id={lang.id} onRemove={id => dispatch({ type: 'REMOVE_NESTED_ARRAY_ITEM', payload: { section: 'skills', nestedKey: 'languages', id }})}>
                              <FormRow className="mb-0">
                                <FormField label="Bahasa" className="sm:col-span-2"><TextInput value={lang.name} onChange={e => dispatch({ type: 'UPDATE_NESTED_ARRAY_ITEM', payload: { section: 'skills', nestedKey: 'languages', index, field: 'name', value: e.target.value }})} /></FormField>
                                <FormField label="Tingkat Kemahiran" className="sm:col-span-2"><SelectInput value={lang.level} onChange={e => dispatch({ type: 'UPDATE_NESTED_ARRAY_ITEM', payload: { section: 'skills', nestedKey: 'languages', index, field: 'level', value: e.target.value }})}><option value="">Pilih...</option><option value="Aktif">Aktif</option><option value="Pasif">Pasif</option></SelectInput></FormField>
                              </FormRow>
                         </DynamicListItem>
                     ))}
                     <AddButton text="Tambah Bahasa" onClick={() => dispatch({ type: 'ADD_NESTED_ARRAY_ITEM', payload: { section: 'skills', nestedKey: 'languages', newItem: { id: crypto.randomUUID(), name: '', level: '' } }})} />
                 </Section>
                 
                 <Section title="VI. PENGALAMAN ORGANISASI" id="organizations">
                    {data.organizations.map((org, index) => (
                        <DynamicListItem key={org.id} id={org.id} onRemove={id => dispatch({ type: 'REMOVE_ARRAY_ITEM', payload: { section: 'organizations', id }})}>
                           <FormRow>
                                <FormField label="Nama Organisasi"><TextInput value={org.name} onChange={e => dispatch({ type: 'UPDATE_ARRAY_ITEM', payload: { section: 'organizations', index, field: 'name', value: e.target.value }})} /></FormField>
                                <FormField label="Jabatan"><TextInput value={org.position} onChange={e => dispatch({ type: 'UPDATE_ARRAY_ITEM', payload: { section: 'organizations', index, field: 'position', value: e.target.value }})} /></FormField>
                                <FormField label="Jenis Organisasi"><TextInput value={org.type} onChange={e => dispatch({ type: 'UPDATE_ARRAY_ITEM', payload: { section: 'organizations', index, field: 'type', value: e.target.value }})} /></FormField>
                                <FormField label="Tahun"><TextInput value={org.year} onChange={e => dispatch({ type: 'UPDATE_ARRAY_ITEM', payload: { section: 'organizations', index, field: 'year', value: e.target.value }})} /></FormField>
                           </FormRow>
                        </DynamicListItem>
                    ))}
                    <AddButton text="Tambah Organisasi" onClick={() => dispatch({ type: 'ADD_ARRAY_ITEM', payload: { section: 'organizations', newItem: { id: crypto.randomUUID(), name: '', position: '', type: '', year: '' } }})} />
                 </Section>

                <Section title="VII. PENGALAMAN KERJA" id="work">
                    {data.workExperience.map((exp, index) => (
                        <DynamicListItem key={exp.id} id={exp.id} onRemove={id => dispatch({ type: 'REMOVE_ARRAY_ITEM', payload: { section: 'workExperience', id }})}>
                             <FormRow>
                                <FormField label="Dari (Tahun)"><TextInput type="text" value={exp.from} onChange={e => dispatch({ type: 'UPDATE_ARRAY_ITEM', payload: { section: 'workExperience', index, field: 'from', value: e.target.value } })}/></FormField>
                                <FormField label="Sampai (Tahun)"><TextInput type="text" value={exp.to} onChange={e => dispatch({ type: 'UPDATE_ARRAY_ITEM', payload: { section: 'workExperience', index, field: 'to', value: e.target.value } })}/></FormField>
                                <FormField label="Nama Perusahaan & Alamat"><TextInput type="text" value={exp.companyInfo} onChange={e => dispatch({ type: 'UPDATE_ARRAY_ITEM', payload: { section: 'workExperience', index, field: 'companyInfo', value: e.target.value } })}/></FormField>
                                <FormField label="Jabatan & Status"><TextInput type="text" value={exp.positionStatus} onChange={e => dispatch({ type: 'UPDATE_ARRAY_ITEM', payload: { section: 'workExperience', index, field: 'positionStatus', value: e.target.value } })}/></FormField>
                                <FormField label="Gaji & Tunjangan"><TextInput type="text" value={exp.salary} onChange={e => dispatch({ type: 'UPDATE_ARRAY_ITEM', payload: { section: 'workExperience', index, field: 'salary', value: e.target.value } })}/></FormField>
                                <FormField label="Alasan Berhenti"><TextInput type="text" value={exp.reasonForLeaving} onChange={e => dispatch({ type: 'UPDATE_ARRAY_ITEM', payload: { section: 'workExperience', index, field: 'reasonForLeaving', value: e.target.value } })}/></FormField>
                             </FormRow>
                        </DynamicListItem>
                    ))}
                    <AddButton text="Tambah Pengalaman Kerja" onClick={() => dispatch({ type: 'ADD_ARRAY_ITEM', payload: { section: 'workExperience', newItem: { id: crypto.randomUUID(), from: '', to: '', companyInfo: '', positionStatus: '', isContract: false, isPermanent: false, salary: '', reasonForLeaving: '' } } })} />
                </Section>
                
                 <Section title="X. PERNYATAAN" id="declaration">
                    <p className="text-sm text-gray-600 mb-4">Dengan ini saya menyatakan bahwa semua informasi yang saya berikan adalah benar dan dapat dipertanggungjawabkan.</p>
                    <FormRow>
                        <FormField label="Kota"><TextInput value={data.declaration.city} onChange={e => dispatch({ type: 'UPDATE_NESTED_FIELD', payload: { section: 'declaration', field: 'city', value: e.target.value } })} required /></FormField>
                        <FormField label="Tanggal"><TextInput type="date" value={data.declaration.date} onChange={e => dispatch({ type: 'UPDATE_NESTED_FIELD', payload: { section: 'declaration', field: 'date', value: e.target.value } })} required /></FormField>
                        <FormField label="Nama Lengkap Pelamar"><TextInput value={data.declaration.fullName || data.personal.fullName} onChange={e => dispatch({ type: 'UPDATE_NESTED_FIELD', payload: { section: 'declaration', field: 'fullName', value: e.target.value } })} placeholder="Isi sesuai nama Anda" required/></FormField>
                    </FormRow>
                </Section>
            </div>
            
            <div className="mt-10 pt-6 border-t border-gray-200 flex flex-col sm:flex-row justify-end items-center gap-4">
                 {submissionStatus === 'error' && <p className="text-red-600 text-sm">Gagal mengirim biodata. Coba lagi.</p>}
                <motion.button type="submit" disabled={isSubmitting} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 border border-transparent bg-mandiri-blue text-white font-medium rounded-md shadow-sm hover:bg-mandiri-blue/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-mandiri-blue transition-all disabled:opacity-50">
                    <PaperAirplaneIcon className="h-5 w-5" />
                    {isSubmitting ? 'Mengirim...' : 'Submit Biodata'}
                </motion.button>
            </div>
        </motion.form>
    );
};

export default ApplicantForm;