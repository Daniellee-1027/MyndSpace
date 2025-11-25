import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'glass';
  icon?: string;
  label?: string;
}

const Button: React.FC<ButtonProps> = ({ variant = 'primary', icon, label, className = '', children, ...props }) => {
  const baseStyle = "px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2 active:scale-95";
  
  const variants = {
    primary: "bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/30",
    secondary: "bg-slate-700 hover:bg-slate-600 text-slate-100",
    danger: "bg-red-500 hover:bg-red-400 text-white",
    glass: "bg-glass hover:bg-glassDark backdrop-blur-md border border-white/10 text-white",
  };

  return (
    <button className={`${baseStyle} ${variants[variant]} ${className}`} {...props}>
      {icon && <i className={`fa-solid ${icon}`}></i>}
      {label && <span>{label}</span>}
      {children}
    </button>
  );
};

export default Button;