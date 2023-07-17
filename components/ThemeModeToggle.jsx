import {useContext, useEffect} from 'react';
import {ThemeContext} from "~/app/provider";

function DarkModeToggle() {
  const {darkMode, setDarkMode} = useContext(ThemeContext);
  const colorTheme = darkMode ? 'dark' : '';

  const handleChange = () => {
    setDarkMode(!darkMode);
  }

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('dark');

    if (darkMode) {
      root.classList.add(colorTheme);
    }
  }, [darkMode]);


  return (
    <div>
        {darkMode ?
          <svg onClick={() => handleChange()} className="w-7 h-7 cursor-pointer" version="1.1" id="Layer_1" viewBox="0 0 512 512">
          <path style={{fill:"#3A5D74"}} d="M509.671,357.063c-2.543-2.825-6.575-3.767-10.106-2.361c-30.773,12.254-63.458,18.466-97.147,18.466
            c-27.953,0-55.472-4.352-81.798-12.938l-26.99-10.488c-45.469-20.629-84.048-53.639-111.572-95.468
            c-28.28-42.982-43.229-93.016-43.229-144.692c0-33.69,6.213-66.373,18.466-97.144c1.406-3.531,0.463-7.564-2.361-10.106
            c-2.825-2.542-6.934-3.054-10.299-1.286C55.421,47.988,0,139.897,0,240.905c0,149.48,121.612,271.092,271.092,271.092
            c101.01,0,192.92-55.421,239.863-144.636C512.725,363.998,512.212,359.888,509.671,357.063z"/>
          <path style={{fill:"#231F20", opacity:"0.1"}} d="M284.14,498.382c-149.48,0-271.092-121.612-271.092-271.092
            c0-67.947,25.079-131.776,68.654-180.571C30.126,96.924,0,166.44,0,240.905c0,149.48,121.612,271.092,271.092,271.092
            c78.445,0,151.394-33.43,202.064-90.15C423.403,470.261,356.082,498.382,284.14,498.382z"/>
          </svg>
          :
          <svg onClick={() => handleChange()} className="w-8 h-8 cursor-pointer" viewBox="0 0 36 36" aria-hidden="true" role="img" preserveAspectRatio="xMidYMid meet">
          <path style={{fill:"#FFAC33"}}
                d="M16 2s0-2 2-2s2 2 2 2v2s0 2-2 2s-2-2-2-2V2zm18 14s2 0 2 2s-2 2-2 2h-2s-2 0-2-2s2-2 2-2h2zM4 16s2 0 2 2s-2 2-2 2H2s-2 0-2-2s2-2 2-2h2zm5.121-8.707s1.414 1.414 0 2.828s-2.828 0-2.828 0L4.878 8.708s-1.414-1.414 0-2.829c1.415-1.414 2.829 0 2.829 0l1.414 1.414zm21 21s1.414 1.414 0 2.828s-2.828 0-2.828 0l-1.414-1.414s-1.414-1.414 0-2.828s2.828 0 2.828 0l1.414 1.414zm-.413-18.172s-1.414 1.414-2.828 0s0-2.828 0-2.828l1.414-1.414s1.414-1.414 2.828 0s0 2.828 0 2.828l-1.414 1.414zm-21 21s-1.414 1.414-2.828 0s0-2.828 0-2.828l1.414-1.414s1.414-1.414 2.828 0s0 2.828 0 2.828l-1.414 1.414zM16 32s0-2 2-2s2 2 2 2v2s0 2-2 2s-2-2-2-2v-2z"></path>
          <circle style={{fill:"#FFAC33"}} cx="18" cy="18" r="10"></circle>
          </svg>
        }
    </div>
  );
}

export default DarkModeToggle;
