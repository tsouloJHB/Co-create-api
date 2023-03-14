import React from "react";
import './Notification.css'

const Notifications = () =>{

    return (
        <div>
            <div class="sidebar-title">
                    <h4>Notifications</h4>
                 
                </div>
                <div class="event">
                    <div class="left-event">
                        <h3>18</h3>
                        <span>March</span>
                    </div>
                    <div class="right-event">
                        <h4>Social Media</h4>
                        <p><i class="fas fa-map-marker-alt"></i> Willson Tech Park</p>
                        <a href="#">More Info</a>
                    </div>
                </div>
                <div class="event">
                    <div class="left-event">
                        <h3>22</h3>
                        <span>June</span>
                    </div>
                    <div class="right-event">
                        <h4>Mobile Marketing</h4>
                        <p><i class="fas fa-map-marker-alt"></i> Willson Tech Park</p>
                        <a href="#">More Info</a>
                    </div>
                </div>
                <div class="sidebar-title">
                    <h4>Advertisement</h4>
                    <a href="#">close</a>
                </div>
               
                <div class="sidebar-title">
                    <h4>Conversation</h4>
                    <a href="#">Hide Chat</a>
                </div>
        </div>
    )
}

export default Notifications