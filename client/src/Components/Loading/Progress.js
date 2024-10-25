import React from 'react';
import { FlapperSpinner } from "react-spinners-kit";
class Progress extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
        };
    }

    render() {
        const {loading} = this.state;
        return (
            <FlapperSpinner
                size={18}
                color="#332C6F"
                loading={loading}
            />
        );
    }
}

export default (Progress);