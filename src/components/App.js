import React from "react";
import '../css/style.css';
import Register from './auth/Register';
import Home from './home';
import Login from './auth/Login';
import Chat from './chats/chat';
import {BrowserRouter, Route} from 'react-router-dom';

class App extends React.Component{
  renderRouter = () => {
    return(
      <BrowserRouter>
        <Route exact path='/' component={Home} />
        <Route path='/chat/:username/:userid/:chatroomid' component={Chat} />
        <Route path='/login' component={Login} />
        <Route path='/register' component={Register} />
      </BrowserRouter>
    )
  }
  
  
  render() {
    return (
      <div>
        {this.renderRouter()}
      </div>
    );
  }
}
export default App;