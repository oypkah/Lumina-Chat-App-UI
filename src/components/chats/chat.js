import React from "react";
import ChatHeader from "./chatHeader";
import * as signalR from "@microsoft/signalr";

const hubConnection = new signalR.HubConnectionBuilder()
  .withUrl("http://localhost:52941/chathub")
  .build();

class Chat extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      messages: [],
      receivPpFilePath: "",
      sendingMessage: "",
      receivTypingStatus: "",
    };
  }

  async componentDidMount() {
    if (sessionStorage.getItem("LCAToken") === null)
      this.props.history.push("/login");

    const requestOptions = {
      method: "GET",
      headers: {
        "Content-Type": "application/json; charset=UTF-8",
        Accept: "application/json",
        Authorization: `Bearer ${sessionStorage.getItem("LCAToken")}`,
      },
    };
    await fetch(
      `http://localhost:52941/api/chatroom/getmessages/${
        this.props.match.params.chatroomid
      }/${sessionStorage.getItem("_id")}`,
      requestOptions
    )
      .then((response) => response.json())
      .then((data) => {
        if (data.isSuccess) {
          this.setState({
            messages: data.resultData,
          });
          console.log(data.resultData);
        }
      });
    this.goDown();


    try {
      await hubConnection.start();
      console.log("connection success chat");
      console.log(hubConnection.connectionId);
    } catch (error) {
      console.log(error);
    }

    hubConnection.on("GetMemberIdFromConnected", () => {
      hubConnection.invoke(
        "SetMemberConnect",
        parseInt(sessionStorage.getItem("_id"))
      );
    });

    hubConnection.on("getMessage", (message) => {
      this.state.messages.push(message);
      this.setState({ sendingMessage: "" });
    });
  }

  goDown() {
    const chatBox = document.getElementById("chat-box");
    chatBox.scrollTo(0, chatBox.scrollHeight);
  }

  getFilePath = (filePath) => {
    this.setState({ receivPpFilePath: filePath });
  };

  messageSend = async (e) => {
    e.preventDefault();

    /* const message = {
      body: this.state.sendingMessage,
      chatRoom: null,
      chatRoomId: 1,
      createdComputerName: "Admin",
      createdDate: "2021-07-11T03:09:02.3846048",
      createdIP: "127.0.0.1",
      id: this.state.idCount,
      messageImageStatus: 1,
      messageStatus: 2,
      modifiedComputerName: "Admin",
      modifiedDate: "2021-07-11T03:09:02.3846055",
      modifiedIP: "127.0.0.1",
      receiv: null,
      receivId: 3,
      sender: null,
      senderId: 1,
      status: 0,
    };
    this.state.messages.push(message);
    this.setState({ sendingMessage: "", idCount: this.state.idCount + 1 }); */

    const requestOptions = {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${sessionStorage.getItem("LCAToken")}`,
      },
      body: JSON.stringify({
        Body: this.state.sendingMessage,
        MessageStatus: 1,
        MessageImageStatus: 1,
        SenderId: parseInt(sessionStorage.getItem("_id")),
        ReceivId: this.props.match.params.userid,
        ChatRoomId: this.props.match.params.chatroomid,
      }),
    };
    await fetch("http://localhost:52941/api/message/addmessage", requestOptions)
      .then((resp) => resp.json())
      .catch((error) => console.log(error));

      this.setState({sendingMessage: ""});
  };

  componentDidUpdate() {
    this.goDown();
  }

  typingMessage = async (e) => {
    this.setState({ sendingMessage: e.target.value });

    const requestOptions = {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${sessionStorage.getItem("LCAToken")}`,
      },
      body: JSON.stringify({
        id: parseInt(sessionStorage.getItem("_id")),
        isTyping: e.target.value.length > 0 ? true : false,
        receivMemberId: parseInt(this.props.match.params.userid),
      }),
    };

    await fetch(
      "http://localhost:52941/api/member/setmembertypingstatus",
      requestOptions
    )
      .then((resp) => resp.json())
      .catch((error) => console.log(error));
  };

  componentWillMount(){
    hubConnection.stop();
  }

  render() {
    return (
      <div className="wrapper">
        <section className="chat-area">
          <ChatHeader
            ReceivUserName={this.props.match.params.username}
            getFilePath={this.getFilePath}
            conn={hubConnection}
          />
          <div
            className="chat-box"
            id="chat-box"
            onScroll={(e) => {
              let godown = document.getElementById("goDown");
              if (
                parseInt(e.target.scrollTop) + 500 <
                parseInt(e.target.scrollHeight)
              ) {
                godown.classList.remove("goDownHide");
                godown.classList.add("goDownShow");
              } else {
                godown.classList.remove("goDownShow");
                godown.classList.add("goDownHide");
              }
            }}
          >
            {this.state.messages.map((message) => {
              if (message.senderId == sessionStorage.getItem("_id")) {
                return (
                  <div className="chat outgoing" key={message.id}>
                    <div className="details">
                      <p>{message.body}</p>
                    </div>
                  </div>
                );
              } else {
                return (
                  <div className="chat incoming" key={message.id}>
                    <img src={this.state.receivPpFilePath} />
                    <div className="details">
                      <p>{message.body}</p>
                    </div>
                  </div>
                );
              }
            })}

            <div
              id="goDown"
              className="goDown goDownHide"
              onClick={this.goDown}
            >
              <i className="fa fa-angle-down"></i>
            </div>
          </div>
          <form className="typing-area" onSubmit={this.messageSend}>
            <input
              type="text"
              placeholder="Type Something..."
              onChange={this.typingMessage}
              value={this.state.sendingMessage}
            />
            <button>
              <i className="fab fa-telegram-plane"></i>
            </button>
          </form>
        </section>
      </div>
    );
  }
}

export default Chat;
