import React, { useEffect, useState } from "react";
import { Input } from "@material-tailwind/react";
import ResultSection from "../resultSection/resultSection";
import { findPost } from "../../api/posts";
import type { IPost } from "../../utils/types";
 

 
export function Search() {
    const [query,setQuery] = useState("")
    const [results,setResults] = useState<IPost[] >()
    const [isScolling,setIsScolling] = useState(false)
const handleSearch = async (e: { target: { value: React.SetStateAction<string>; }; })=>{
    
setQuery(e.target.value)
const result = await findPost(query)
setResults(result)
}
  useEffect(() => {
    const handleScroll = () => setIsScolling(true);

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
const handleSelectResult = ()=>{
setResults([])
}
  return (
    <div className="group relative w-[500px]" >
      <Input
        type="email"
        placeholder=" Search"
        onKeyDown={()=>{setIsScolling(false)}}
        className="focus:!border-t-gray-900 group-hover:border-2 group-hover:!border-gray-900 py-2  "
        labelProps={{
          className: "hidden",
        }}
        value={query}
        onChange={handleSearch}
        // readOnly
      />
      { results && query && !isScolling  ?

      <ResultSection results={results} onClick={handleSelectResult}/>:""
      }
      
      <div className="absolute top-[calc(50%-1px)] right-2.5 -translate-y-2/4 ">
          <span className="mr-0.5 inline-block translate-y-[1.5px] text-base">
            <i className="fa-solid fa-magnifying-glass"></i>
          </span>
          
      </div>

    </div>
      );
}