interface ButtonProps {
    children: React.ReactNode;
    onClick?: () => void;
    className?: string;
  }
  
  export default function Button({ children, onClick, className = '' }: ButtonProps) {
    return (
      <button onClick={onClick} className={`bg-raqqa-green text-white px-4 py-2 rounded ${className}`}>
        {children}
      </button>
    );
  }
  