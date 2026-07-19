import { CATEGORIES } from '../data/mockData'

interface CategoryFilterProps {
  selected: string
  onChange: (cat: string) => void
  className?: string
}

export default function CategoryFilter({ selected, onChange, className = '' }: CategoryFilterProps) {
  return (
    <div className={`flex gap-2 overflow-x-auto scrollbar-hide pb-1 ${className}`}>
      {CATEGORIES.map(cat => (
        <button
          key={cat}
          onClick={() => onChange(cat)}
          className={`shrink-0 h-9 px-4 rounded-full text-sm font-medium transition-all duration-200 cursor-pointer ${
            selected === cat
              ? 'bg-primary text-primary-foreground shadow-sm'
              : 'bg-secondary text-secondary-foreground hover:bg-muted'
          }`}
        >
          {cat}
        </button>
      ))}
    </div>
  )
}
