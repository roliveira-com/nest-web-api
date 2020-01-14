const evtSource = new EventSource('http://localhost:3000/users/notifications');

evtSource.onmessage = function(event) {
    console.log(JSON.parse(event.data))
    const notification = JSON.parse(event.data);
    const notificationContainer = document.getElementById('notification')
    notificationContainer.innerText = notification.message
}