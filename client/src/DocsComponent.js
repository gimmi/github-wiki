import React from 'react';
import { Link } from 'react-router-dom'
import github from './GithubRepository'

export default class DocsComponent extends React.Component {
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
        const list = this.state.paths.map(path => {
            const descr = path.replaceAll('-', ' ')
            return <li key={path}><Link to={path}>{descr}</Link></li>
        })

        return <ul>{list}</ul>
    }
}
