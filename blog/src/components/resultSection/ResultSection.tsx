import type { IPost } from '../../utils/types';
import { Link } from 'react-router-dom';

const ResultSection = ({results ,onClick}:{results:IPost[],onClick:()=>void}) => {
    return (
        <ul className='fixed  bg-white w-[500px] h-fit rounded   flex flex-col  !items-start text-black z-10 '>
            {results?.map(r=>{
            
                return <article className='flex gap-2 items-center ml-2' ><i className="fa-solid fa-magnifying-glass"></i><Link onClick={onClick} to={`/post/${r._id}`}><li className='text-black' key={r._id}>{r?.title.split("").slice(0,50)}...</li></Link></article>
            })}
            
        </ul>
    );
}

export default ResultSection;
