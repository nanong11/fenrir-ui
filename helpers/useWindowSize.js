import React from 'react';

const useWindowSize = () => {

  const isClient = typeof window === 'object';

  const getSize = React.useCallback(
    () => ({
      width: isClient ? window.innerWidth : undefined,
      height: isClient ? window.innerHeight : undefined,
    }),
    [isClient]
  );

  let initView = 'MOBILE';
  if (getSize().width > 743) {
    initView = 'DESKTOP';
  }
  // if (getSize().width > 1020) {
  //   initView = 'DESKTOP';
  // } else if (getSize().width > 850) {
  //   initView = 'TABLET_LG';
  // } else if (getSize().width > 550) {
  //   initView = 'TABLET_MD';
  // }

  const [view, setView] = React.useState(initView);

  React.useEffect(() => {
    if (!isClient) {
      return false;
    }
    const onHandleResize = () => {
      let viewR = 'MOBILE';
      if (getSize().width > 743) {
        viewR = 'DESKTOP';
      }
      // if (getSize().width > 1020) {
      //   viewR = 'DESKTOP';
      // } else if (getSize().width > 850) {
      //   viewR = 'TABLET_LG';
      // } else if (getSize().width > 550) {
      //   viewR = 'TABLET_MD';
      // }
      setView(viewR);
    };
    window.addEventListener('resize', onHandleResize);
    window.addEventListener('load', onHandleResize);
    return () => {
      window.removeEventListener('resize', onHandleResize);
      window.removeEventListener('load', onHandleResize);
    }
  }, [getSize, isClient]);

  return view;
};

export default useWindowSize;
