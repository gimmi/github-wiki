import React from 'react'
import PropTypes from 'prop-types'
import ReactMarkdown from 'react-markdown'
import { uriTransformer } from 'react-markdown'

export default class PreviewComponent extends React.PureComponent {
    constructor(props) {
        super(props)

        this.transformImageUri = this.transformImageUri.bind(this)
    }

    componentDidMount() {
    }

    componentWillUnmount() {
    }

    transformImageUri(src, alt, title) {
        return uriTransformer(src, alt, title)
    }

    render() {
        return <ReactMarkdown className="markdown-body" transformLinkUri={uriTransformer} transformImageUri={this.transformImageUri}>{this.props.markdown}</ReactMarkdown>
    }
}

PreviewComponent.propTypes = {
    markdown: PropTypes.string.isRequired
}