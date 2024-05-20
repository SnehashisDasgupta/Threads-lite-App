import { useState } from "react"
import useShowToast from "./useShowToast";

const usePreviewImg = () => {
  const [imgUrl, setImgUrl] = useState(null);
  const showToast = useShowToast();

  const handleImageChange = (e) => {
    // object is stored in array in file. So files[0] is the current img object
    const file = e.target.files[0];
    // checks if file exists and the type of file is img or not
    if (file && file.type.startsWith("image/")){
      const reader = new FileReader();

      reader.onloadend = () => {
        setImgUrl(reader.result);
      }

      reader.readAsDataURL(file);

    } else {
      showToast("Invalid file type", "Please select an image file", "error");
      setImgUrl(null);
    }

  };

  return { handleImageChange, imgUrl}
}

export default usePreviewImg;