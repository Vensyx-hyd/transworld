import React, { Component } from "react";
import { compose } from "recompose";
import {
    withScriptjs,
    withGoogleMap,
    GoogleMap,
    Marker,
    InfoWindow,
    TrafficLayer
} from "react-google-maps";
import { Badge } from '@material-ui/core';

import MapControl from './MapControl';
import runningIcon from './Icons/running_trailer.png';
import idleIcon from './Icons/idle_trailer.png';
import placeIcon from './Icons/place.png';
import AppAPI from '../../../API';
import mapStyles from './mapStyles';

//import socketIOClient from 'socket.io-client';

function SetMarker(props,type,onClick,icon) {   
    return(
        <Marker               
            // label={type.shelter}                                 
            icon={{
                url: icon,
                scaledSize:  new window.google.maps.Size(30,30)
            }}
            key={type.id}
            onMouseOver={onClick}
            position={{lat: type.latitude, lng: type.longitude}}
        >           
            {
                props.selectedMarker === type 
                &&
                <InfoWindow>
                    <div style={{backgroundColor: '#b8b5d766', color: '#332c6f', padding: '15px', fontSize: '12px', textTransform: 'capitalize', fontWeight: 'bold'}}>
                       {type.shelter}
                    </div>
                </InfoWindow>
            }
        </Marker>
    );
}

const MapWithAMarker = compose(withScriptjs, withGoogleMap)(props => {        
    return (
        <GoogleMap                                  
            defaultZoom={12} 
            defaultCenter={{ lat:22.83, lng: 69.72 }}
            defaultOptions={{ styles: mapStyles,
            //  mapTypeControlOptions: {position: window.google.maps.ControlPosition.TOP_CENTER} 
             }}                                    
        >            
            <TrafficLayer autoUpdate />
            <MapControl position={window.google.maps.ControlPosition.RIGHT_CENTER}>
                <div id="filter" style={{
                        position: 'relative',
                        boxShadow: '0px 0px 5px 1px #bfbfbf96',
                        borderRadius: '3px',
                        bottom: '45px', right: '10px', 
                        height: 'auto', width: '40px', 
                        backgroundColor: '#FFFFFF',
                        cursor: 'pointer',
                        padding: '5px'}}
                    >                                           
                        <Badge badgeContent={props.runCount} color="primary" >
                            <img onClick={props.handleClickRemoveIdle} src={runningIcon} style={{width: '30px', marginTop: '5px', marginBottom: '10px'}} />                                                
                        </Badge>
                        <Badge badgeContent={props.idleCount} color="error" >
                            <img onClick={props.handleClickRemoveRun} src={idleIcon} style={{width: '30px', marginTop: '5px'}} />
                        </Badge>                      
                    </div>   
                
            </MapControl>
            {                
                props.closeRun === false
                ?
                props.running.map(run => {
                const onClick = props.onClickRun.bind(this, run);
                    return(
                        SetMarker(props, run, onClick, runningIcon)
                    );
                })
                :
                null
            }  
            {
                props.closeIdle === false
                ?
                props.idle.map(idle => {
                const onClick = props.onClickIdle.bind(this, idle);
                    return(
                        SetMarker(props, idle, onClick, idleIcon)
                    );
                })
                :
                null
            }       
            { 
                props.places.map(place => {
                const onClick = props.onClickPlace.bind(this, place);
                    return(
                        SetMarker(props, place, onClick, placeIcon)
                    );
                })
            } 
        </GoogleMap>
    )
});
export default class MapContainer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            locations: [],
            data: [],
            sheltersRunning: [],
            runCount: 0,
            idleCount: 0,
            sheltersIdle: [],
            places: [],
            selectedMarker: false,
            runClose: false,
            idleClose: false,
            response: false,
            endpoint: "https://cfsmanager-dev.azurewebsites.net/api/"
        }
    }

    places() {
        AppAPI.places.get(null, null).then((res) => {
            console.log(res.place, "Places Data");
            this.setState({ places: res.place })            
        }).catch( e => {
            console.log(e, "Places Error");
        });
    }

    filterLocations(locations){
        console.log(locations, "LOCATIONS");
        const running = locations.filter(function(run){
            return run.status === "RUNNING";
        }); 
        const completed = locations.filter(function(idle){
            return idle.status === "IDLE";
        });   
        this.setState({
            sheltersRunning: running,
            runCount: running.length,            
            sheltersIdle: completed,
            idleCount: completed.length
        })             
        console.log(this.state.sheltersRunning, "Running");
        console.log(this.state.sheltersIdle, "IDLE");
    }

    runningLocations() {
        AppAPI.runningInfo.get(null, null).then((res) => {
            console.log(res.location, "Running Locations Data");
            const locations = res.location;
            const running = locations.filter(function(run){
                return run.status === "RUNNING";
            });  
            console.log(running, "Running Trips");
            this.setState({
                sheltersRunning: running,
                runCount: running.length  
            }); 
        }).catch( e => {
            console.log(e, "Running Location Error");
        });        
    }

    idleLocations() {
        AppAPI.idleInfo.get(null, null).then((res) => {
            console.log(res.location, "Idle Locations Data"); 
            const idle = res.location;
            this.setState({  
                sheltersIdle: idle,
                idleCount: idle.length
            }); 
        }).catch( e => {
            console.log(e, "Idle Location Error");
        });        
    }

     // const { endpoint } = this.state;

        // const socket = socketIOClient(endpoint);
        //     socket.on("FromAPI", data => 
        //     this.filterLocations(data)
        // ); 

    locations() {
        // this.runningLocations();
        // this.idleLocations();
        AppAPI.runningInfo.get(null, null).then((res) => {
            console.log(res.location, "Locations Data");     
            this.filterLocations(res.location);
        }).catch( e => {
            console.log(e, "Locations Error");
        });     
    }

    componentDidMount() {
        this.places();        
        this.locations();
        // this.runningLocations();   
        // this.idleLocations();
        this.interval = setInterval(() => this.locations(), 120000);
    }    

    handleClickRunning = (run, event) => {
        this.setState({selectedMarker: run})
    };

    handleClickIdle = (idle, event) => {
        this.setState({selectedMarker: idle})
    };

    handleClickPlace = (place, event) => {
        this.setState({selectedMarker: place})
    };

    handleClickRemoveRun = () => {
        this.setState({ runClose: true, idleClose: false })
    }

    handleClickRemoveIdle = () => {
        this.setState({ idleClose: true, runClose: false })
    }

    render() {
        return (
                <MapWithAMarker           
                    id="map"                                     
                    closeRun={this.state.runClose}   
                    closeIdle={this.state.idleClose} 
                    handleClickRemoveIdle={this.handleClickRemoveIdle}
                    handleClickRemoveRun={this.handleClickRemoveRun}
                    selectedMarker={this.state.selectedMarker}
                    places={this.state.places}
                    running={this.state.sheltersRunning}
                    runCount={this.state.runCount}
                    idleCount={this.state.idleCount}
                    idle={this.state.sheltersIdle}
                    onClickRun={this.handleClickRunning}
                    onClickIdle={this.handleClickIdle}
                    onClickPlace={this.handleClickPlace}
                    googleMapURL="https://maps.googleapis.com/maps/api/js?key=AIzaSyBhuhypIBi6-FbQWoy5goSU6LFERQfPE8E&v=3.exp&libraries=geometry,drawing,places"
                    loadingElement={<div style={{height: `100%`}}/>}
                    containerElement={<div style={{height: `61vh`}}/>}                            
                    mapElement={<div style={{height: `100%`}}/>}
                />  
        )
    }
}