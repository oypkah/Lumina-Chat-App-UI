import React from "react";
import HomeHeader from "./homeHeader";
import HomeChats from "./homeChats";

class Home extends React.Component {
    constructor(props){
        super(props);
    }
  componentDidMount() {
    if (sessionStorage.getItem("LCAToken") === null)
      this.props.history.push("/login");
  }

  render() {
    return (
      <div className="wrapper">
        <section className="users">
          <HomeHeader />
          <div className="search">
            <span className="text">Select An User So Start Chat</span>
            <input type="text" placeholder="Enter Name To Search..." />
            <button>
              <i className="fas fa-search"></i>
            </button>
          </div>
          <HomeChats />
        </section>
      </div>
    );
  }
}
export default Home;
