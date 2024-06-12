// src/components/Root.tsx

import React from 'react';
import LoginButton from '../components/ui/login-button';

const Root: React.FC = () => {
  return (
    <div className="w-screen h-screen bg-orange-50">
      <div className="w-full h-full flex items-center justify-center">
        <LoginButton />
        <div className="text-4xl font-bold text-black">Multiset</div>
      </div>
    </div>
  );
};

export default Root;
