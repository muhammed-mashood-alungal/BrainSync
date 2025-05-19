'use client'

import { ReactNode, useEffect, useRef } from 'react'

interface BaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: () => void;
  title: string;
  submitText?: string;
  children: ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | 'full';
}

export default function BaseModal({
  isOpen,
  onClose,
  onSubmit,
  title,
  submitText = "Update",
  children,
  size = 'md'
}: BaseModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      // Prevent body scrolling when modal is open
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  // Close on escape key press
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscKey);
    }

    return () => {
      document.removeEventListener('keydown', handleEscKey);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Modal size classes
  // const sizeClasses = {
  //   sm: 'max-w-sm',
  //   md: 'max-w-md',
  //   lg: 'max-w-lg',
  //   xl: 'max-w-xl',
  // };

   const sizeClasses = {
    sm: 'max-w-sm', // 384px
    md: 'max-w-md', // 448px
    lg: 'max-w-lg', // 512px
    xl: 'max-w-xl', // 576px
    '2xl': 'max-w-2xl', // 672px
    '3xl': 'max-w-3xl', // 768px
    '4xl': 'max-w-4xl', // 896px
    'full': 'max-w-[90%]', // 90% of viewport width
  };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center  bg-[rgba(0,0,0,0.46)]">
      <div 
        ref={modalRef}
        className={`${sizeClasses[size]} w-full mx-4 bg-[#1b1b1d]  rounded-md shadow-lg overflow-hidden`}
      >
        {/* Modal Header */}
        <div className="flex justify-between items-center border-b border-gray-700 px-6 py-4">
          <h2 className="text-xl font-semibold text-white">{title}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
            aria-label="Close"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>

        {/* Modal Content */}
        <div className="px-6 py-4">
          {children}
        </div>

        {/* Modal Footer */}
        {onSubmit && (
          <div className="flex justify-end px-6 py-4 border-t border-gray-700">
            <button
              onClick={onSubmit}
              className="px-6 py-2 bg-[#00D2D9] text-[#1E1E1E] font-medium rounded-md hover:bg-[#00BDC3] transition-colors"
            >
              {submitText}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}