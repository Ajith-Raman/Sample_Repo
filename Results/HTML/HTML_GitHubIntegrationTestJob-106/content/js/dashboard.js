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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.4294234592445328, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.43506493506493504, 500, 1500, "navigateToLogin"], "isController": true}, {"data": [1.0, 500, 1500, "-- Executing TC001  -- Keywords: navigateToApp;navigateToDhaka;changeLanguage;navigateToLogin;chooseOptions;SignUpUsingEmail;signUp"], "isController": false}, {"data": [0.44805194805194803, 500, 1500, "changeLanguage"], "isController": true}, {"data": [0.44, 500, 1500, "verifyLogout"], "isController": true}, {"data": [0.04430379746835443, 500, 1500, "navigateToDashboard"], "isController": true}, {"data": [0.05844155844155844, 500, 1500, "navigateToSettings"], "isController": true}, {"data": [0.44805194805194803, 500, 1500, "chooseOptions"], "isController": true}, {"data": [1.0, 500, 1500, "-- Executing TC002  -- Keywords: navigateToDashboard;navigateToSettings;logout;verifyLogout"], "isController": false}, {"data": [0.41333333333333333, 500, 1500, "signUp"], "isController": true}, {"data": [0.37341772151898733, 500, 1500, "navigateToDhaka"], "isController": true}, {"data": [0.02666666666666667, 500, 1500, "logout"], "isController": true}, {"data": [0.4125, 500, 1500, "navigateToApp"], "isController": true}, {"data": [0.4473684210526316, 500, 1500, "SignUpUsingEmail"], "isController": true}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 169, 0, 0.0, 93.9940828402367, 0, 2551, 1.0, 914.0, 2374.600000000003, 1.3936994887019627, 27.86973754741877, 0.058725826735939304], "isController": false}, "titles": ["Label", "#Samples", "KO", "Error %", "Average", "Min", "Max", "90th pct", "95th pct", "99th pct", "Throughput", "Received", "Sent"], "items": [{"data": ["navigateToLogin", 77, 0, 0.0, 1141.8441558441557, 700, 2008, 1528.0, 1653.4999999999989, 2008.0, 0.6664300984066263, 8.21843679949109, 0.38039459477588045], "isController": true}, {"data": ["-- Executing TC001  -- Keywords: navigateToApp;navigateToDhaka;changeLanguage;navigateToLogin;chooseOptions;SignUpUsingEmail;signUp", 80, 0, 0.0, 0.4499999999999999, 0, 3, 1.0, 1.0, 3.0, 0.6706233443986185, 13.185059101301848, 0.0], "isController": false}, {"data": ["changeLanguage", 77, 0, 0.0, 1149.4935064935062, 726, 2182, 1564.0, 1825.8999999999999, 2182.0, 0.6649797483440277, 13.980809572361887, 0.3704752230272987], "isController": true}, {"data": ["verifyLogout", 75, 0, 0.0, 1141.8666666666666, 735, 1838, 1515.4, 1541.2, 1838.0, 0.7115141970799457, 14.978624557082412, 0.4231841861226271], "isController": true}, {"data": ["navigateToDashboard", 79, 0, 0.0, 2141.898734177217, 1202, 3508, 2911.0, 3349.0, 3508.0, 0.7013556583421373, 8.986804290143734, 0.731492034286526], "isController": true}, {"data": ["navigateToSettings", 77, 0, 0.0, 2007.6753246753249, 1171, 3446, 2499.8, 2551.3, 3446.0, 0.6998091429610107, 8.813221394165227, 0.7401301775652095], "isController": true}, {"data": ["chooseOptions", 77, 0, 0.0, 1122.5974025974028, 713, 1958, 1527.8, 1657.399999999999, 1958.0, 0.6645034347060651, 7.846851105923573, 0.39227344855707824], "isController": true}, {"data": ["-- Executing TC002  -- Keywords: navigateToDashboard;navigateToSettings;logout;verifyLogout", 79, 0, 0.0, 0.4936708860759495, 0, 3, 1.0, 1.0, 3.0, 0.7118527996539855, 13.926702744575502, 0.0], "isController": false}, {"data": ["signUp", 75, 0, 0.0, 1155.453333333333, 742, 1722, 1528.8000000000002, 1643.8, 1722.0, 0.6695531848413159, 8.355029878810873, 0.5404375251082444], "isController": true}, {"data": ["navigateToDhaka", 79, 0, 0.0, 1316.303797468354, 861, 2889, 1678.0, 1794.0, 2889.0, 0.6611874591988751, 46.079852116846055, 0.2576306603714367], "isController": true}, {"data": ["logout", 75, 0, 0.0, 2072.053333333333, 1327, 3484, 2544.6, 2665.000000000001, 3484.0, 0.7070335699539014, 15.703933669645634, 0.7719646606945898], "isController": true}, {"data": ["navigateToApp", 80, 0, 0.0, 1216.7875000000004, 738, 2526, 1649.1000000000001, 1882.9, 2526.0, 0.6659784888948087, 18.038651726549233, 0.24518934600912393], "isController": true}, {"data": ["SignUpUsingEmail", 76, 0, 0.0, 1108.8552631578946, 734, 1586, 1504.8, 1563.15, 1586.0, 0.6687727140732658, 8.15001435441434, 0.39546823989581226], "isController": true}]}, function(index, item){
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
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 169, 0, null, null, null, null, null, null, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
