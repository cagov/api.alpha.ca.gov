@app
alpha-api

@http
get /
get /CaZipCityCountyTypeAhead
options /CaZipCityCountyTypeAhead
get /caziplookup/:zip
options /caziplookup/:zip
get /countyfromzip/:zip
options /countyfromzip/:zip
get /FoodBanks
options /FoodBanks
get /HomelessShelters
options /HomelessShelters
get /LaneClosures/:route
options /LaneClosures/:route
get /StateHolidayCalendar/:route
options /StateHolidayCalendar/:route
get /WaterSystem
options /WaterSystem
get /WaterSystemHistory
options /WaterSystemHistory

@macros
arc-macro-cors

@aws
region us-west-1
