import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

interface BreadcrumbItem {
  label: string;
  href?: string;
  current?: boolean;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items }) => {
  return (
    <nav className="flex items-center space-x-2 text-sm font-plus-jakarta">
      <Link 
        to="/dashboard" 
        className="text-white/60 hover:text-white transition-colors flex items-center space-x-1"
      >
        <Home className="w-4 h-4" />
        <span>Dashboard</span>
      </Link>
      
      {items.map((item, index) => (
        <React.Fragment key={index}>
          <ChevronRight className="w-4 h-4 text-white/40" />
          {item.current ? (
            <span className="text-white font-medium">{item.label}</span>
          ) : (
            <Link 
              to={item.href || '#'} 
              className="text-white/60 hover:text-white transition-colors"
            >
              {item.label}
            </Link>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
};

export default Breadcrumbs;