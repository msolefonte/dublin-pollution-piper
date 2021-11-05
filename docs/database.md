# Database Configuration

A MySQL database is required in order to run the application, as the gathered data is going to be stored there. However,
the installation and configuration process is outside of the scope of the this project. Please refer to the official 
documentation in order to do so. 

Once done, two more things have to be done: creating the required tables and configuring the service. 

## Tables

The first table used by the application is `no2_emissions`. Note that it is hardcoded to store dioxide of nitrogen
information, so feel free to modify its name/keys both here and in [src/lib/MySQLClient.ts](../src/lib/MySQLClient.ts)
is willing to target another kind of pollutant.

It is also important to note that an `int` is used to define the `area_id`. This is just a preference and not a strong
requirement, so feel free to modify it too as long as the format is consequent in this table, in the table `traffic` and
in the file [src/config/areas.json](../src/config/areas.json). 

Values stored are:

* `area_id`, the identifier of the area monitored
* `timestamp`, which represents when the data was collected 
* `no2_level`, concentration of NO<sub>2</sub> on air measured in μg/m<sup>3</sup>

```sql
create table no2_emissions
(
    area_id   int       not null,
    timestamp timestamp not null,
    no2_level double    not null,
    primary key (area_id, timestamp)
);
```

The second table, `traffic`.  Values stored are:

* `area_id`, the identifier of the area monitored
* `timestamp`, which represents when the data was collected 
* `frc`, which works as an identifier of road type
* `current speed`, the current average speed at the selected point, in the km/h
* `free flow speed`, the free flow speed expected under ideal conditions, expressed in the km/h
* `current travel time`, travel time in seconds based on fused real-time measurements between the defined locations in 
the specified direction; 
* `free flow travel time`, travel time in seconds which would be expected under ideal free flow conditions
* `confidence`, the estimated accuracy provided travel time and speed
* `road_closure`, which just indicates if the road is closed to traffic or not

```sql
create table traffic
(
    area_id               int           not null,
    timestamp             timestamp     not null,
    frc                   mediumtext    not null,
    current_speed         int           not null,
    free_flow_speed       int           not null,
    current_travel_time   int           not null,
    free_flow_travel_time int           not null,
    confidence            double        not null,
    road_closure          tinyint       not null,
    primary key (area_id, timestamp)
);
```

## Configuration

In order to set the database configuration, refer to the file [src/config/database.json](../src/config/database.json)
(before building) or [dist/config/database.json](../dist/config/database.json) (if the code has already been built).

The format of the file has to be similar to the following:

```json
{
    "auth": {
        "username": "user_1",
        "password": "pass_123"
    },
    "host": "my.hostname.com",
    "port": 3306,
    "database": "my_database"
}
```
