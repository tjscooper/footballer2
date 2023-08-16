# Scoreboard Data

Root level data structure fetched by API call to NFL source: [ESPN API](http://site.api.espn.com/apis/site/v2/sports/football/nfl/scoreboard)
#### Root Object

| Property            | Type                  
|---------------------|-----------------------
| leagues [ ]         | [League](#league)     
| season              | [Season](#season-1)   
| week                | [Week](#week)         
| events [ ]          | [Event](#event) 

---

## League

An array containing the following schema:

| Property            | Type                  | Example                       
|---------------------|-----------------------|---------------------------------
| id                  | string                | "28"                          
| uid                 | string                | "s:20-1:28"                   
| name                | string                | "National Football League"  
| abbreviation        | string                | "NFL"                         
| slug                | string                | "nfl"                         
| season              | [Season](#season)     | `{ "year": 2023, ... }`       
| logos [ ]           | [Logo](#logo)         | `{ href: "https://...", ... }`    
| calendarType        | string                | "list"                        
| calendarIsWhiteList | boolean               | true                          
| calendarStartDate   | Date                  | "2023-08-01T07:00Z"           
| calendarEndDate     | Date                  | "2024-02-15T07:59Z"           
| calendar [ ]        | [Calendar](#calendar) | `{ label: "Preseason", ... }` 

### League Sub-types (Extended)

#### Season
| Property     | Type                      | Example                            
|--------------|---------------------------|--------------------------
| year         | number                    | 2023                               
| startDate    | Date                      | "2023-08-01T07:00Z"                
| endDate      | Date                      | "2024-02-15T07:59Z"                
| displayName  | string                    | "2023"                             
| type         | [SeasonType](#seasontype) | `{ id: "1", ... }`  

#### SeasonType
| Property     | Type        | Example                            
|--------------|-------------|------------------------------------
| id           | string      | "25"                               
| type         | number      | 1                                  
| name         | string      | "Preseason"                         
| abbreviation | string      | "pre"                              

#### Logo
| Property     | Type        | Example                           
|--------------|-------------|-----------------------------------
| href         | string      | "25"                              
| width        | number      | 500                                
| height       | number      | 800                               
| alt          | string      | ""                                
| rel [ ]      | [string]    | [ "full", "default" ]             
| lastUpdated  | Date        | "2023-08-01T07:00Z"               

#### Calendar
| Property     | Type            | Example                       
|--------------|-----------------|-------------------------------
| label        | string          | "Preseason"                   
| value        | string          | "1"                           
| startDate    | Date            | "2023-08-01T07:00Z"           
| endDate      | Date            | "2023-09-07T07:00Z"           
| entries [ ]  | [Entry](#entry) | `{ label: "Hall of Fame", ... }`   

#### Entry
| Property       | Type          | Example                         
|----------------|---------------|---------------------------------
| label          | string        | "Hall of Fame Weekend"          
| alternateLabel | string        | "HOF"                         
| detail         | string        | "Aug 1-8"                       
| value          | string        | "1"                             
| startDate      | Date          | "2023-08-01T07:00Z"             
| endDate        | Date          | "2023-08-07T07:00Z"             


## Season

An object literal with the following schema:

| Property | Type     | Example 
|----------|----------|---------
| type     | number   | 1       
| year     | number   | 2023    


## Week

An object literal with the following schema:

| Property | Type     | Example 
|----------|----------|---------
| number   | number   | 2       


## Event

An array containing the following schema:

| Property         | Type                        | Example 
|------------------|-----------------------------|-----------------------------------------------
| id               | string                      | "409678974646"       
| uid              | string                      | "s:20-1:28-e:409678974646"
| date             | Date                        | "2023-08-07T23:00Z"
| name             | string                      | "Houston Texans at New England Patriots"
| shortName        | string                      | "HOU @ NE"
| season           | [Season](#season-2)         | `{ year: 2023, ... }`
| week             | [Week](#week-1)             | `{ number: 2 }`
| competitions [ ] | [Competition](#competition) | `{ id: "409678974646", ... }`
TODO | links [ ]        | [EventLink](#eventlink)     | `{  }` 
TODO | status           | [Status](#status)           | `{  }`

### Event Sub-types (Extended)

#### Season
| Property     | Type       | Example                            
|--------------|------------|---------------
| year         | number     | 2023                               
| type         | number     | 1
| slug         | string     | "Preseason"

#### Week
| Property | Type     | Example 
|----------|----------|---------
| number   | number   | 2       

#### Competition
| Property              | Type                                | Example 
|-----------------------|-------------------------------------|-----------------------------------------
| id                    | string                              | "409678974646"
| uid                   | string                              | "s:20~l:28~e:401548631~c:401548631"
| date                  | Date                                | "2023-08-07T12:00Z"
| attendance            | number                              | 64628
| type                  | [CompetitionType](#competitiontype) | `{ id: "1", ... }`
| timeValid             | boolean                             | true
| neutralSite           | boolean                             | false
| conferenceCompetition | boolean                             | false
| playByPlayAvailable   | boolean                             | true
| recent                | boolean                             | false
| venue                 | [Venue](#venue)                     | `{ id: "3738", ... }`
| competitors [ ]       | [Competitor](#competitor)           | `{ id: "19", ... }` 

#### CompetitionType
| Property     | Type     | Example 
|--------------|----------|-----------
| type         | string   | "1"
| abbreviation | string   | "STD"

#### Venue
| Property     | Type                | Example 
|--------------|---------------------|-------------------------------
| id           | string              | "3738"
| fullName     | string              | "Gillette Stadium"
| address      | [Address](#address) | `{ city: "Foxboro", ... }`
| capacity     | number              | 65874
| indoor       | boolean             | false

#### Address
| Property     | Type     | Example 
|--------------|----------|-----------
| city         | string   | "Foxboro"
| state        | string   | "MA"

#### Competitor
| Property          | Type                                    | Example 
|-------------------|-----------------------------------------|------------------------------------------------------
| id                | string                                  | "19"
| uid               | string                                  | "s:20-1:28-t:19"
| type              | string                                  | "team"
| order             | number                                  | 0
| homeAway          | string                                  | "home"
| winner            | boolean                                 | false
| team              | [Team](#team)                           | `{ id: "19", ... }`
| score             | string                                  | "9"
| lineScores [ ]    | [LineScore](#linescore)                 | `{ value: 3 }`
| statistics [ ]    | N/A                                     | N/A
| records [ ]       | [Record](#record)                       | `{ name: "overall", ... }`
| notes [ ]         | N/A                                     | N/A
| status            | [CompetitionStatus](#competitionstatus) | `{ clock: 0, ... }`
| broadcasts [ ]    | [Broadcast](#broadcast)                 | `{ market: "national", ... }` 
| leaders [ ]       | [LeadersDetail](#leadersdetail)         | `{ name: "passingYards", ... }`
| format            | [CompetitionFormat](#competitionformat) | `{ regulation: { ... } }`
| startDate         | Date                                    | "2023-08-10T23:00"
| geoBroadcasts [ ] | [GeoBroadcast](#geobroadcast)           | `{ type: { id: "1", ... }, ... }`
| headlines [ ]     | [Headline](#headline)                   | `{ description: "- C. Stroud would not...", ... }`

#### Team
| Property         | Type                    | Example 
|------------------|-------------------------|-----------
| id               | string                  | "19"
| uid              | string                  | "s:20-1:28-t:19"
| location         | string                  | "New England"
| name             | string                  | "Patriots"
| abbreviation     | string                  | "NE"
| displayName      | string                  | "New England Patriots"
| shortDisplayName | string                  | "Patriots"
| color            | string                  | "002a5c"
| alternateColor   | string                  | "c60c30"
| isActive         | boolean                 | true
| venue            | [TeamVenue](#teamvenue) | `{ id: "3738" }`
| links            | [TeamLink](#teamlink)   | `{ rel: [ "clubhouse", ... ], ... }`
| logo             | string                  | "https://a.espncdn.com/i/teamlogos/nfl/500/..."

#### TeamVenue
| Property         | Type       | Example 
|------------------|------------|-----------
| id               | string     | "3738"

#### TeamLink
| Property         | Type       | Example 
|------------------|------------|------------------------------------------------------------------
| rel              | [string]   | [ "clubhouse", "desktop", "team" ]
| href             | string     | "http://www.espn.com/nfl/team/_/name/ne/new-england-patriots"
| text             | string     | "Clubhouse"
| isExternal       | boolean    | false
| isPremium        | boolean    | false

#### LineScore
| Property         | Type       | Example 
|------------------|------------|-----------
| value            | number     | 3

#### Record
| Property         | Type       | Example 
|------------------|------------|----------------
| name             | string     | "overall"
| abbreviation     | string     | "Game"
| type             | string     | "total"
| summary          | string     | "0-1"

#### CompetitionStatus
| Property         | Type                      | Example 
|------------------|---------------------------|----------------
| clock            | number                    | 0
| displayClock     | string                    | "0:00"
| period           | number                    | 4
| type             | [StatusType](#statustype) | `{ id: "3", ... }`

#### StatusType
| Property         | Type        | Example 
|------------------|-------------|----------------
| id               | string      | "3"
| name             | string      | "STATUS_FINAL
| state            | string      | "post"
| completed        | boolean     | true
| description      | string      | "Final"
| detail           | string      | "Final"
| shortDetail      | string      | "Final"

#### Broadcast
| Property         | Type        | Example 
|------------------|-------------|-------------------
| market           | string      | "national"
| names            | [string]    | [ "NFL NET" ]

#### LeadersDetail
| Property         | Type              | Example 
|------------------|-------------------|---------------------------------------------
| name             | string            | "passingYards"
| displayName      | string            | "Passing Leader"
| shortDisplayName | string            | "PASS"
| abbreviation     | string            | "PYDS"
| leaders [ ]      | [Leader](#leader) | `{ displayValue: "99 YDS, 1 TD", ... }`
 
#### Leader
| Property         | Type                      | Example 
|------------------|---------------------------|-------------------
| displayValue     | string                    | "99 YDS, 1 TD"
| value            | number                    | 99
| athlete          | [Athelete](#athlete)      | `{ id: "42425646", ... }`
| team             | [LeaderTeam](#leaderteam) | `{ id: "34" }`

#### Athlete
| Property         | Type                                | Example 
|------------------|-------------------------------------|------------------------------------------------
| id               | string                              | "42425646"
| fullName         | string                              | "Davis Mills"
| displayName      | string                              | "Davis Mills"
| shortName        | string                              | "D. Mills"
| links [ ]        | [AthleteLink](#athletelink)         | `{ rel: [ "playercard, ... ], ... }`
| headshot         | string                              | "https://a.espncdn.com/i/headshots..." 
| jersey           | string                              | "10"
| position         | [AthletePosition](#athleteposition) | `{ abbreviation: "QB" }`
| team             | [AthleteTeam](#athleteteam)         | `{ id: "34" }`
| active           | boolean                             | true

#### AthleteLink
| Property         | Type       | Example 
|------------------|------------|------------------------------------------------------------------
| rel              | [string]   | [ "playercard", "desktop", "athlete" ]
| href             | string     | "http://www.espn.com/nfl/player/_/id/42425646/davis-mills"

#### AthletePosition
| Property         | Type     | Example 
|------------------|----------|---------------
| abbreviation     | string   | "QB"

#### AthleteTeam
| Property         | Type     | Example 
|------------------|----------|---------------
| id               | string   | "34"

#### LeaderTeam
| Property         | Type     | Example 
|------------------|----------|---------------
| id               | string   | "34"

#### CompetitionFormat
| Property         | Type                                  | Example 
|------------------|---------------------------------------|---------------
| regulation       | [RegulationDetail](#regulationdetail) | `{ periods: 4 }`

#### RegulationDetail
| Property         | Type      | Example 
|------------------|-----------|---------------
| periods          | number    | 4

#### GeoBroadcast
| Property         | Type                                      | Example 
|------------------|-------------------------------------------|---------------
| type             | [GeoBroadcastType](#geobroadcasttype)     | `{ id: "1", ... }`
| market           | [GeoBroadcastMarket](#geobroadcastmarket) | `{ id: "1", ... }`   
| media            | [GeoBroadcastMedia](#geobroadcastmedia)   | `{ shortName: "NFL NET" }`
| lang             | string                                    | "en"
| region           | string                                    | "us"

#### GeoBroadcastType
| Property         | Type       | Example 
|------------------|------------|---------------
| id               | string     | "1"
| shortName        | string     | "TV"

#### GeoBroadcastMarket
| Property         | Type       | Example 
|------------------|------------|---------------
| id               | string     | "1"
| shortName        | string     | "National"

#### GeoBroadcastMedia
| Property         | Type       | Example 
|------------------|------------|---------------
| shortName        | string     | "NFL NET"

#### Headline
| Property         | Type       | Example 
|------------------|------------|----------------------------------------------------------------
| description      | string     | `{ description: "- C. Stroud would not...", ... }`
| type             | string     | "Recap"
| shortLinkText    | string     | "No. 2 pick C. Stroud struggles in his preseason debut..."


---
