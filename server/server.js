Houston.add_collection(Meteor.users);
Houston.add_collection(Houston._admins);
Houston.add_collection(Markers);
Houston.add_collection(Polylines);
Houston.add_collection(pendingRequests);
Houston.add_collection(requestApproval);
Houston.add_collection(friendList);

function allowDrop(ev) {
    ev.preventDefault();
}

function drag(ev) {
    ev.dataTransfer.setData("text", ev.target.id);
}

function drop(ev) {
    ev.preventDefault();
    var data = ev.dataTransfer.getData("text");
    ev.target.appendChild(document.getElementById(data));
}