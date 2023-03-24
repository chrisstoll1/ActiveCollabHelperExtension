import "../../assets/css/components/Badge/Badge.css"

function Badge(props){
    return (
        <span className={`badge badge-${props.color} ${props.customClass}`}>
            {(props.icon) ?
                <i className="material-icons badge-icon">{props.icon}</i>
            :
                null
            }
            {(props.text) ?
                <span className="badge-text">{props.text}</span>
            :
                null
            }
            {(props.counter) ?
                <span className="badge-counter">{props.counter}</span>
            :
                null
            }
        </span>
    )
}

export default Badge;