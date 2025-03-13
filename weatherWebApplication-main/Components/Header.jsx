import React, {Component} from "react";

class Header extends Component {
    render() {
        return (
            <section className="header">
                <h1>Open Weather <span role="img" aria-label={"umbrella"}>☂️</span></h1>
                <span className="annotation"><h2>Weather forecasts,nowcasts and history in a fast and elegant way</h2></span>
            </section>
        );
    }
}

export default Header;