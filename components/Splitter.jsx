import React, {
  createRef,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import {useMobileCheck} from "~/utils/hooks/useMobileCheck";

const SplitPaneContext = React.createContext();

const SplitPane = ({ children, ...props }) => {
  const [clientWidth, setClientWidth] = useState(450);
  const xDividerPos = useRef(null);
  const MIN_WIDTH = 400;
  const isMobile = useMobileCheck();

  const onMouseHoldDown = (e) => {
    xDividerPos.current = e.clientX;
  };

  const onMouseHoldUp = () => {
    xDividerPos.current = null;
  };

  const onMouseHoldMove = (e) => {
    if (!xDividerPos.current) {
      return;
    }

    let newClientWidth = clientWidth + e.clientX - xDividerPos.current;

    if (newClientWidth < MIN_WIDTH) {
      newClientWidth = MIN_WIDTH;
    }

    if (newClientWidth > window.innerWidth - MIN_WIDTH) {
      newClientWidth = window.innerWidth - MIN_WIDTH;
    }

    setClientWidth(newClientWidth);
    xDividerPos.current = e.clientX;
  };

  useEffect(() => {
    document.addEventListener("mouseup", onMouseHoldUp);
    document.addEventListener("mousemove", onMouseHoldMove);

    return () => {
      document.removeEventListener("mouseup", onMouseHoldUp);
      document.removeEventListener("mousemove", onMouseHoldMove);
    };
  });

  return (
    <div {...props}>
      <SplitPaneContext.Provider
        value={{
          clientWidth,
          setClientWidth,
          onMouseHoldDown,
        }}
      >
        {children}
      </SplitPaneContext.Provider>
    </div>
  );
};

export const Divider = (props) => {
  const { onMouseHoldDown } = useContext(SplitPaneContext);

  return <div {...props} onMouseDown={onMouseHoldDown} />;
};

export const SplitPaneLeft = (props) => {
  const leftRef = createRef();
  const { clientWidth, setClientWidth } = useContext(SplitPaneContext);
  const isMobile = useMobileCheck();

  useEffect(() => {
    if (!clientWidth) {
      setClientWidth(leftRef.current.clientWidth);
      return;
    }

    leftRef.current.style.minWidth = `${clientWidth}px`;
    leftRef.current.style.maxWidth = `${clientWidth}px`;

    if (isMobile) {
      leftRef.current.style.minWidth = '100%';
      leftRef.current.style.maxWidth = '100%';
    }
  }, [clientWidth, isMobile]);

  return <div {...props} className='flex flex-grow' ref={leftRef} />;
};

export const SplitPaneRight = (props) => {
  const isMobile = useMobileCheck();

  if (isMobile) return null;

  return <div {...props} className='flex flex-grow' />;
};

export default SplitPane;

