import Link from "next/link";
import { createURLSearchParams } from "@utils/createURLSearchParams";

interface FilterSectionProps {
  label: string;
  values: string[];
  paramKey: string;
  activeValues: string[];
  searchParams: {
    [key: string]: string | string[];
  };
}

const FilterSection = ({
  label,
  values,
  paramKey,
  activeValues,
  searchParams,
}: FilterSectionProps) => (
  <div className="flex flex-wrap gap-2 justify-center">
    {values.map((value) => {
      const params = createURLSearchParams(searchParams);
      const currentSet = new Set(params.getAll(paramKey));

      if (currentSet.has(value)) currentSet.delete(value);
      else currentSet.add(value);

      params.delete(paramKey);
      currentSet.forEach((t) => params.append(paramKey, String(t)));

      return (
        <Link
          key={value}
          className={`cursor-pointer px-3 py-1 rounded-full text-sm border transition ${activeValues.includes(value) ? "bg-blue-600 text-white border-blue-600" : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"}`}
          href={`?${params.toString()}`}
        >
          {label === "tag" ? `#${value}` : value}
        </Link>
      );
    })}
  </div>
);

export default FilterSection;
