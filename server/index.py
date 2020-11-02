from flask import Flask, request, jsonify
import pandas as pd
import datetime
import sqlite3
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Average time considers only time of departure and arrival, ignoring the segments so it includes also any eventual waiting time
# I am assuming that the departure and arrival time are presented in the same timezone, if that is not the case that needs to be accounted for
@app.route("/average_time", methods=["POST"])
def average_time():
    if request.is_json:
        params = request.get_json()
        departure = params.get("departure")
        arrival = params.get("arrival")
        con = sqlite3.connect("data/data.db")
        
        query = """with t1 as (
            SELECT AVG(average_time) as average_time_out
            from (
            SELECT DISTINCT outflightno, STRFTIME('%s',DATETIME(outarrivaldate||' '||outarrivaltime)) - 
                        STRFTIME('%s',DATETIME(outdepartdate||' '||outdeparttime)) as average_time
            from flights
            where depair = '{0}' and destair = '{1}') o) ,
        t2 as (
            SELECT AVG(average_time) as average_time_in
            from (
            select DISTINCT inflightno, STRFTIME('%s',DATETIME(inarrivaldate||' '||inarrivaltime)) - 
                        STRFTIME('%s',DATETIME(indepartdate||' '||indeparttime)) as average_time 
            from flights 
            where depair = '{1}' and destair = '{0}') i)
        select *
        from t1 join t2""".format(departure, arrival)

        cur = con.cursor()
        results = cur.execute(query).fetchall()[0]

        if results[0] is None:
            outbound_time = "Not available"
        else:
            outbound_time = str(datetime.timedelta(seconds=results[0]))

        if results[1] is None:
            inbound_time = "Not available"
        else:
            inbound_time = str(datetime.timedelta(seconds=results[1]))

        return {"state": "OK",
                "average_time_outbound": outbound_time,
                "average_time_inbound": inbound_time}
    else:
        return {"state": "ERROR", "data": "JSON EXPECTED"}

@app.route("/busy_day", methods=["POST"])
def busy_day():
    if request.is_json:
        params = request.get_json()
        airport = params.get("airport")
        con = sqlite3.connect("data/data.db")
    
    
        query = """select DATE(datetime_), count(DISTINCT flightno) as flights_count
        from (
        select depair, f.outflightno as flightno, DATETIME(outdepartdate||' '||outdeparttime) as datetime_
        from flights f
        join segments s on f.id = s.flightid
        where depair = '{0}'
        union 
        select indepartcode as depair, f.inflightno as flightno, DATETIME(indepartdate||' '||indeparttime) as datetime_
        from flights f
        join segments s on f.id = s.flightid
        where indepartcode = '{0}'
        union 
        select s.depcode as depcode, s.flightno as flightno, DATETIME(s.depdate ||' '||s.deptime) as datetime_ 
        from flights f
        join segments s on f.id = s.flightid
        where s.depcode = '{0}'
        )
        GROUP by DATE(datetime_)
        order by flights_count desc
        limit 1""".format(airport)

        cur = con.cursor()
        results = cur.execute(query).fetchall()[0]
        
        return {"state": "OK",
                "airport": airport,
                "busy_day": results[0],
                "departures_count": results[1]}
    else:
        return {"state": "ERROR", "data": "JSON EXPECTED"}
    

@app.route("/class_percentage", methods=["POST"])
def class_count():
    if request.is_json:
        params = request.get_json()
        class_ = params.get("class")
        con = sqlite3.connect("data/data.db")
    
        query = """select class, count(DISTINCT flight_no) as flights_count 
            from (
            select outflightno as flight_no, outflightclass as class  
            from flights f 
            union
            select inflightno as flight_no, inflightclass as class  
            from flights f2) t1
            where flight_no is not null and class is not null
            group by class"""

        df = pd.read_sql_query(query, con).set_index("class")
        df['percentage'] = df["flights_count"]/df['flights_count'].sum()

        return {"state": "OK",
                "class": class_,
                "percentage": df["percentage"][class_] * 100}
    else:
        return {"state": "ERROR", "data": "JSON EXPECTED"}
    
