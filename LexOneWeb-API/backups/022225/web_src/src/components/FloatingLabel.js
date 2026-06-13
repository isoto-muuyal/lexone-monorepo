import React from 'react';


const FloatingInputs = props => {
    return (
        <div class="position-relative upInputs">
            {props.children}
            <label class="upLabel">{props.labelName}</label>
        </div>
    )
}

export default FloatingInputs;