import { CiLinkedin } from "react-icons/ci"
import { FaGithub } from "react-icons/fa"

const Footer = () => {
    return (
        <div className='bg-slate-50 dark:bg-[#0d1117]'>
            <div className='flex justify-center align-middle mt-20 duration-200 bottom-0 transition-all ease-in-out pt-2'>
            <a href="https://www.linkedin.com/in/pushti-ratanghayra-1586a1212/" target="_blank"><CiLinkedin className='w-9 h-9 mr-4 cursor-pointer hover:scale-110' /></a> 
            <a href="https://github.com/Pushti-R" target="_blank"><FaGithub className='w-9 h-9 cursor-pointer hover:scale-110' /> </a>
            </div>
            <p className='flex text-black dark:text-[#ffff] text-[16px] justify-center items-center mt-5'>Made with Passion by Pushti R.</p>
        </div>
        
      )
}

export default Footer