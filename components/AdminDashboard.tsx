import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { UserGroupIcon, DocumentArrowDownIcon, TableCellsIcon } from '@heroicons/react/24/solid';
import { ApplicantData } from '../types';
import { generatePdf } from '../services/pdfGenerator';
import { generateRecapExcel } from '../services/excelGenerator';
import SectionHeader from './SectionHeader';
import { collection, onSnapshot, query } from 'firebase/firestore';
import { db } from '../firebaseConfig';

const AdminDashboard: React.FC = () => {
  const [applicants, setApplicants] = useState<ApplicantData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, "applicants"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const applicantsData: ApplicantData[] = [];
      querySnapshot.forEach((doc) => {
        applicantsData.push(doc.data() as ApplicantData);
      });
      setApplicants(applicantsData);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching applicants: ", error);
      setLoading(false);
    });

    return () => unsubscribe(); // Cleanup listener on unmount
  }, []);

  const handleExportAll = () => {
    if (applicants.length > 0) {
      generateRecapExcel(applicants);
    } else {
      alert("Belum ada data pelamar untuk diexport.");
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }} 
      animate={{ opacity: 1, y: 0 }}
      className="bg-white p-4 sm:p-8 rounded-xl shadow-lg border border-gray-200"
    >
      <SectionHeader title="Admin Dashboard" />

      <div className="flex flex-col sm:flex-row justify-between items-center my-6">
        <div className="flex items-center gap-3 text-gray-700">
          <UserGroupIcon className="h-8 w-8 text-mandiri-blue"/>
          <div>
            <p className="text-2xl font-bold">{applicants.length}</p>
            <p className="text-sm text-gray-500">Total Pelamar</p>
          </div>
        </div>
        <motion.button
            onClick={handleExportAll}
            disabled={applicants.length === 0}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="mt-4 sm:mt-0 w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2 border border-green-600 text-green-600 font-medium rounded-md shadow-sm hover:bg-green-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
            <TableCellsIcon className="h-5 w-5"/>
            Export Rekap ke Excel
        </motion.button>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama Lengkap</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Posisi Dilamar</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Telepon</th>
              <th scope="col" className="relative px-6 py-3">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {loading ? (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                  Memuat data...
                </td>
              </tr>
            ) : applicants.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                  Belum ada data pelamar yang masuk.
                </td>
              </tr>
            ) : (
              applicants.map((applicant, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{applicant.personal.fullName}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{applicant.appliedPosition}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{applicant.personal.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{applicant.personal.phone}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button 
                      onClick={() => generatePdf(applicant)} 
                      className="text-mandiri-blue hover:text-mandiri-blue/80 inline-flex items-center gap-2"
                    >
                      <DocumentArrowDownIcon className="h-4 w-4" />
                      Export PDF
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};

export default AdminDashboard;
