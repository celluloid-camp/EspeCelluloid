import { useEffect } from 'react';



export default function useExternalScripts(url: string) {
  useEffect(() => {
    const head = document.querySelector("head");
    const script = document.createElement("script");

    script.setAttribute("src", url);
    script.setAttribute("async", "true");
    // script.setAttribute("defer", 'true');

    // head?.appendChild(script);

    document.body.appendChild(script);

    return () => {
      // head?.removeChild(script);
      document.body.removeChild(script);

    };
  }, [url]);
};