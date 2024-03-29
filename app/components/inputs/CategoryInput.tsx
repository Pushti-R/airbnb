'use client';

import { IconType } from "react-icons";

interface CategoryBoxProps {
  icon: IconType,
  label: string;
  selected?: boolean;
  onClick: (value: string) => void;
}

const CategoryBox: React.FC<CategoryBoxProps> = ({
  icon: Icon, label, selected, onClick }) => {
  return ( 
    <div onClick={() => onClick(label)}
      className={`rounded-xl border-2 p-4 flex flex-col gap-3 hover:border-black dark:hover:border-white transition cursor-pointer ${selected ? 'border-black dark:border-white' : 'border-neutral-200 dark:border-black'}`}>
      <Icon size={30} />
      <div className="font-semibold">
        {label}
      </div>
    </div>
   );
}
 
export default CategoryBox;