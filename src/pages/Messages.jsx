import React from 'react'

export default function Messages() {
  return (
    <div id="screen-messages" className="screen active">
      <header className="app-header">
        <h2>Messages</h2>
      </header>
      <div className="scroll-content">
        <div className="message-list">
          <div className="message-item unread">
            <img src="https://randomuser.me/api/portraits/women/44.jpg" alt="Sophie R." className="avatar" />
            <div className="message-info">
              <h4>Sophie R. <span className="time">10:42 AM</span></h4>
              <p>Hi! Are you still looking for someone to split a ride to Alexanderplatz?</p>
            </div>
          </div>
          <div className="message-item">
            <img src="https://randomuser.me/api/portraits/men/32.jpg" alt="Liam K." className="avatar" />
            <div className="message-info">
              <h4>Liam K. <span className="time">Yesterday</span></h4>
              <p>Great meeting you! Safe travels.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
