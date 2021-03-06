import React, { Component, createRef } from 'react'
import bulmaCollapsible from '@creativebulma/bulma-collapsible'
import classnames from 'classnames'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronDown } from '@fortawesome/free-solid-svg-icons'

class Accordion extends Component {
    constructor(props) {
        super(props)
        this.collapsibles = createRef()
    }

    componentDidMount() {
        this.collapsibles = bulmaCollapsible.attach('.is-collapsible', {
            container: this.refs.collapsibles
        })
    }

    render() {
        const { title, children, className, isActive = false } = this.props
        const classesHeader = classnames('card-header', className)
        const contentClasses = classnames(
            'content is-collapsible',
            isActive && 'is-active'
        )

        return (
            <div ref='collapsibles' id='accordion' className='card'>
                <header className={classesHeader}>
                    <a
                        className='card-header-title'
                        style={{ textDecoration: 'none' }}
                        href='#collapsible'
                        data-action='collapse'
                    >
                        {title}
                        <span className='icon'>
                            <FontAwesomeIcon icon={faChevronDown} />
                        </span>
                    </a>
                </header>
                {/* <div className='card-content'> */}
                <div
                    id='collapsible'
                    className={contentClasses}
                    data-parent='accordion'
                >
                    {children}
                </div>
                {/* </div> */}
            </div>
        )
    }
}

export default Accordion
