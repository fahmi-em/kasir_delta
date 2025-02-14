"use client"
import React, { useState } from 'react';

type AccordionItemProps = {
  children: React.ReactNode;
  title: React.ReactNode;
};

const Accordion: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <div className="space-y-2">{children}</div>;
};

const AccordionItem: React.FC<AccordionItemProps> = ({ children, title }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <div
        onClick={() => setIsOpen((prev) => !prev)}
        className="cursor-pointer p-2 bg-gray-200 rounded-md dark:bg-[#413F42]"
      >
        <span className="text-lg font-medium ml-2">{title}</span>
      </div>
      {isOpen && <div className="p-4">{children}</div>}
    </div>
  );
};

const AccordionTrigger: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <>{children}</>;
};

const AccordionContent: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <>{children}</>;
};

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent };
