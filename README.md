# Footballer 2

### Description

Footballer was created to integrate the Meteor development framework with a popular UI design system such as Material UI, a simple authentication system, and the history of features from Footballer 1.  The framework should springboard future development of a golf pool management application.

### Why create Footballer 2?

The original code base from Footballer goes back to 2015.  This legacy code base carries a number of security issues, as well as breaking dependencies when using the latest React framework (currently 17).  Another factor is the Football scores API source, which has been deprecated.  Fortunately, another API source has been discovered and will hopefully serve as a replacement for Footballer 2.

### Requirements / Features

- [x] [Scheduled Tasks](#scheduled-tasks)
- [ ] User Journey Map
- [x] [UI Design](#ui-design)
- [x] UI Scaffolding
- [ ] Unit Testing Framework
- [x] Feed Service
- [x] Week Service
- [x] Game Service
- [x] Pick Service
- [ ] Dashboard Service
- [ ] Settings Service
- [ ] User Service

---

### Scheduled Tasks

The application must be able to run data fetching methods on a specified time schedule and interval.  A service must be created to register, start, and stop scheduled "jobs" as a singleton in order to ensure a single registry is utilized.

Jobs should be created with a unique name in order to find and perform additional actions (such as cancel or pause).  An interface to control the scheduled actions would be ideal, but not critical for release.

To enable this functionality, I'll be using the following library to delivery the required capablities:

> meteor/percolate:synced-cron

The application will initialize the "CronService" at start up.  

### User Journey Map

The exercise of creating a flowchart containing actions by user and system enables us to assess our overall progress. 

Once a user journey map is created, it should be treated as the blueprint for the next release.  It should describe how the application operates at any given decision point.

###### Map 01
![user-journey-map](/assets/user-journey-map-01.png)


### UI Design

With the shift to Material UI, the application will take on a different look & feel. I'm aiming for a more data rich experience, with users being able to modify their preferences and enjoy the UX.  

I'd like to introduce a few new components to the experience:

- [ ] Improved Pick selection with more data to support the choice
- [ ] The ability to navigate to previous weeks
- [ ] More show / hide options for the live games view (ie. hide completed)
- [ ] More sort options for the live games view (ie. day / night games)
- [ ] Condensed Dashboard view with useful metrics
- [ ] Use of right drawer for additional context

###### Home Prototype 01
![ui-design-01](/assets/ui-design-01.png)

###### My Picks Prototype 01
![ui-my-picks-01](/assets/ui-my-picks-01.png)

---

### TODO List

- [x] Add "is Winning" logic to Games List
- [x] Add "show active" toggle to Games List
- [ ] Add chart for users above Games List
- [ ] Standardize menu system across the app
- [ ] Add reportService to aggregate data for chart
- [ ] Add reportService to scores workflow
- [ ] Add notification system
- [ ] Add mail integration
- [ ] Add settings
- [ ] Add data migration service

---
### Starting the Application

Point Meteor to local MongoDB
```
export MONGO_URL=mongodb://localhost:27017/footballer2
```
Run Meteor
```
meteor
```

---
###### Version 0.1.0