import React from 'react';
import {Route} from 'react-router';
import {BrowserRouter, Switch} from 'react-router-dom';
import { BrowserView, MobileView } from 'react-device-detect';

import Routes from './Pages/Layout/Routes'
import Layout from "./Pages/Layout/Layout";

class App extends React.Component {
    render() {
        return (
            <BrowserRouter>
                <Switch>
                    {Routes.DefaultRoutes.map((ele) => <Route exact path={ele.path} component={ele.component}/>)}
                    {/* <Route path="/" component={Layout}/> */}
                    {/* Browser view */}
                    <BrowserView>
                        <Route path="/" component={Layout} />
                    </BrowserView>
                    
                    {/* Mobile view */}
                    <MobileView>
                        <Route path="/" component={Layout} />
                    </MobileView>
                </Switch>
            </BrowserRouter>
        );
    }
}

export default App;
