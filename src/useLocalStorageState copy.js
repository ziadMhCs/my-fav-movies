import { useEffect} from "react";

export  function useKey(key,action){

  useEffect(function () {
    function callback(e) {
      if (e.code.toLowerCase() === key.toLowerCase()) action();
    }

    document.addEventListener("keydown", callback);
    return function () {
      //CLEANUP, prevents form adding the same event listner manytimes to our component on each mount/render
      document.removeEventListener("keydown", callback);
    };
  }, [action, key]);
}

