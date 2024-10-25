import React from 'react';
import { PulseSpinner } from "react-spinners-kit";
class Spinner extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
        };
    }

    render() {
        const {loading} = this.state;
        return (
            <PulseSpinner
                size={15}
                color="#14A474"
                loading={loading}
            />
        );
    }
}

export default (Spinner);