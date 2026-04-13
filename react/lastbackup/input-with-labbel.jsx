import * as React from 'react';


const InputWithLabel = ({ id, value, type = 'text', onInputeChange, isFocused, children }) =>{
  const inputRef = React.useRef();
  React.useEffect(() => {
    if (isFocused && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isFocused]);

  return (
    <>
      <label className='label' htmlFor={id}>{children}</label>
      &nbsp;
      <input className='input' id={id} type={type} value={value} ref={inputRef} onChange={onInputeChange} />
    </>
  );
};

export {InputWithLabel};