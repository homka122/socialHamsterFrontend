import './MyInput.css';

function MyInput(props) {
  const { minHeight, maxHeight, inputText, setInputText, onClickHandler } = props;

  const onKeyDown = (e) => {
    const limit = maxHeight;

    e.target.style.height = `1px`;
    const newHeight = Math.min(2 + e.target.scrollHeight, limit);
    if (newHeight < 50) {
      e.target.style.height = '50px';
      e.target.parentNode.style.height = '70px';
    } else {
      e.target.style.height = `${newHeight}px`;
      e.target.parentNode.style.height = `${newHeight + 20}px`;
    }

    setInputText(e.target.value);
  };

  return (
    <div className="myinput__inputarea" style={{ height: `${minHeight + 20}px` }}>
      <textarea
        type="text"
        className="myinput__input"
        value={inputText}
        onChange={onKeyDown}
        style={{ height: `${minHeight}px` }}
      />
      <img
        src="/send.svg"
        alt="send logo"
        height={24}
        width={30}
        onClick={onClickHandler}
        style={{ cursor: 'pointer' }}
      />
    </div>
  );
}

export default MyInput;
