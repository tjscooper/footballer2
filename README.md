# Footballer 2

### Description

Footballer was created to integrate the Meteor development framework with a popular UI design system such as Material UI, a simple authentication system, and the history of features from Footballer 1.  The framework should springboard future development of a golf pool management application.

### Why create Footballer 2?

The original code base from Footballer goes back to 2015.  This legacy code base carries a number of security issues, as well as breaking dependencies when using the latest React framework (currently 17).  Another factor is the Football scores API source, which has been deprecated.  Fortunately, another API source has been discovered and will hopefully serve as a replacement for Footballer 2.

### Features for MVP

- [x] [Scheduled Tasks](#scheduled-tasks)
- [ ] [UI Design](#ui-design)
- [ ] UI Scaffolding
- [ ] Unit Testing Framework
- [ ] Jobs Service
- [ ] Weeks Service
- [ ] Games Service
- [ ] Picks Service
- [ ] Dashboard Service
- [ ] Settings Service
- [ ] User Service

---

### Scheduled Tasks

The application must be able to run data fetching methods on a specified time schedule and interval.  A service must be created to register, start, and stop scheduled "jobs" as a singleton in order to ensure a single registry is utilized.

Jobs should be created with a unique name in order to find and perform additional actions (such as cancel or pause).  An interface to control the scheduled actions would be ideal, but not critical for release.

I'll be using the following library to delivery the required capablities:

> meteor/percolate:synced-cron

The application will initialize the "CronService" at start up.  

### UI Design

With the shift to Material UI, the application will take on a different look & feel. I'm aiming for a more data rich experience, with users being able to modify their preferences and enjoy the UX.  

I'd like to introduce a few new components to the experience:

- [ ] Improved Pick selection with more data to support the choice
- [ ] The ability to navigate to previous weeks
- [ ] More show / hide options for the live games view (ie. hide completed)
- [ ] More sort options for the live games view (ie. day / night games)
- [ ] Condensed Dashboard view with useful metrics
- [ ] Use of right drawer for additional context

![ui-design-01](/assets/ui-design-01.png)

---
###### Version 0.1.0