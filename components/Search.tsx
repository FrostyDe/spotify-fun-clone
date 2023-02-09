import { SearchIcon } from "@heroicons/react/outline";
import React, { FunctionComponent } from "react";

type SearchProps = {
  search: string;
  setSearch(e: any): void;
  setOpenSidebar: any;
};

const Search: React.FunctionComponent<SearchProps> = ({
  search,
  setSearch,
  setOpenSidebar,
}) => {
  const useSearch = (e: any) => {
    setSearch(e.target.value);
    localStorage.setItem("searchValue", e.target.value);
  };

  const handleKeyDown = (e: any) => {
    if (e.key === "Enter") {
      setOpenSidebar(false);
    }
  };

  return (
    <div className="max-w-[235px] h-10 bg-[#494949] text-[#C5C5C5] rounded-xl my-10 flex items-center justify-between overflow-hidden p-[10px]">
      <SearchIcon className="h-5 w-5" />
      <input
        type="text"
        value={search}
        onKeyDown={(e) => handleKeyDown(e)}
        onChange={(e) => useSearch(e)}
        placeholder="Search"
        className="bg-[#494949] block w-full focus:outline-none ml-2 text-sm"
      />
    </div>
  );
};

export default Search;
