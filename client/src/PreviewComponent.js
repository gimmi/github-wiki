import React from 'react'
import PropTypes from 'prop-types'
import ReactMarkdown from 'react-markdown'

export default class PreviewComponent extends React.PureComponent {
    constructor(props) {
        super(props)
    }

    componentDidMount() {
    }

    componentWillUnmount() {
    }

    render() {
        return <ReactMarkdown className="markdown-body">{this.props.markdown}</ReactMarkdown>
    }
}

PreviewComponent.propTypes = {
    markdown: PropTypes.string.isRequired
}