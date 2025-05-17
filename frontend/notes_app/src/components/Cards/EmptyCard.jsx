import React from 'react';
import { LuNotebook } from 'react-icons/lu';

const EmptyCard = ({ message }) => {
  return (
    <div className="flex flex-col items-center justify-center text-center py-20 text-slate-500">
      <LuNotebook className="text-5xl mb-4 text-slate-400" />
      <h2 className="text-xl font-semibold mb-2">{message}</h2>
      <p className="text-sm">Try adding a new note or adjusting your search.</p>
    </div>
  );
};

export default EmptyCard;
