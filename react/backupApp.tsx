import * as React from 'react';
import './App.css';
import checkUrl from "./check.svg";

const API_ENDPOINT ='https://hn.algolia.com/api/v1/search?query=';




// const getAsyncStories = () => 
//  new Promise((resolve)=>
//   setTimeout(
//     ()=>resolve({data:{stories:initialStories}}),2000
//   )
// );

type StoriesState = {
  isLoading: boolean;
  isError: boolean;
  data: Story[];
};



type StoriesFetchInitAction = {
  type: 'STORIES_FETCH_INIT';
}

type StoriesFetchSuccessAction = {
  type: 'STORIES_FETCH_SUCCESS';
  payload: Story[];
}

type StoriesFetchFailureAction = {
  type: 'STORIES_FETCH_FAILURE';
}

type StoriesRemoveAction = {
  type: 'REMOVE_STORY';
  payload: Story;
}

type StoriesAction = 
  StoriesFetchInitAction
  |StoriesFetchSuccessAction
  |StoriesFetchFailureAction
  |StoriesRemoveAction;


const storiesReducer = (state:StoriesState, action:StoriesAction) => {
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
        data: action.payload,
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


const useStorageState = (key:string, initialState:string) => {
  const isMounted = React.useRef(false);
  const [value, setValue] = React.useState(
    localStorage.getItem(key) || initialState
  );
  console.log(localStorage.getItem(key));
  React.useEffect(() => {
    if(!isMounted.current){
      isMounted.current = true;
    } else {
    console.log('A');
    localStorage.setItem(key, value);
    }
  }, [value, key]);
  console.log(key,value);
  return [value, setValue] as const;
}

const getSumComments = (stories:Story[]) => {
  console.log('C');
  return stories.reduce(
    (result, value)=>result+value.num_comments,0
  );
};

  

function App() {
  const [searchTerm, setSearchTerm] = useStorageState('search', 'React');
  const [url, setUrl] = React.useState(`${API_ENDPOINT}${searchTerm}`);

  const [stories, dispatchStories] = React.useReducer(
    storiesReducer,
    { data: [], isLoading: false, isError: false }
  );



  const handleFetchStories = React.useCallback(async () => {
    dispatchStories({ type: 'STORIES_FETCH_INIT' });
    try {
      const result = await (await fetch(url)).json();
      dispatchStories({
        type: 'STORIES_FETCH_SUCCESS',
        payload: result.hits,
      });
    } catch {
      dispatchStories({ type: 'STORIES_FETCH_FAILURE' });
    }
  }, [url]);


  React.useEffect(() => {
    console.log('How many times do I log?');
    handleFetchStories();
  }, [handleFetchStories]);


  const handleRemoveStory = React.useCallback((item:Story) => {
    dispatchStories({
      type: 'REMOVE_STORY',
      payload: item,
    });
  }, []);

  function handleSearch(event:React.ChangeEvent<HTMLInputElement>) {
    setSearchTerm(event.target.value);
  }

  const searchAction = () => {
    setUrl(`${API_ENDPOINT}${searchTerm}`);
  };

  console.log('B:App');

const sumComments = React.useMemo(()=>
    getSumComments(stories.data),[stories]);


  return (
    <div className="container">
      <h1 className='headline-primary'>My Hecker with {sumComments} comments.</h1>

      <SearchForm
        searchTerm={searchTerm}
        onSearchInput={handleSearch}
        searchAction={searchAction} />

      <hr />
      {stories.isError && <p>Something went wrong...</p>}
      {stories.isLoading
        ? (<p>Loading...</p>)
        : (<List list={stories.data} onRemoveItem={handleRemoveStory} />)}
    </div>
  );
}

type SearchFormProps = {
  searchTerm: string;
  onSearchInput: (event:React.ChangeEvent<HTMLInputElement>)=>void;
  searchAction: (formData:FormData)=>void;
}

const SearchForm =({searchTerm,onSearchInput,searchAction}:SearchFormProps)=>(
  <form action={searchAction} className='search-form'>
    <InputWithLabel
      id="search"
      value={searchTerm}
      isFocused
      onInputeChange={onSearchInput}
    >
      <strong>Search:</strong>
    </InputWithLabel>

    <button type="submit" disabled={!searchTerm} className='button button_large'>
      Submit
    </button>
  </form> 
);

type InputWithLabelProps = {
  id: string;
  value:string;
  type?: string;
  onInputeChange:(event:React.ChangeEvent<HTMLInputElement>)=>void;
  isFocused?: boolean;
  children: React.ReactNode;
};

const InputWithLabel = ({ id, value, type = 'text', onInputeChange, isFocused, children }:InputWithLabelProps) =>{
  const inputRef = React.useRef<HTMLInputElement>(null);
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
}

type ListProps = {
  list: Story[];
  onRemoveItem: (item:Story)=>void;
}

const List = React.memo(({ list,onRemoveItem }:ListProps) => (
    console.log('B:List') , (
    <ul>
      {list.map((item) => (
        <Item key={item.objectID} item={item} onRemoveItem={onRemoveItem} />
      )
      )}
    </ul>)
  )
);

type Story = {
  objectID:string;
  url:string;
  title:string;
  author:string;
  num_comments:number;
  points:number;
};

type ItemProps = {
  item: Story;
  onRemoveItem: (item:Story)=>void;
};

const Item = ({item,onRemoveItem}:ItemProps)=>(
  
  <li className="item">
    <span style={{width:'40%'}}><a href={item.url}>{item.title}</a></span>
    <span style={{width:'30%'}}>{item.author}</span>
    <span style={{width:'10%'}}>{item.num_comments}</span>
    <span style={{width:'10%'}}>{item.points}</span>
    <span style={{width:'10%'}}>
      <button 
      type="button" 
      onClick={()=>onRemoveItem(item)} 
      className="button button_small"
      >
      <img src={checkUrl} height="18px" width="18px" />
      </button></span>
    </li>
)





export default App;