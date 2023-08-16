# Schedule Data

Root level data structure fetched by API call to NFL source: [ESPN API](https://site.web.api.espn.com/apis/v2/scoreboard/header?sport=football&league=nfl&region=us&lang=en&contentorigin=espn&tz=America%2FNew_York)

#### Root Object

| Property            | Type                  
|---------------------|-----------------------
| sports [ ]          | [Sport](#sport)     


---

## Sport

An array containing the following schema:

| Property            | Type                  | Example                       
|---------------------|-----------------------|---------------------------------
| id                  | string                | "20"                          
| uid                 | string                | "s:20"
| guid                | string                | "453793458-38045743758-438975"                
| name                | string                | "Football"                           
| slug                | string                | "football"                         
| logos [ ]           | [Logo](#logo)         | `{ href: "https://...", ... }`    
| leagues [ ]         | [League](#league)     | `{ id: "28", ... }`

### Sport Sub-types (Extended)

#### Logo
| Property     | Type        | Example                           
|--------------|-------------|-----------------------------------
| href         | string      | "25"                              
| width        | number      | 500                                
| height       | number      | 800                               
| alt          | string      | ""                                
| rel [ ]      | [string]    | [ "full", "default" ]                           

#### League
| Property     | Type                    | Example                           
|--------------|-------------------------|----------------------------------------
| id           | string                  | "28"  
| uid          | string                  | "s:20-l:28"
| name         | string                  | "National Football League"
| abbreviation | string                  | "NFL"
| shortName    | string                  | "NFL"
| slug         | string                  | "nfl"
| tag          | string                  | "nfl"
| isTournament | boolean                 | false
| smartDates   | [SmartDate](#smartdate) | `{ label: "Preseason Week 1", ... }`
| events       | [Event](#event)         | `{  }`     

#### SmartDate
| Property     | Type            | Example                       
|--------------|-----------------|-------------------------------
| label        | string          | "Preseason Week 1"
| season       | number          | 2023
| seasonType   | number          | 1
| week         | number          | 2                   

## Event

An array containing the following schema:

| Property            | Type                        | Example 
|---------------------|-----------------------------|---------------------------------------------------
| id                  | string                      | "401547661"       
| uid                 | string                      | "s:20~l:28~e:401547661~c:401547661"
| date                | Date                        | "2023-08-17T23:30:00Z"
| timeValid           | boolean                     | false
| recent              | boolean                     | false
| name                | string                      | "Cleveland Browns at Philadelphia Eagles"
| shortName           | string                      | "CLE @ PHI"
| links [ ]           | [EventLink](#eventlink)     | `{ rel: [ "summary", "desktop", "event" ], ... }`
| gamecastAvailable   | boolean                     | false
| playByPlayAvailable | boolean                     | false
| commentaryAvailable | boolean                     | false
| onWatch             | boolean                     | false
| competitionId       | string                      | "401547661"
| location            | string                      | "Lincoln Financial Field"
| season              | number                      | 2023
| seasonStartDate     | Date                        | "2023-08-01T07:00:00Z"
| seasonEndDate       | Date                        | "2023-09-07T06:59:00Z"
| seasonType          | string                      | "1"
| seasonTypeHasGroups | boolean                     | false
| group               | [Group](#group)             | `{ groupId: "1", ... }`
| week                | number                      | 3
| weekText            | string                      | "Preseason Week 2"
| link                | string                      | "https://www.espn.com/nfl/game/_/gameId..."
| status              | string                      | "pre"
| summary             | string                      | "8/17 - 7:30 PM EDT"
| period              | number                      | 0
| clock               | string                      | "0:00"
| broadcasts [ ]      | [Broadcast](#broadcast)     | `{ typeId: 1, ... }`
| broadcast           | string                      | "NFL NET"
| odds                | [Odd](#odd)                 | `{ details: "PHI -3.5", ... }`
| fullStatus          | [FullStatus](#fullstatus)   | `{ clock: 0, ... }`
| competitors [ ]     | [Competitor](#competitor)   | `{ id: "5", ... }`
| appLinks [ ]        | [AppLink](#applink)         | `{  }`

### Event Sub-types (Extended)

#### EventLink
| Property         | Type       | Example 
|------------------|------------|------------------------------------------------------------------
| rel              | [string]   | [ "summary", "desktop", "event" ]
| href             | string     | "https://www.espn.com/nfl/game/_/gameId/401547661"
| text             | string     | "Gamecast"

#### Group
| Property         | Type       | Example 
|------------------|------------|------------------------------------------------------------------
| groupId          | string     | "1"
| name             | string     | "Preseason"
| abbreviation     | string     | "pre"
| shortName        | string     | "pre"

#### Broadcast
| Property         | Type        | Example 
|------------------|-------------|-------------------
| typeId           | number      | 1
| priority         | number      | 1
| type             | string      | "TV"
| isNational       | boolean     | true
| broadcasterId    | number      | 398
| broadcastId      | number      | 398
| name             | string      | "NFL NET"
| shortName        | string      | "NFL NET"
| callLetters      | string      | "NFL"
| station          | string      | "NFL"
| lang             | string      | "en"
| region           | string      | "us"
| slug             | string      | "nfl"

#### Odd
| Property         | Type                          | Example 
|------------------|-------------------------------|-------------------
| details          | string                        | "PHI -3.5"
| overUnder        | number                        | 37.5
| spread           | number                        | -3.5
| overOdds         | number                        | -110
| underOdds        | number                        | -110
| provider         | [OddProvider](#oddprovider)   | `{ id: "45", ... }`
| home             | [OddHome](#oddhome)           | `{ moneyLine: -180 }`
| away             | [OddAway](#oddaway)           | `{ moneyLine: 152 }`
| awayTeamOdds     | [AwayTeamOdds](#awayteamodds) | `{ favorite: false }`
| homeTeamOdds     | [HomeTeamOdds](#hometeamodds) | `{ favorite: true }`

#### OddProvider
| Property         | Type       | Example 
|------------------|------------|------------------------------------
| id               | string     | "45"
| name             | string     | "Caesars Sportsbook (New Jersey)" 
| priority         | number     | 1    

#### OddHome
| Property         | Type       | Example 
|------------------|------------|------------------------------------
| moneyLine        | number     | -180

#### OddAway
| Property         | Type       | Example 
|------------------|------------|------------------------------------
| moneyLine        | number     | 152

#### AwayTeamOdds
| Property         | Type                                  | Example 
|------------------|---------------------------------------|-----------------------
| favorite         | boolean                               | false
| underdog         | boolean                               | true
| moneyLine        | number                                | 152
| spreadOdds       | number                                | -110
| team             | [AwayTeamOddsTeam](#awayteamoddsteam) | `{ id: "5", ... }`
| links [ ]        | N/A                                   | N/A

#### AwayTeamOddsTeam
| Property         | Type       | Example 
|------------------|------------|------------
| id               | string     | "5"
| abbreviation     | string     | "CLE"

#### HomeTeamOdds
| Property         | Type                                  | Example 
|------------------|---------------------------------------|-----------------------
| favorite         | boolean                               | true
| underdog         | boolean                               | false
| moneyLine        | number                                | -180
| spreadOdds       | number                                | -110
| team             | [HomeTeamOddsTeam](#hometeamoddsteam) | `{ id: "21", ... }`
| links [ ]        | N/A                                   | N/A

#### HomeTeamOddsTeam
| Property         | Type       | Example 
|------------------|------------|------------
| id               | string     | "21"
| abbreviation     | string     | "PHI"

#### FullStatus
| Property         | Type                              | Example 
|------------------|-----------------------------------|-------------------
| clock            | number                            | 0
| displayClock     | string                            | "0:00"
| period           | number                            | 0
| type             | [FullStatusType](#fullstatustype) | `{  }` 

#### FullStatusType
| Property         | Type       | Example 
|------------------|------------|------------------------------------------
| id               | string     | "1"
| name             | string     | "STATUS_SCHEDULED"         
| state            | string     | "pre"
| completed        | boolean    | false
| description      | string     | "Scheduled"
| detail           | string     | "Thu, August 17th at 7:30 PM EDT"
| shortDetail      | string     | "8/17 - 7:30 PM EDT"

#### Competitor
| Property          | Type       | Example 
|-------------------|------------|---------------------------
| id                | string     | "21"
| uid               | string     | "s:20-1:28-t:21"
| type              | string     | "team"
| order             | number     | 0
| homeAway          | string     | "home"
| winner            | boolean    | false
| displayName       | string     | "Philadelphia Eagles"   
| name              | string     | "Eagles"
| abbreviation      | string     | "PHI"
| location          | string     | "Philadelphia"
| color             | string     | "06424D"
| alternateColor    | string     | "a5acaf"
| score             | string     | ""
| group             | string     | "12"
| record            | string     | "1-1"
| logo              | string     | "https://a.espncdn.com/i/teamlogos/nfl/500/scoreboard/cle.png"
| logoDark          | string     | "https://a.espncdn.com/i/teamlogos/nfl/500-dark/scoreboard/cle.png"

#### AppLink
| Property         | Type       | Example 
|------------------|------------|------------------------------------------------------------------
| rel              | [string]   | [ "summary", "sportscenter", "app", "event" ]
| href             | string     | "sportscenter://x-callback-url/showGame?sportName=football..."
| text             | string     | "Gamecast"
| shortText        | string     | "Summary"


---
