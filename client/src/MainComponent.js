import React from 'react';
import {
    HashRouter as Router,
    Switch,
    Route
} from 'react-router-dom'
import MarkdownEditorComponent from './MarkdownEditorComponent'
import DocsComponent from './DocsComponent'
import github from './GithubRepository'

export default class MainComponent extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            paths: []
        }
    }

    async componentDidMount() {
        const paths = await github.getPaths()

        this.setState({ paths })
    }

    componentWillUnmount() {
    }

    render() {
        return (
            <Router>
                <Switch>
                    <Route path="/:path+" render={this.renderEditor} />
                    <Route path="/" render={this.renderDocs} />
                </Switch>
            </Router>
        )
    }

    renderEditor(props) {
        const path = props.match.params.path
        return <MarkdownEditorComponent path={path} />
    }

    renderDocs() {
        return <DocsComponent />
    }
}