@app.route("/to_sweden", methods=["POST"])
def to_sweden():
    if request.is_json:
        params = request.get_json()
        con = sqlite3.connect("data/data.db")

        query = """with t1 as (select COUNT(DISTINCT outflightno) as to_sweden
        from flights f 
        where destair in ('AJR', 'BLE', 'EKT', 'GOT', 'GSE', 'GEV', 'GVX', 'HFS', 'HAD', 'HMV', 'HUV', 'HLF', 'IDB', 'JKG', 'KLR', 'KSK', 'KSD',
        'KRN', 'KRF', 'KID', 'LDK', 'LPI', 'LLA', 'LYC', 'MMX', 'MXX', 'NRK', 'OSK', 'PJA', 'RNB', 'SFT', 'KVB', 'NYO', 'VST', 'ARN',
        'BMA', 'SQO', 'SDL', 'EVG', 'SCR', 'SOO', 'TYF', 'THN', 'UME', 'VHM', 'VBY', 'VVK', 'VXO', 'AGH', 'ORB', 'OER', 'OSD')),
        t2 as (select DISTINCT outflightno as f_no from flights f3 union select DISTINCT inflightno as f_no from flights f2),
        t3 as (select COUNT(DISTINCT f_no) as total from t2)
        select 100.0 * to_sweden / total from t1 join t3"""

        cur = con.cursor()
        result = cur.execute(query).fetchall()[0][0]
        
        return {"state": "OK",
                "percentage": result}
    else:
        return {"state": "ERROR", "data": "JSON EXPECTED"}

@app.route("/average_cost", methods=["POST"])
def average_cost():
    if request.is_json:
        params = request.get_json()
        departure = params.get("departure")
        arrival = params.get("arrival")
        con = sqlite3.connect("data/data.db")
        
        query = """select outflightclass, inflightclass, avg(originalprice) as avg_price, originalcurrency
                    from flights f2 
                    where depair = '{0}' and destair = '{1}'
                    GROUP by outflightclass, inflightclass, originalcurrency  """.format(departure, arrival)

        df = pd.read_sql_query(query, con)
        
        return {"state": "OK",
                "data": df.to_dict(orient="records")}
    else:
        return {"state": "ERROR", "data": "JSON EXPECTED"}
     
@app.route("/airports", methods=["GET"])
def get_airports():
    con = sqlite3.connect("data/data.db")
        
    query = """select DISTINCT air from (
            select DISTINCT depair as air 
            from flights f 
            union 
            select DISTINCT destair as air 
            from flights f2 )"""

    cur = con.cursor()
    result = [t[0] for t in cur.execute(query).fetchall()]
    return jsonify(data=result)

@app.route("/classes", methods=["GET"])
def get_classes():
    con = sqlite3.connect("data/data.db")
        
    query = """select DISTINCT class from (
            select DISTINCT inflightclass as class 
            from flights f 
            union 
            select DISTINCT outflightclass as class 
            from flights f2
            )
    where class is not null """

    cur = con.cursor()
    result = [t[0] for t in cur.execute(query).fetchall()]
    return jsonify(data=result)


if __name__ == '__main__':
    flights = pd.read_csv("data/flighdata_B.csv")
    segments = pd.read_csv("data/flighdata_B_segments.csv")

    con = sqlite3.connect("data/data.db")
    
    # only load the data the first time
    cur = con.cursor()
    s = cur.execute("SELECT name FROM sqlite_master WHERE type='table' AND name='flights'").fetchall()
    if len(s) <= 0:
        cur = con.cursor()
        column_names = ",".join(flights.columns)
        placeholders = ",".join(["?" for _ in range(len(flights.columns))])
        cur.execute("CREATE TABLE flights ({})".format(column_names))
        INSERT_STATEMENT = "INSERT INTO flights ({}) VALUES ({})".format(column_names, placeholders)
        cur.executemany(INSERT_STATEMENT, [row for index, row in flights.iterrows()])
        con.commit()

        cur = con.cursor()
        column_names = ",".join(segments.columns)
        cur.execute("CREATE TABLE segments ({})".format(column_names))
        placeholders = ",".join(["?" for _ in range(len(segments.columns))])
        INSERT_STATEMENT = "INSERT INTO segments ({}) VALUES ({})".format(column_names, placeholders)
        cur.executemany(INSERT_STATEMENT, [row for index, row in segments.iterrows()])
        con.commit()

    app.run(debug=True)