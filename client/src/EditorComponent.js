import React from 'react'
import PropTypes from 'prop-types'
import AceEditor from 'react-ace'
import 'ace-builds/src-noconflict/mode-markdown'
import 'ace-builds/src-noconflict/theme-monokai'
import 'ace-builds/src-noconflict/ext-searchbox'

export default function EditorComponent(props) {
    const commands = [{
        name: 'save',
        bindKey: { win: 'Ctrl-s', mac: 'Command-s' },
        exec: props.onSave
    }]

    return <AceEditor height="100%" mode="markdown" theme="monokai" value={props.value} commands={commands} showPrintMargin={false} onChange={props.onChange} debounceChangePeriod={2000} />
}


EditorComponent.propTypes = {
    value: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    onSave: PropTypes.func.isRequired
}