import React from 'react';

const useWindowHeight = () => {

  const isClient = typeof window === 'object';

  const getSize = React.useCallback(
    () => ({
      width: isClient ? window.innerWidth : undefined,
      height: isClient ? window.innerHeight : undefined,
    }),
    [isClient]
  );

  const [winHeight, setWinheight] = React.useState(getSize().height);

  React.useEffect(() => {
    if (!isClient) {
      return false;
    }
    const onHandleResize = () => {
      setWinheight(getSize().height);
    };
    window.addEventListener('resize', onHandleResize);
    window.addEventListener('load', onHandleResize);
    return () => {
      window.removeEventListener('resize', onHandleResize);
      window.removeEventListener('load', onHandleResize);
    }
  }, [getSize, isClient]);

  return winHeight;
};

export default useWindowHeight;
