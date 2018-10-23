/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 100.0, "KoPercent": 0.0};
    var dataset = [
        {
            "label" : "KO",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "OK",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.46222014925373134, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.4817073170731707, 500, 1500, "navigateToLogin"], "isController": true}, {"data": [1.0, 500, 1500, "-- Executing TC001  -- Keywords: navigateToApp;navigateToDhaka;changeLanguage;navigateToLogin;chooseOptions;SignUpUsingEmail;signUp"], "isController": false}, {"data": [0.4397590361445783, 500, 1500, "changeLanguage"], "isController": true}, {"data": [0.5185185185185185, 500, 1500, "verifyLogout"], "isController": true}, {"data": [0.07647058823529412, 500, 1500, "navigateToDashboard"], "isController": true}, {"data": [0.12195121951219512, 500, 1500, "navigateToSettings"], "isController": true}, {"data": [0.5493827160493827, 500, 1500, "chooseOptions"], "isController": true}, {"data": [1.0, 500, 1500, "-- Executing TC002  -- Keywords: navigateToDashboard;navigateToSettings;logout;verifyLogout"], "isController": false}, {"data": [0.4240506329113924, 500, 1500, "signUp"], "isController": true}, {"data": [0.3392857142857143, 500, 1500, "navigateToDhaka"], "isController": true}, {"data": [0.08024691358024691, 500, 1500, "logout"], "isController": true}, {"data": [0.47023809523809523, 500, 1500, "navigateToApp"], "isController": true}, {"data": [0.4876543209876543, 500, 1500, "SignUpUsingEmail"], "isController": true}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 179, 0, 0.0, 85.54748603351956, 0, 2453, 1.0, 1004.0, 2086.599999999995, 1.4688746286783412, 29.488610195343917, 0.06136872548456451], "isController": false}, "titles": ["Label", "#Samples", "KO", "Error %", "Average", "Min", "Max", "90th pct", "95th pct", "99th pct", "Throughput", "Received", "Sent"], "items": [{"data": ["navigateToLogin", 82, 0, 0.0, 1105.1707317073174, 429, 2612, 1608.9, 1809.3999999999999, 2612.0, 0.6980802792321117, 8.447862129144852, 0.39867260992636105], "isController": true}, {"data": ["-- Executing TC001  -- Keywords: navigateToApp;navigateToDhaka;changeLanguage;navigateToLogin;chooseOptions;SignUpUsingEmail;signUp", 84, 0, 0.0, 0.666666666666667, 0, 16, 1.0, 1.0, 16.0, 0.7040541786453662, 14.179182639721228, 0.0], "isController": false}, {"data": ["changeLanguage", 83, 0, 0.0, 1124.9518072289159, 414, 2004, 1611.4, 1863.4, 2004.0, 0.6980421180111687, 14.3868934576423, 0.3890842349710691], "isController": true}, {"data": ["verifyLogout", 81, 0, 0.0, 1023.1111111111106, 419, 2024, 1537.0, 1950.899999999999, 2024.0, 0.7520612047834807, 15.520810000673142, 0.4471166344796851], "isController": true}, {"data": ["navigateToDashboard", 85, 0, 0.0, 2017.7058823529408, 991, 3365, 2715.000000000001, 2972.3, 3365.0, 0.7366705955765097, 9.343630561862996, 0.7683244102301879], "isController": true}, {"data": ["navigateToSettings", 82, 0, 0.0, 1939.5731707317066, 818, 3058, 2740.5000000000005, 2960.7, 3058.0, 0.7288241045240423, 9.083966841836281, 0.7708168996089236], "isController": true}, {"data": ["chooseOptions", 81, 0, 0.0, 960.7037037037038, 422, 1695, 1465.6, 1510.5, 1695.0, 0.6986432520549599, 8.159252589184831, 0.412646278430899], "isController": true}, {"data": ["-- Executing TC002  -- Keywords: navigateToDashboard;navigateToSettings;logout;verifyLogout", 85, 0, 0.0, 0.4235294117647058, 0, 3, 1.0, 1.0, 3.0, 0.7492947813822285, 15.016766159423485, 0.0], "isController": false}, {"data": ["signUp", 79, 0, 0.0, 1116.5316455696202, 418, 2037, 1591.0, 1687.0, 2037.0, 0.6894746028975388, 8.514068704725956, 0.5567036950165823], "isController": true}, {"data": ["navigateToDhaka", 84, 0, 0.0, 1320.3214285714284, 537, 2157, 1904.0, 1982.25, 2157.0, 0.699422976044763, 48.19243525133432, 0.27252906976744184], "isController": true}, {"data": ["logout", 81, 0, 0.0, 1981.2098765432095, 937, 3331, 2627.7999999999997, 3075.0999999999995, 3331.0, 0.7492438187384954, 16.330866735193187, 0.8178684967255271], "isController": true}, {"data": ["navigateToApp", 84, 0, 0.0, 1059.1666666666667, 416, 2035, 1552.0, 1612.25, 2035.0, 0.7011510563174546, 18.707860508501458, 0.2581386213200003], "isController": true}, {"data": ["SignUpUsingEmail", 81, 0, 0.0, 995.9382716049381, 439, 1569, 1513.6, 1552.3, 1569.0, 0.6982999413772888, 8.419151441644539, 0.4131254391315218], "isController": true}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Percentile 1
            case 8:
            // Percentile 2
            case 9:
            // Percentile 3
            case 10:
            // Throughput
            case 11:
            // Kbytes/s
            case 12:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": []}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 179, 0, null, null, null, null, null, null, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
