import { InputWithLabel } from "./input-with-labbel";

const SearchForm =({searchTerm,onSearchInput,searchAction})=>(
  <form onSubmit={(e)=>{e.preventDefault(); searchAction();}} className='search-form'>
    <InputWithLabel
      id="search"
      value={searchTerm}
      isFocused
      onInputeChange={onSearchInput}
    >
      Search:
    </InputWithLabel>

    <button type="submit" disabled={!searchTerm} className='button button_large'>
      <strong>Submit</strong>
    </button>
  </form> 
);

export {SearchForm};