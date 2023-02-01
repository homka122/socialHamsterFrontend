import React from 'react';
import './MyInput.css';

type propsType = {
  minHeight: number;
  maxHeight: number;
  inputText: string;
  setInputText: React.Dispatch<React.SetStateAction<string>>;
  onClickHandler: () => Promise<void>;
};

function MyInput(props: propsType) {
  const { minHeight, maxHeight, inputText, setInputText, onClickHandler } = props;

  const changeSize = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const limit = maxHeight;

    e.target.style.height = `1px`;
    const newHeight = Math.min(2 + e.target.scrollHeight, limit);
    if (newHeight < 50) {
      e.target.style.height = '50px';
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      e.target.parentElement!.style.height = '70px';
    } else {
      e.target.style.height = `${newHeight}px`;
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      e.target.parentElement!.style.height = `${newHeight + 20}px`;
    }

    setInputText(e.target.value);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.code === 'Enter' && !e.shiftKey) {
      console.log(true);
      e.preventDefault();
      onClickHandler();
    }
  };

  return (
    <div className="myinput__inputarea" style={{ height: `${minHeight + 20}px` }}>
      <textarea className="myinput__input" value={inputText} onChange={changeSize} onKeyDown={onKeyDown} style={{ height: `${minHeight}px` }} />
      <img src="/send.svg" alt="send logo" height={24} width={30} onClick={onClickHandler} style={{ cursor: 'pointer' }} />
    </div>
  );
}

export default MyInput;
