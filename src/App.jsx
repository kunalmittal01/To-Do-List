import { useState,useEffect } from 'react'
import Task from './assets/task'
import { Snackbar, Alert, CircularProgress, Backdrop ,LinearProgress} from '@mui/material';
import './App.css'

function App() {
  const [userInput, setUserInput] = useState("");
  const [taskArr, setTaskArr] = useState(JSON.parse(localStorage.getItem('tasks')) || []);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [showBackdrop, setShowBackdrop] = useState(false);
  const [progress, setProgress] = useState(100);
  
  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const showMuiAlert = (message) => {
    setAlertMessage(message);
    setSnackbarOpen(true);

    // Show a backdrop and loader effect for a few seconds
    setShowBackdrop(true);
    setProgress(100);
    setTimeout(() => {
      setShowBackdrop(false);
    }, 1000); // Show the backdrop loader for 1 second
  }
  
  useEffect(() => {
    if (snackbarOpen) {
      const timer = setInterval(() => {
        setProgress((prev) => (prev > 0 ? prev - 1 : 0));
      }, 100); // Decrease progress by 1% every 100ms (10 seconds total)

      if (progress === 0) {
        setSnackbarOpen(false); // Close Snackbar when progress reaches 0
      }

      return () => clearInterval(timer); // Clean up interval on component unmount
    }
  }, [snackbarOpen, progress]);

  const onBtnClick = ()=> {
    if(userInput == "") {
      showMuiAlert("Please enter a task");
      return;
    }
    const obj = {
      input: userInput,
      status: "none",
      check: false,
    }
    const previousTask = [...taskArr];
    previousTask.push(obj);
    setTaskArr(previousTask);
    localStorage.setItem("tasks", JSON.stringify(previousTask))
    setUserInput("");
    showMuiAlert("Task added successfully");
  }

  const onDelete = (id) => {
    setTaskArr(taskArr.filter((task,idx)=>idx!==id));
    const tasks = JSON.parse(localStorage.getItem("tasks"));
    tasks.splice(id,1);
    localStorage.setItem("tasks", JSON.stringify(tasks));
    showMuiAlert("Task deleted successfully");
  }

  const handleStatus = (id) => {
    setTaskArr(taskArr.map((task,idx)=> {
      const tasks = JSON.parse(localStorage.getItem('tasks'));
      if(id == idx)  { 
        if(task.status == 'none') {
          tasks[id].status = 'line-through'
          tasks[id].check = true;
          localStorage.setItem('tasks', JSON.stringify(tasks))
          return {...task, status: 'line-through',check: true};
        }
        else {
          tasks[id].status = 'none'
          tasks[id].check = false;
          localStorage.setItem('tasks', JSON.stringify(tasks))
          return {...task, status: 'none', check: false}
        }
      }
      return task;
    }))
  }
  return (
    <>
 <Snackbar
        open={snackbarOpen}
        autoHideDuration={10000} // Auto-hide after 10 seconds
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        onClick={handleSnackbarClose} // Close snackbar on click
      >
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {/* MUI Alert for displaying message */}
          <Alert onClose={handleSnackbarClose} severity="info">
            {alertMessage}
          </Alert>
          {/* Linear Progress Bar */}
          <LinearProgress variant="determinate" value={progress} />
        </div>
      </Snackbar>

      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={showBackdrop}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      <div className="container">
        <p className="head">Grocery Bud</p>
        <div className="input-field">
          <input onChange={(e)=>setUserInput(e.target.value)} value={userInput} type="text" />
          <button onClick={onBtnClick}>ADD</button>
        </div>
        <div className="output-field">
          {taskArr.map((task,idx)=> {
            return <Task key={"task" + idx} id={idx} {...task} delete={onDelete} updateStatus={handleStatus} />
          })}
        </div>
      </div>
    </>
  )
}

export default App;
