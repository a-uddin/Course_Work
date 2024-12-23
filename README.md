Design a web server application consisting of the backend and front end in separate files ,using node js express , mongo dB and mongoose to design the RESTAPI.
The BackEnd application run as web server using express having a REST API.
<strong>1. Backend</strong> 
1.1 Create a Mongo dB collection to hold the data from the given CSV file. name this collection as FootBall Data or any appropriate name.
1.2 Create mongoose Schema in a JS separate file for this dataset and from this Schema create a model to be used in add, delete, update and find queries.
1.3 Create another file import the file that you uses mongoose Schema created in 1.2 and make connection with mongoDB.
1.4 Create a separate JS file (server.js ) that runs a web server using express and import the files created in 1.2 and 1.3.
<strong>Add the code in Server.js as required in the following :</strong>
1.5 , Add a Query in a POST method of the REST API that should be able to Add the data to the Football collection in mongoDB to
Team, Games Played, Win, Draw, Loss, Goals For, Goals Against, Points and Year
1.6. write Query in a separate POST method for updating a single record for a Given Team.
1.8 It should also have a separate endpoint using the POST method for deleting the record for a given Team.
1.7 It should also have an separate Get method to show the total games Played, Draw and Won for the given year.
1.9 it should have an endpoint to have a Query to display the first 10 records from the Football data base to display all the Teams including all nine columns)) for the match “won” greater than a given value entered by the user. the data should be displayed on
browser.
2.0. it should have an endpoint having a Query to display the all the Team (including all nine columns) where average “Goal For” for a given year entered by the user the data should be displayed on browser. 

<strong>2. Front End Application</strong>
Create Front end using React Application consisting of Components (either using functional or Class compoment) that should be able to create user interface and access the appropriate REST API method using axios API.
2.1 A component that makes a user interface using Form and HTML elements for adding data i.e. number of Team,Games Played,Win,Draw,Loss,Goals For,Goals Against,Points,Year to the collection in mongoDB through axios API.
2.2 A component that to create user interface using Form and HTML element for update Team,Games Played,Win,Draw,Loss,Goals For,Goals Against,Points,Year for a given team Name.
2.3 Create a User interface to show total total games Played, Draw and Won for a given Team.
2.4. A component that to create a user interface for deleting a record for a given team.
2.5. A component that to create userinterface to display first 10 drecords from the records for Task mentioned in 1.9.
2.6. user interface to result of Task 2.0 i.e. Query to display the all the Team (including all nine columns) where average “Goal For” for a given year.
2.7 A React Router Application that integrates all the above components. 
