import {useState,useRef} from 'react';

const Task = (props) => {
    const handleStyle = (e)=>{
        // if(props.status === 'incomplete') {
        //     e.target.parentElement.children[1].style.textDecoration = 'line-through';
        //     console.log(props.status);
            
        //     props.updateStatus(props.id);
        // }
        // else {
        //     e.target.parentElement.children[1].style.textDecoration = 'none';
        //     console.log(props.status);
        //     props.updateStatus(props.id);
        // }
        props.updateStatus(props.id);
        
    }
    return (
        <div className="task">
            <input onClick={handleStyle} type="checkbox" checked={props.check} readOnly />
            <p  style={{textDecoration: props.status}}>{props.input}</p>
            <button onClick={()=>props.delete(props.id)}>Delete</button>
        </div>
    )
}

export default Task;