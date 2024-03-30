import { useEffect, useState } from "react";


const useGetLoader = () => {
    const [loader, setLoader] = useState(true); // State to manage loader visibility

    useEffect(() => {
        // Hide the loader after 3 seconds
        const timer = setTimeout(() => {
          setLoader(false);
        }, 2000);
    
        // Clear the timer on component unmount or if content is loaded before 3 seconds
        return () => clearTimeout(timer);
      }, []); // useEffect runs only once after the component is mounted


  return {loader};
}

export default useGetLoader