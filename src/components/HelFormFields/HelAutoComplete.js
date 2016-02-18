import React from 'react'

import Input from 'react-bootstrap/lib/Input.js'
import Select from 'react-select'

import Typeahead from 'src/typeahead.js'

import {connect} from 'react-redux'
import {setData} from 'src/actions/editor.js'

import ValidationPopover from 'src/components/ValidationPopover'

class HelAutoComplete extends React.Component {

    static contextTypes = {
        intl: React.PropTypes.object,
        dispatch: React.PropTypes.func
    };

    constructor(props) {
        super(props)

        this.state = { isLoading: false }
    }

    getOptions(input) {
        let self = this
        this.setState({isLoading: true});
        return fetch(this.props.dataSource + input)
            .then((response) => {
                return response.json();
            }).then((json) => {
                return _.map(json.data, (item) => ({
                    value: item.id,
                    label: item.name.fi, // TODO: use locale
                    '@id': `/v0.1/${this.props.resource}/${item.id}/`,
                    id: item.id
                }))
            }).then((json) => {
                self.setState({isLoading: false})
                return { options: json }
            })
    }

    onChange(val) {

        // Do action to save form state to storage
        let obj = {}
        obj[this.props.name] = {
            name: { fi: val.label },
            id: val.value,
            '@id': val['@id']
        }

        this.context.dispatch(setData(obj))

        if(typeof this.props.onSelection === 'function') {
            this.props.onSelection(val)
        }
    }

    render() {

        let values = {
            id: null,
            name: {}
        }

        if(typeof this.props.defaultValue === 'object') {
            values = this.props.defaultValue
        }

        return (
            <span>
                <div className="hel-select">
                    <legend style={{ position: 'relative', width: 'auto' }}>Paikka <ValidationPopover validationErrors={this.props.validationErrors} placement="right"/></legend>
                    <Select.Async
                        placeholder={this.props.placeholder}
                        value={ {label: values.name.fi, value: values.id} }
                        loadOptions={ val => this.getOptions(val)  }
                        onChange={ (val,list) => this.onChange(val,list) }
                        isLoading={this.state.isLoading}
                    />
                </div>
                <div >
                    <Input
                        type="text"
                        value={values.id}
                        label={this.context.intl.formatMessage({ id: "event-location-id" })}
                        ref="text"
                        groupClassName="hel-text-field"
                        labelClassName="hel-label"
                        disabled
                    />
                </div>
            </span>
        )
    }
}



export default HelAutoComplete
