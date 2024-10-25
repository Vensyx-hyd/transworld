import React, {Component} from 'react';
import approvalsData from '../../../PreloadedData/approvals.json';
import FuelApprovals from './Fuel/FuelApprovals';
import MaintenanceApprovals from './Maintenance/MaintenanceApprovals';
import LeaveApprovals from './Leave/LeaveApprovals';

export default class Approvals extends Component {
    constructor(props) {
        super(props);
        this.state = {
            approvals: approvalsData,
            tabSelection: "Fuel"
        }
    }

    selectedTab(data) {
        this.setState({
            tabSelection: data
        })
    }

    renderApprovals() {
        let html = null;
        switch (this.state.tabSelection) {
            case 'Fuel' :
                html = <FuelApprovals/>;
                break;
            case 'Maintenance' :
                html = <MaintenanceApprovals/>;
                break;
            case 'Leave' :
                html = <LeaveApprovals/>;
                break;
            default:
                break;
        }
        return html;
    }

    render() {
        return (
            <div>
                <p className="titleCard">Menu / Approvals</p>
                <div className="row tablePad">
                    {(this.state.approvals.map((item, idx) => {
                        if (this.state.tabSelection === item.title) {
                            return (
                                <div className={"col-12 col-sm-12 col-md-4 col-lg-4 text-white " + item.selectedMenu}
                                    onClick={this.selectedTab.bind(this, item.title)}>{item.title}</div>
                            );
                        }
                        return (
                            <div className="col-12 col-sm-12 col-md-4 col-lg-4 tabDesign "
                                onClick={this.selectedTab.bind(this, item.title)}>{item.title}</div>
                        );
                    }))}                          
                    {this.renderApprovals()}
                </div>
            </div>
        );
    }
}