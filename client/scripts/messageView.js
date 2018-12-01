var MessageView = {

  render: _.template(`
      


      <div class="chat" id="<%- objectId %>">
        <div class="roomname"><%- roomname %></div>
        <div class="username"><%- username %></div>
        <div class="text"><%- text %></div>
        <div class="createdAt"><%- createdAt %></div>
      </div>
    `)

};



// <!--

//       -->
//       <div class="chat">
//         <div
//           class="username <%= Friends.isFriend(username) ? 'friend' : '' %>"
//           data-username="<%- username %>">
//           <%- username %>
//         </div>
//         <div><%- text %></div>
//       </div>
//       <!--
//             -->