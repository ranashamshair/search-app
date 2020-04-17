import React, { Component } from 'react';

import './CheckBox.css';

class CheckBox extends Component {

    constructor(props) {
        
        super(props);
        this.state = {
            checked: false
        };
    
        this.handleChange = this.handleChange.bind(this);
        
    }

    handleChange = (e) => {
        const target = e.target;
        this.setState({
            checked: target.checked,
        });
    }

    render() {
        
        return (
            <>
                <div className="form-checkbox">
                    <input type="checkbox" id={this.props.attr} onChange={this.handleChange} checked={this.state.checked} /> 
                    <label htmlFor={this.props.attr}>{this.props.label}</label>
                </div>
            </>
        );
    }

}

export default CheckBox;