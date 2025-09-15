
import React from 'react';

interface SectionHeaderProps {
  title: string;
}

const SectionHeader: React.FC<SectionHeaderProps> = ({ title }) => {
  return (
    <div className="bg-mandiri-blue text-white font-bold p-3 rounded-md shadow-sm">
      <h3 className="text-lg">{title}</h3>
    </div>
  );
};

export default SectionHeader;
