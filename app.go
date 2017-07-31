package main

import (
  "github.com/gin-gonic/gin"
  "net/http"
  "encoding/json"
  "io/ioutil"
  "time"
  "strconv"
  "github.com/joho/godotenv"
  "os"
  "log"
)

type Query struct {
  Metadata string `json:"odata.metadata"`
  Value []Location `json:"value"`
}

type Location struct {
  Latitude float64 `json:"Latitude"`
  Longitude float64 `json:"Longitude"`
  Message string `json:"Message"`
  IncidentType string `json:"Type"`
}

const PAGINATION_INCREMENT = 50

var lastRetrieved time.Time
var data Query
var APIKEY string

func Respond(c *gin.Context) {

  c.Writer.Header().Set("Access-Control-Allow-Origin", "*")
  c.Writer.Header().Set("Access-Control-Allow-Credentials", "true")
  c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization, accept, origin, Cache-Control, X-Requested-With")
  c.Writer.Header().Set("Access-Control-Allow-Methods", "GET")

  locations := make([]Location, 0)
  var skipcount int

  for {
    log.Printf("retrieving %d queries\n", skipcount)
    if time.Since(lastRetrieved) > time.Minute {
      skipParam := strconv.Itoa(skipcount)
      client := &http.Client{}
      url := "http://datamall2.mytransport.sg/ltaodataservice/TrafficIncidents?$skip=" + skipParam
      req, _ := http.NewRequest("GET", url, nil)
      req.Header.Set("AccountKey", APIKEY)

      res, _ := client.Do(req)

      body, err := ioutil.ReadAll(res.Body)
      if err != nil {
        panic(err)
      }

      var tempData Query
      err = json.Unmarshal([]byte(body), &tempData)
      if err != nil {
        panic(err)
      }

      if len(tempData.Value) == 0 {
        lastRetrieved = time.Now()
        data = Query {
          Metadata: "http://datamall2.mytransport.sg/ltaodataservice/$metadata#IncidentSet",
          Value: locations,
        }
        break
      }

      locations = append(tempData.Value)
      skipcount += 50
    }

    // if not lastRetrieved
    if skipcount == 0 {
      break
    }
  }

  c.JSON(http.StatusOK, gin.H{"status": http.StatusOK, "lastRetrieved": lastRetrieved, "trafficStatus": data})
}


func main() {
  err := godotenv.Load()
  if err != nil {
    panic("Error loading .env file")
  }
  APIKEY = os.Getenv("LTA_KEY")

  router := gin.Default()
  router.GET("/traffic", Respond)
  router.Run(":8001")
}
