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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.4580979284369115, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.524390243902439, 500, 1500, "navigateToLogin"], "isController": true}, {"data": [1.0, 500, 1500, "-- Executing TC001  -- Keywords: navigateToApp;navigateToDhaka;changeLanguage;navigateToLogin;chooseOptions;SignUpUsingEmail;signUp"], "isController": false}, {"data": [0.4634146341463415, 500, 1500, "changeLanguage"], "isController": true}, {"data": [0.4807692307692308, 500, 1500, "verifyLogout"], "isController": true}, {"data": [0.0963855421686747, 500, 1500, "navigateToDashboard"], "isController": true}, {"data": [0.09146341463414634, 500, 1500, "navigateToSettings"], "isController": true}, {"data": [0.4817073170731707, 500, 1500, "chooseOptions"], "isController": true}, {"data": [1.0, 500, 1500, "-- Executing TC002  -- Keywords: navigateToDashboard;navigateToSettings;logout;verifyLogout"], "isController": false}, {"data": [0.4177215189873418, 500, 1500, "signUp"], "isController": true}, {"data": [0.3614457831325301, 500, 1500, "navigateToDhaka"], "isController": true}, {"data": [0.06172839506172839, 500, 1500, "logout"], "isController": true}, {"data": [0.4819277108433735, 500, 1500, "navigateToApp"], "isController": true}, {"data": [0.48148148148148145, 500, 1500, "SignUpUsingEmail"], "isController": true}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 176, 0, 0.0, 84.88068181818181, 0, 2440, 1.0, 886.9000000000028, 2073.479999999995, 1.4509002176350325, 29.18572926799611, 0.06877574884175296], "isController": false}, "titles": ["Label", "#Samples", "KO", "Error %", "Average", "Min", "Max", "90th pct", "95th pct", "99th pct", "Throughput", "Received", "Sent"], "items": [{"data": ["navigateToLogin", 82, 0, 0.0, 964.0853658536586, 383, 1962, 1492.9, 1559.0499999999997, 1962.0, 0.7060565878523825, 8.544387926432348, 0.4029419742031032], "isController": true}, {"data": ["-- Executing TC001  -- Keywords: navigateToApp;navigateToDhaka;changeLanguage;navigateToLogin;chooseOptions;SignUpUsingEmail;signUp", 83, 0, 0.0, 0.3373493975903614, 0, 1, 1.0, 1.0, 1.0, 0.7038133113992318, 14.174097205733958, 0.0], "isController": false}, {"data": ["changeLanguage", 82, 0, 0.0, 1123.9634146341457, 410, 2152, 1645.6, 1862.5499999999997, 2152.0, 0.7037237283626409, 14.50399344442728, 0.3919894033795903], "isController": true}, {"data": ["verifyLogout", 78, 0, 0.0, 1088.653846153846, 400, 2262, 1569.6000000000004, 1733.6999999999998, 2262.0, 0.7356755482197594, 15.182647813015798, 0.43706525583588773], "isController": true}, {"data": ["navigateToDashboard", 83, 0, 0.0, 1999.385542168675, 936, 3307, 2726.600000000001, 2917.2, 3307.0, 0.7259432889604143, 9.207569762712753, 0.757136164657932], "isController": true}, {"data": ["navigateToSettings", 82, 0, 0.0, 2003.1463414634147, 896, 3354, 2618.2000000000003, 2976.25, 3354.0, 0.7257407866322086, 9.045536777135625, 0.7675559296119941], "isController": true}, {"data": ["chooseOptions", 82, 0, 0.0, 982.1585365853657, 412, 1918, 1505.6, 1612.85, 1918.0, 0.7011063800680586, 8.188018749251869, 0.41381040629969734], "isController": true}, {"data": ["-- Executing TC002  -- Keywords: navigateToDashboard;navigateToSettings;logout;verifyLogout", 83, 0, 0.0, 0.31325301204819295, 0, 1, 1.0, 1.0, 1.0, 0.7345522771120591, 14.721286016846028, 0.0], "isController": false}, {"data": ["signUp", 79, 0, 0.0, 1126.6329113924053, 435, 2042, 1595.0, 1845.0, 2042.0, 0.6880933716575212, 8.497012387313823, 0.5553162562059054], "isController": true}, {"data": ["navigateToDhaka", 83, 0, 0.0, 1240.0602409638552, 546, 2315, 1847.0000000000005, 2020.0, 2315.0, 0.6967997582188791, 46.84322294024312, 0.271506937040364], "isController": true}, {"data": ["logout", 81, 0, 0.0, 2042.185185185185, 920, 3644, 2640.2, 2972.3999999999983, 3644.0, 0.728620388777447, 15.880751519083558, 0.7950574547535734], "isController": true}, {"data": ["navigateToApp", 83, 0, 0.0, 1070.939759036144, 427, 2331, 1553.0, 1653.6, 2331.0, 0.696823158036134, 18.59238508189771, 0.2565452447066626], "isController": true}, {"data": ["SignUpUsingEmail", 81, 0, 0.0, 1085.962962962963, 396, 2024, 1570.3999999999999, 1963.8999999999994, 2024.0, 0.6989808686347436, 8.427361136879439, 0.4132417637832987], "isController": true}]}, function(index, item){
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
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 176, 0, null, null, null, null, null, null, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
