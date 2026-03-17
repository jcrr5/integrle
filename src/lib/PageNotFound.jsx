import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';

export default function PageNotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4">
      <h1 className="text-6xl font-bold mb-2">
        <span className="text-[#5B9E7A]">4</span>0<span className="text-[#5B9E7A]">4</span>
      </h1>
      <p className="text-sm opacity-50 mb-8">Page not found</p>
      <Link
        to="/"  // <--- Change this from createPageUrl('Home')
        className="px-6 py-2.5 rounded-xl text-sm font-medium bg-[#A8D5BA] text-[#1a3a28] hover:bg-[#96CDAB] transition-colors"
      >
        Back to Integrle
      </Link>
    </div>
  );
}