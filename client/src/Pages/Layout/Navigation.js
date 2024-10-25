import React from 'react';
import List from '@material-ui/core/List';
import {Link} from "react-router-dom";

class LeftNavigation extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            toggleDropDown: true,
            selectedMenuIdx: "",
            selectedSubMenuTitle: ""
        }
    }

    logoutUser() {

    }

    openMenu(menu) {
        this.setState({
            selectedMenu: menu,
            toggleDropDown: false
        })
    }

    closeMenu() {
        this.setState({
            toggleDropDown: true,
            selectedMenu: ""
        })
    }

    getMenuOptions(subMenu) {
        if (subMenu === this.state.selectedSubMenuTitle) {
            this.setState({
                selectedSubMenuTitle: ""
            })
        } else {
            this.setState({
                selectedSubMenuTitle: subMenu
            })
        }
    }

    render() {
        return (
            <div>
                <label className="text-color pl-3 pt-2">{this.props.menus.mainTitle}</label>
                {this.props.menus.menus.map((menu, index) => {
                    let that = this;
                    if (menu.subMenus) {
                        return (
                            <List className="navmenu-text" key={index}
                                  style={{paddingTop: "5px", paddingBottom: '0px'}}>
                                <List key={index} className="pl-3 hovered"
                                      style={{paddingTop: "5px", paddingBottom: '0px'}}>
                                    <span>
                                        <img src={menu.icon} alt={menu.title} className="img-fluied icon-design"/>
                                        <label className="text-white" style={{cursor: "pointer"}}>{menu.title}</label>
                                        {(this.state.selectedMenu === menu.title) ?
                                            <img src="/assets/icons/up.svg"
                                                 alt="drop-down" className="img-fluied icon-design-arrow float-right"
                                                 onClick={this.closeMenu.bind(this)}/> :

                                            <img src="/assets/icons/down.svg"
                                                 alt="drop-down" className="img-fluied icon-design-arrow float-right"
                                                 onClick={this.openMenu.bind(this, menu.title)}/>
                                        }
                                        {(this.state.selectedMenu === menu.title) ?
                                            <div>
                                                {(menu.subMenus.length > 0) ?
                                                    <div className="pl-5">
                                                        {(menu.subMenus.map((subMenu, idx) => {
                                                            if (subMenu.menus) {
                                                                return (
                                                                    <div key={idx}>
                                                                        <Link
                                                                            to={(subMenu.navLink === "/") ? that.logoutUser.bind(this) : subMenu.navLink}
                                                                            className="navmenu-text" key={index}>
                                                                            <label className="text-white"
                                                                                   onClick={this.getMenuOptions.bind(this, subMenu.title)}>{subMenu.title}</label>
                                                                            {(this.state.selectedSubMenuTitle === subMenu.title) ?
                                                                                <div>
                                                                                    {(subMenu.menus.map((menu, idx) => {
                                                                                        return (
                                                                                            <div key={idx}
                                                                                                 className="pl-4">
                                                                                                <Link
                                                                                                    to={(menu.navLink === "/") ? that.logoutUser.bind(this) : menu.navLink}
                                                                                                    className="navmenu-text"
                                                                                                    key={index}>
                                                                                                    <label
                                                                                                        className="text-white"
                                                                                                        style={{cursor: "pointer"}}>{menu.title}</label>
                                                                                                </Link>
                                                                                            </div>
                                                                                        );
                                                                                    }))}
                                                                                </div> :
                                                                                null
                                                                            }
                                                                        </Link>
                                                                    </div>
                                                                );
                                                            }
                                                            return (
                                                                <div key={idx} className="">
                                                                    <Link
                                                                        to={(menu.navLink === "/") ? that.logoutUser.bind(this) : subMenu.navLink}
                                                                        className="navmenu-text" key={index}>
                                                                        <label className="text-white point"
                                                                               style={{cursor: "pointer"}}
                                                                               onClick={this.getMenuOptions.bind(this, subMenu.title)}>{subMenu.title}</label>
                                                                    </Link>
                                                                </div>
                                                            );
                                                        }))}
                                                    </div> :
                                                    null}
                                            </div>
                                            : null}
                                    </span>
                                </List>
                            </List>
                        );
                    }
                    return (
                        <Link to={(menu.navLink === "/") ? that.logoutUser.bind(this) : menu.navLink}
                              className="navmenu-text" key={index}>
                            <List key={index} style={{paddingBottom: '0px'}} className="pl-3 hovered">
                                <span>
                                    <img src={menu.icon} alt={menu.title} className="img-fluied icon-design"/>
                                    <label className="text-white" style={{cursor: "pointer"}}>{menu.title}</label>
                                </span>
                            </List>
                        </Link>
                    );
                })}
            </div>
        );
    }

}

export default (LeftNavigation);