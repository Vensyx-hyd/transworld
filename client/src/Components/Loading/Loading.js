import React from 'react';
import {PushSpinner} from "react-spinners-kit";
class Loading extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
        };
    }

    render() {
        const {loading} = this.state;
        return (
            <PushSpinner
                size={15}
                color="#332c6f99"
                loading={loading}
            />
        );
    }
}

export default (Loading);