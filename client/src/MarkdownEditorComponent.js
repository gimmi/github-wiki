import React from 'react';
import PropTypes from 'prop-types'
import Split from 'react-split'
import EditorComponent from './EditorComponent';
import PreviewComponent from './PreviewComponent';
import storage from './storage';
import github from './GithubRepository'
import { overlayManager } from './MessageOverlay'

export default class MarkdownEditorComponent extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            markdown: ''
        }
    }

    async componentDidMount() {
        console.log('componentDidMount', this.props.path)
        await this.loadMarkdown()
    }

    async componentDidUpdate(prevProps) {
        if (prevProps.path !== this.props.path) {
            console.log('componentDidUpdate', this.props.path)
            await this.loadMarkdown()
        }
    }

    componentWillUnmount() {
    }

    async loadMarkdown() {
        const path = this.props.path
        const markdown = await github.getContent(path)

        this.setState({ markdown })
    }

    onChange(markdown) {
        storage.set('markdown', markdown)
        this.setState({ markdown })
    }

    async onSave() {
        overlayManager.show('Saving...')
        try {
            await github.setContent(this.props.path, this.state.markdown)
            overlayManager.hide()
        } catch (ex) {
            overlayManager.show(ex.message)
            console.error(ex)
        }
    }

    render() {
        return (
            <Split style={{ flexGrow: 1, display: 'flex', overflow: 'auto' }} sizes={storage.get('splitSizes', [10, 90])} onDragEnd={sizes => storage.set('splitSizes', sizes)}>
                <EditorComponent value={this.state.markdown} onChange={markdown => this.onChange(markdown)} onSave={this.onSave.bind(this)} />
                <PreviewComponent markdown={this.state.markdown} />
            </Split>
        )
    }
}

MarkdownEditorComponent.propTypes = {
    path: PropTypes.string.isRequired
}
