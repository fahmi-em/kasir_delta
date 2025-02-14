import React from 'react';

export const Card: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
      <div className="bg-white border-collapse rounded-lg shadow-lg dark:bg-[#191919]">
        {children}
      </div>
    );
  };
  
  export const CardHeader: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
      <div className="p-6  border-gray-300">
        {children}
      </div>
    );
  };
  
  export const CardTitle: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
      <h2 className="text-xl font-semibold text-black-800 ">
        {children}
      </h2>
    );
  };
  
  export const CardContent: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
      <div className="p-6">
        {children}
      </div>
    );
  };
  
  export const CardDescription: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
      <p className="text-gray-600 dark:text-gray-400">
        {children}
      </p>
    );
  };

  export const CardFooter: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
      <div className="p-6 ">
        {children}
      </div>
    );
  }
  