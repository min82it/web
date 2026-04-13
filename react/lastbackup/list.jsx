import * as React from 'react';
import { sortBy } from 'lodash';

const SORTS = {
  NONE: (list) => list,
  Title: (list) => [...list].sort((a,b)=>a.title.localeCompare(b.title)),
  Author: (list) => [...list].sort((a,b)=>a.author.localeCompare(b.author)),
  Comments: (list) => [...list].sort((a,b)=>a.num_comments - b.num_comments),
  Points: (list) => [...list].sort((a,b)=>a.points - b.points),
  // Author: (list) => sortBy(list, 'author'),
  // Comments: (list) => sortBy(list, 'num_commments').reverse(),
  // Points: (list) => sortBy(list, 'points').reverse(),
};




// const List = React.memo(({ list,onRemoveItem }) => {

  const List = ({ list,onRemoveItem }) => {
    const [sort, setSort] = React.useState({
      sortKey : 'NONE',
      isReverse: false,
    });

    const handleSort = (sortKey)=> {
      const isReverse = sort.sortKey===sortKey && !sort.isReverse;

      setSort({
        sortKey: sortKey,
        isReverse:isReverse
    });
    };
  
    const sortFunction = SORTS[sort.sortKey];
    const sortedList = sort.isReverse
      ? sortFunction(list).reverse()
      : sortFunction(list);
    

    
    console.log('B:List') ;
    return (
    <ul>
      <li style={{display: 'flex'}}>
        <span style={{width: '40%'}}> <button type='button' onClick={()=>handleSort('Title')} >Title</button></span>
        <span style={{width: '30%'}}><button type='button' onClick={()=>handleSort('Author')} >Author</button></span>
        <span style={{width: '10%'}}><button type='button' onClick={()=>handleSort('Comments')} >Comments</button></span>
        <span style={{width: '10%'}}><button type='button' onClick={()=>handleSort('Points')} >Points</button></span>
        <span style={{width: '10%'}}><button type='button' onClick={()=>handleSort('Actions')} >Actions</button></span>
      </li>

      {sortedList.map((item) => (
        <Item key={item.objectID} item={item} onRemoveItem={onRemoveItem} />
      ))}
    </ul>)
  };



const Item = ({item,onRemoveItem})=>(
  
  <li style={{ display: 'flex'}} className="item">
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
      Dismiss  
      {/* <img src={checkUrl} height="18px" width="18px" /> */}
      </button></span>
    </li>
);

export {List}; 