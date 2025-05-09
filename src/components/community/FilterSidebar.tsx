'use client';

import { useState } from 'react';

// Define the structure of your filters
// This is highly dependent on what you want to filter by (e.g., industry, skills, roles)
export interface FilterValues {
  industry?: string;
  skills?: string[];
  // Add more filter criteria as needed
}

interface FilterSidebarProps {
  onFilterChange: (filters: FilterValues) => void;
  // You might want to pass initial filter values or available options as props
}

export default function FilterSidebar({ onFilterChange }: FilterSidebarProps) {
  const [filters, setFilters] = useState<FilterValues>({});

  // Example: Handler for industry filter
  const handleIndustryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newFilters = { ...filters, industry: e.target.value || undefined };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  // TODO: Implement handlers for other filters (e.g., skills checkboxes)

  return (
    <aside className="w-full md:w-64 lg:w-72 p-4 border border-border rounded-lg shadow-sm bg-card">
      <h3 className="text-lg font-semibold mb-4 text-card-foreground">Filtrar Por</h3>
      
      {/* Example: Industry Filter (Dropdown) */}
      <div className="mb-4">
        <label htmlFor="industry-filter" className="block text-sm font-medium text-muted-foreground mb-1">
          Industria
        </label>
        <select 
          id="industry-filter"
          value={filters.industry || ''}
          onChange={handleIndustryChange}
          className="block w-full p-2 border border-border rounded-md bg-background text-foreground text-sm focus:ring-primary focus:border-primary"
        >
          <option value="">Todas</option>
          <option value="tech">Tecnología</option>
          <option value="saas">SaaS</option>
          <option value="ecommerce">E-commerce</option>
          <option value="health">Salud</option>
          {/* TODO: Populate options dynamically or expand */}
        </select>
      </div>

      {/* Placeholder for Skills Filter */}
      <div className="mb-4">
        <h4 className="text-sm font-medium text-muted-foreground mb-1">Habilidades</h4>
        <p className="text-xs text-muted-foreground italic">(Próximamente: filtros por habilidades)</p>
        {/* TODO: Implement skill selection (e.g., checkboxes, multi-select) */}
      </div>

      {/* Add more filter sections here */}

      {/* <button 
        onClick={() => onFilterChange(filters)} 
        className="w-full px-4 py-2 bg-accent text-accent-foreground rounded-md text-sm hover:bg-accent/90"
      >
        Aplicar Filtros
      </button> */}
      <p className="text-xs text-muted-foreground mt-4">
        Los filtros se aplican automáticamente al cambiar.
      </p>
    </aside>
  );
} 