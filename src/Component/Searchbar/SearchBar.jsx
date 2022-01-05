import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { useThrottle } from "use-throttle";

const SearchBarWrapper = styled.div`
  border: 1px solid black;
  border-radius: 20px;
  padding: 10px;
  display: flex;
  position: relative;
  border-bottom-right-radius: ${({ q }) => (q ? "0px" : "20px")};
  border-bottom-left-radius: ${({ q }) => (q ? "0px" : "20px")};
`;

const IconImage = styled.img`
  height: 20px;
  padding-right: 20px;
`;

const Input = styled.input`
  border: none;
  outline: none;
  flex: 1;
`;

const RightSide = styled.div`
  display: flex;
  flex: 0 0 auto;
  padding-right: 10px;
`;

const Spinner = styled.div`
  border: 2px solid #f3f3f3; /* Light grey */
  border-top: 2px solid #3498db; /* Blue */
  border-radius: 50%;
  width: 20px;
  height: 20px;
  margin-left: 10px;
  animation: spin 2s linear infinite;
  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

const SuggestionBox = styled.div`
  display: ${({ len }) => (len !== 0 ? "flex" : "none")};
  flex-direction: column;
  flex: 0 0 auto;
  max-height: 150px;
  overflow: auto;
  border-bottom-right-radius: 20px;
  border-bottom-left-radius: 20px;
  border-top-color: ${({ len }) => (len ? "transparent" : "black")};
  border: 1px solid black;
  & * {
    flex: 1;
    padding: 5px;
    text-align: left;
    padding-left: 30px;
    height: 30px;
  }
  & :nth-child(${({ active }) => active}) {
    background: gray;
    color: white;
    font-weight: bold;
  }
  & :nth-child(n + ${({ limit }) => limit + 1}) {
    display: none;
  }
`;

function SearchBar({ loading, setLoading, suggestions, value, onChange }) {
  const [q, setQ] = useState("");
  const [active, setActive] = useState(0);
  const scrollRef = useRef();

  const throttledText = useThrottle(q, 1000);

  useEffect(() => {
    onChange(throttledText);
  }, [throttledText, onChange]);

  const handleInputChange = (e) => {
    setQ(e.target.value);
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };
  const handleClear = () => {
    setQ("");
    onChange("");
    setLoading(false);
  };

  const handleChangeActiveSuggestions = (e) => {
    console.log(e.keyCode, active);
    console.log(e.target.scrollHeight);
    switch (e.keyCode) {
      case 40: {
        if (active >= 5) {
          setActive(0);
        } else {
          setActive((prev) => prev + 1);
        }
        // if (active > 4) {
        //   scrollRef.current.scrollTop += 30;
        // }
        break;
      }
      case 38: {
        if (active === 1) {
          setActive(0);
        } else if (active <= 0) {
          setActive(5);
        } else {
          setActive((prev) => prev - 1);
        }
        break;
      }
      case 13: {
        // onEnter
        alert(suggestions[active - 1]);
        break;
      }
      default: {
        return;
      }
    }
  };
  return (
    <>
      <SearchBarWrapper q={q} onKeyUp={handleChangeActiveSuggestions}>
        <IconImage
          src="https://image.flaticon.com/icons/png/512/49/49116.png"
          alt="icon"
          ByteLengthQueuingStrategy
        />
        <Input value={q} onChange={handleInputChange} />
        <RightSide>
          {q && <div onClick={handleClear}> X </div>}
          {loading && <Spinner />}
        </RightSide>
      </SearchBarWrapper>
      {!loading && (
        <SuggestionBox
          ref={scrollRef}
          limit={5}
          len={suggestions.length}
          active={active}
        >
          {suggestions.map((item, index) => (
            <div key={item} onMouseOver={() => setActive(index + 1)}>
              {item}
            </div>
          ))}
        </SuggestionBox>
      )}
    </>
  );
}

export { SearchBar };
