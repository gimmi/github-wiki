import React from 'react';

let componentInstance = null

export const overlayManager = {
    show(message) {
        if (!componentInstance) {
            throw new Error('No MessageOverlay')
        }

        componentInstance.setState({message})
    },

    hide() {
        if (componentInstance) {
            componentInstance.setState({message: ''})
        }
    }
}

export default class MessageOverlay extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            message: ''
        }
    }

    async componentDidMount() {
        if (componentInstance) {
            throw new Error('Only one MessageOverlay is supported')
        }

        componentInstance = this
    }

    componentWillUnmount() {
        componentInstance = null
    }

    render() {
        const overlayStyle = {
            position: 'fixed',
            display: this.state.message ? 'block' : 'none',
            width: '100%',
            height: '100%',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, .8)',
            zIndex: 10,
            cursor: 'pointer'
        }
        const textStyle = {
            position: 'absolute',
            top: '50%',
            left: '50%',
            fontSize: '2em',
            color: 'white',
            transform: 'translate(-50%,-50%)'
        }
        return (
            <div style={overlayStyle}>
                <div style={textStyle}>{this.state.message}</div>
            </div>
        )
    }
}
