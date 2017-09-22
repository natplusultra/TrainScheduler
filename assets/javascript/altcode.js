
// initialize firebase
var config = {
	apiKey: "AIzaSyAhQZLWKG6sdGiwKSnmG-Y_6jVlwzZtTEU",
    authDomain: "train-scheduler-44bd7.firebaseapp.com",
    databaseURL: "https://train-scheduler-44bd7.firebaseio.com",
    projectId: "train-scheduler-44bd7",
    storageBucket: "train-scheduler-44bd7.appspot.com",
    messagingSenderId: "379917877248"
};

firebase.initializeApp(config);
var database = firebase.database();

// display current time
var currentTime = null;

function updateTime() {
	currentTime = moment().format("HH:mm:ss");
	$("#currentTime").html(currentTime);
}

$(document).ready(function() {
	updateTime();
	setInterval(updateTime, 1000);
});

// button for adding trains
$("#add-train-btn").on("click", function(event) {
	event.preventDefault();

	// grabs user input
	var trainName = $("#train-name-input").val().trim();
	var trainDestination = $("#destination-input").val().trim();
	var trainTime = $("#train-time-input").val().trim();
	var trainFrequency = parseInt($("#frequency-input").val().trim());

	// local temporary object for storing train data
	var newTrain = {
		name: trainName,
		destination: trainDestination,
		time: trainTime,
		frequency: trainFrequency
	};

	// uploads the train data to the firebase database
	database.ref().push(newTrain);

	console.log(newTrain.name);
	console.log(newTrain.destination);
	console.log(newTrain.time);
	console.log(newTrain.frequency);

	alert("Train successfully added!");

	// clears all of the text boxes
	$("#train-name-input").val("");
	$("#destination-input").val("");
	$("#train-time-input").val("");
	$("#frequency-input").val("");

	// prevents loading a new page
	return false;
});

function addTrain(childSnapshot) {

	var train = {
		trainName: childSnapshot.val().name,
		trainDestination: childSnapshot.val().destination,
		trainTime: childSnapshot.val().time,
		trainFrequency: childSnapshot.val().frequency,
		minutesAway: 0,
		nextArrival: ""
	}

	// converts the train time
	var timeConverted = moment(train.trainTime, "HH:mm");
	console.log("Time converted: " + timeConverted);

	// calculate the difference between first train time and now
	var timeDiff = moment().diff(moment(timeConverted), "minutes");
	console.log("Difference in time: " + timeDiff);

	// calculate minutes until next train 
	var remainder = timeDiff % train.trainFrequency;
	console.log("Remainder: " + remainder);
	console.log("Train Frequency:" + train.trainFrequency)
	train.minutesAway = train.trainFrequency - remainder;
	console.log("Minutes away: " + train.minutesAway);

	// calculate next train
	var nextTrain = moment().add(train.minutesAway, "minutes");

	// arrival time
	train.nextArrival = moment(nextTrain).format("HH:mm");
	console.log("Next arrival: " + train.nextArrival);

	// add each train's data into the table
	$("#new-train").append("<tr><td>" + train.trainName + "</td><td>" + train.trainDestination + "</td><td>" + "Every " + train.trainFrequency + " min" + "</td><td>" + train.nextArrival + "</td><td>" + train.minutesAway + " min" + "</td></tr>");
}

// creates firebase event for adding train to database and adds a row to the html
database.ref().on("child_added", function(childSnapshot) {

	addTrain(childSnapshot);

}, function(errorObject) {
	console.log("Errors handled: " + errorObject.code);
});

setInterval(function() {
	location.reload(true);
	// clear tbody
	// read from database
	// call "child_added" function

	// $("#new-train").empty();
	// database.ref().once('value').then(function(snapshot) {
	// 	console.log(snapshot.val());
	// 	addTrain(snapshot.val());
	// })
}, 60000);




