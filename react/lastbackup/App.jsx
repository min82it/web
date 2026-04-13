import * as React from 'react';
import axios from 'axios';
import './App.css';
import checkUrl from "./check.svg";
import {SearchForm} from './search-form';
import {List} from './list';


const API_BASE = `https://hn.algolia.com/api/v1`;
const API_SEARCH = '/search';
const PARA_SEARCH = 'query=';
const PARA_PAGE = 'page=';

const getUrl = (searchTerm,page)=> `${API_BASE}${API_SEARCH}?${PARA_SEARCH}${searchTerm}&${PARA_PAGE}${page}`;

// const extractSearchTerm = (url)=> url.replace(`${API_BASE}${API_SEARCH}?${PARA_SEARCH}`,'');
const extractSearchTerm = (url)=> url.substring(url.lastIndexOf('?')+1,url.lastIndexOf('&')).replace(PARA_SEARCH,'');

const storiesReducer = (state, action) => {
  switch(action.type){
    case 'STORIES_FETCH_INIT':
      return {
        ...state,
        isLoading: true,
        isError: false,
      };
     case 'STORIES_FETCH_SUCCESS':
      return {
        ...state,
        isLoading: false,
        isError: false,
        data: 
          action.payload.page===0?action.payload.list:state.data.concat(action.payload.list),
        page: action.payload.page,
      };
     case 'STORIES_FETCH_FAILURE':
      return {
        ...state,
        isLoading: false,
        isError: true,
      };
    case 'REMOVE_STORY':
      return {
        ...state,
        data: state.data.filter(
          (story)=>action.payload.objectID !== story.objectID),
      };  
    default:
      throw new Error();
  };
};
//The reducer function accepts a state and an action, and then returns a new state

const useStorageState = (key, initialState) => {
  const isMounted = React.useRef(false);
  const [value, setValue] = React.useState(
    localStorage.getItem(key) || initialState
  );
  // console.log(localStorage.getItem(key));
  React.useEffect(() => {
    if(!isMounted.current){
      isMounted.current = true;
    } else {
    console.log('A');
    localStorage.setItem(key, value);
    }
  }, [value, key]);
  // console.log(key,value);
  return [value, setValue];
}

const getSumComments = (stories) => {
  console.log('C');
  return stories.reduce(
    (result, value)=>result+value.num_comments,0
  );
};


const getLastSearches = (urls) => 
  urls.reduce((result,url,index)=>{
    const searchTerm = extractSearchTerm(url);
    if(index===0){
      return result.concat(searchTerm)}

    const previousSearchTerm = result[result.length -1 ];

    if(searchTerm===previousSearchTerm){
      return result;
    }else{
      return result.concat(searchTerm);
    }
  },[]).slice(-6,-1);




const LastSearches = ({lastSearches,onLastSearch})=>(
  <>
  {lastSearches.map((searchTerm,index)=>(
          <button 
          type="button" key={searchTerm+index} onClick={()=>onLastSearch(searchTerm)}>
            {searchTerm}
            </button>
        ))}
  </>
);

function App() {
  const [searchTerm, setSearchTerm] = useStorageState('search', 'React');
  const [urls, setUrls] = React.useState([getUrl(searchTerm,0)]);

  const [stories, dispatchStories] = React.useReducer(
    storiesReducer,
    { data: [], 
      page: 0,
      isLoading: false, 
      isError: false }
  );

  // const handleLastSearch = (searchTerm,page) => {
  //   setSearchTerm(searchTerm);
  //   const url = getUrl(searchTerm,page);
  //   setUrls(urls.concat(url));
  // }; 

  const lastSearches = getLastSearches(urls);


  const handleFetchStories = React.useCallback(async () => {
    dispatchStories({ type: 'STORIES_FETCH_INIT' });
    try {
      // const result = await (await fetch(url)).json();

      const lastUrl = urls[urls.length-1];
      const result = await axios.get(lastUrl);

      dispatchStories({
        type: 'STORIES_FETCH_SUCCESS',
        payload: {
          list: result.data.hits,
          page: result.data.page,
        },
      });
    } catch {
      dispatchStories({ type: 'STORIES_FETCH_FAILURE' });
    }
  }, [urls]);


  React.useEffect(() => {
    console.log('How many times do I log?');
    handleFetchStories();
  }, [handleFetchStories]);


  const handleRemoveStory = React.useCallback((item) => {
    dispatchStories({
      type: 'REMOVE_STORY',
      payload: item,
    });
  }, []);

  function handleSearchInput(event) {
    setSearchTerm(event.target.value);
  }

  const handleSearch = (searchTerm,page)=>{
    const url = getUrl(searchTerm, page); 
    setUrls((prev)=>prev.concat(url));
  };

  const searchAction = () => {
   handleSearch(searchTerm,0);
  };

  const handleLastSearch = (searchTerm)=>{
    setSearchTerm(searchTerm);
    handleSearch(searchTerm, 0);
  };

  console.log('B:App');

const sumComments = React.useMemo(()=>
    getSumComments(stories.data),[stories.data]);



const handleMore = () =>{
  const lastUrl = urls[urls.length-1];
  const searchTerm = extractSearchTerm(lastUrl);
  handleSearch(searchTerm, stories.page+1);
};

  return (
    <div className="container">
      <h1 className='headline-primary'>My Hecker with {sumComments} comments.</h1>

      <SearchForm
        searchTerm={searchTerm}
        onSearchInput={handleSearchInput}
        searchAction={searchAction} />

      <LastSearches lastSearches={lastSearches} onLastSearch={handleLastSearch} />
        

      <hr />
      {stories.isError && <p>Something went wrong...</p>}

      <List list={stories.data} onRemoveItem={handleRemoveStory} />

      {stories.isLoading
        ? (<p>Loading...</p>)
        :(<button type="button" onClick={handleMore} >More</button>) }

    </div>
  );
}




export default App;