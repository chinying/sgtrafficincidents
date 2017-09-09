compilation instructions  
> env GOOS=linux GOARCH=amd64 go build app.go

### improvements
- mobile first
- icons can be added for different type of incidents
    - in hindsight i realise you cannot see icon details, so probably just gonna colour code
- continuous polling(?)
    - have to take into account battery + data usage concerns
- some sidebar with incidents as list form
- make use of location info
    - ask user for location, use some js equivalent of vincenty, zoom in on area nearby?
- I will revisit this project in the future when I get better at vue / frontend in general

- this issue [https://github.com/Leaflet/Leaflet/issues/4968] is causing icons to not load, need time to go read through and fix, meanwhile icons just have to be manually copied
 on build
