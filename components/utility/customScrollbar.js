import React from 'react';
import { Scrollbars } from 'react-custom-scrollbars-2';
export default React.forwardRef((props, ref) => (
  <Scrollbars
    id={props.id}
    className={props.className}
    style={props.style}
    autoHide
    hideTracksWhenNotNeeded
    autoHideTimeout={1000}
    autoHideDuration={200}
    renderView={props => <div {...props} className="scroll-view" />}
    // autoHeight
    // autoHeightMin={0}
    // autoHeightMax={200}
    thumbMinSize={30}
    universal={true}
    onUpdate={(value) => {
        if (props.onScroll) {
          props.onScroll(value.top)
        }  
    }}
    ref={ref}
    onScrollFrame={(values) => {
      const { scrollTop, scrollHeight, clientHeight } = values
      const pad = 50;
      const maxScroll = ((scrollTop + pad) / (scrollHeight - clientHeight));
      if (values.top >= 0.9 && props.loading !== undefined) {
        if (props.onScrollMax && props.loading === false) {
          if (maxScroll > 1) props.onScrollMax();
        }
      } else if (values.top === 0 && props.loading !== undefined) {
        if (props.onScrollMin && props.loading === false){
          if (maxScroll < 1) props.onScrollMax();
        };
      }
    }}
  >
    {props.children}
  </Scrollbars>
));