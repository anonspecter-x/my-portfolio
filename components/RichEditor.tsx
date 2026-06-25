"use client";

import DefaultEditor from 'react-simple-wysiwyg';

export default function RichEditor({ value, onChange }: { value: string; onChange: (val: string) => void }) {
  return (
    <div className="bg-white dark:bg-white text-black rounded-xl overflow-hidden border border-gray-200 dark:border-gray-800">
      <DefaultEditor 
        value={value} 
        onChange={(e) => onChange(e.target.value)} 
        className="min-h-[250px]"
      />
    </div>
  );
}