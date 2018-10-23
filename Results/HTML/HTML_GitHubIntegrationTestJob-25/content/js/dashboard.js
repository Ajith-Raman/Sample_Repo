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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.4560491493383743, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.50625, 500, 1500, "navigateToLogin"], "isController": true}, {"data": [1.0, 500, 1500, "-- Executing TC001  -- Keywords: navigateToApp;navigateToDhaka;changeLanguage;navigateToLogin;chooseOptions;SignUpUsingEmail;signUp"], "isController": false}, {"data": [0.48125, 500, 1500, "changeLanguage"], "isController": true}, {"data": [0.5064102564102564, 500, 1500, "verifyLogout"], "isController": true}, {"data": [0.1144578313253012, 500, 1500, "navigateToDashboard"], "isController": true}, {"data": [0.12804878048780488, 500, 1500, "navigateToSettings"], "isController": true}, {"data": [0.49375, 500, 1500, "chooseOptions"], "isController": true}, {"data": [1.0, 500, 1500, "-- Executing TC002  -- Keywords: navigateToDashboard;navigateToSettings;logout;verifyLogout"], "isController": false}, {"data": [0.41875, 500, 1500, "signUp"], "isController": true}, {"data": [0.30357142857142855, 500, 1500, "navigateToDhaka"], "isController": true}, {"data": [0.075, 500, 1500, "logout"], "isController": true}, {"data": [0.4523809523809524, 500, 1500, "navigateToApp"], "isController": true}, {"data": [0.43125, 500, 1500, "SignUpUsingEmail"], "isController": true}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 177, 0, 0.0, 98.27118644067797, 0, 2556, 1.0, 1187.8999999999983, 2458.5, 1.459769735756936, 30.682024510420447, 0.06364263579157457], "isController": false}, "titles": ["Label", "#Samples", "KO", "Error %", "Average", "Min", "Max", "90th pct", "95th pct", "99th pct", "Throughput", "Received", "Sent"], "items": [{"data": ["navigateToLogin", 80, 0, 0.0, 1025.8749999999995, 388, 2003, 1519.6, 1622.8000000000002, 2003.0, 0.6967791384325954, 8.432116292438204, 0.3977901214137649], "isController": true}, {"data": ["-- Executing TC001  -- Keywords: navigateToApp;navigateToDhaka;changeLanguage;navigateToLogin;chooseOptions;SignUpUsingEmail;signUp", 84, 0, 0.0, 0.29761904761904767, 0, 1, 1.0, 1.0, 1.0, 0.7089744347194908, 14.27820738398984, 0.0], "isController": false}, {"data": ["changeLanguage", 80, 0, 0.0, 1092.0125, 411, 2107, 1542.0, 1628.05, 2107.0, 0.6967973452021148, 14.361238252432257, 0.38827398942610025], "isController": true}, {"data": ["verifyLogout", 78, 0, 0.0, 1017.2692307692307, 412, 2021, 1529.0000000000002, 1637.2999999999997, 2021.0, 0.7286791289481797, 15.038257843810431, 0.43310938711545827], "isController": true}, {"data": ["navigateToDashboard", 83, 0, 0.0, 2014.9036144578322, 778, 3463, 2901.4, 2974.6, 3463.0, 0.722543352601156, 9.16444635115607, 0.753590137283237], "isController": true}, {"data": ["navigateToSettings", 82, 0, 0.0, 1906.7804878048782, 804, 3340, 2865.500000000001, 3001.7, 3340.0, 0.7232571267287609, 9.014580769960132, 0.7649291682102032], "isController": true}, {"data": ["chooseOptions", 80, 0, 0.0, 1056.6000000000006, 390, 2007, 1514.2, 1554.65, 2007.0, 0.6936315949191486, 8.10072289417783, 0.4095406858282395], "isController": true}, {"data": ["-- Executing TC002  -- Keywords: navigateToDashboard;navigateToSettings;logout;verifyLogout", 83, 0, 0.0, 0.2891566265060243, 0, 1, 1.0, 1.0, 1.0, 0.7319482168683199, 14.669132054371406, 0.0], "isController": false}, {"data": ["signUp", 80, 0, 0.0, 1110.4375000000002, 433, 2096, 1647.1000000000001, 1753.0500000000002, 2096.0, 0.6864654750770128, 8.476910090184402, 0.5541331657213465], "isController": true}, {"data": ["navigateToDhaka", 84, 0, 0.0, 1387.9166666666663, 543, 2396, 2031.0, 2295.5, 2396.0, 0.7016664578373637, 47.58202586611953, 0.2734032389424884], "isController": true}, {"data": ["logout", 80, 0, 0.0, 1996.0249999999996, 917, 3507, 2609.2000000000003, 3020.7000000000003, 3507.0, 0.7178750897343863, 15.647048019113425, 0.7835809908919598], "isController": true}, {"data": ["navigateToApp", 84, 0, 0.0, 1138.5833333333335, 414, 2237, 1571.5, 1893.5, 2237.0, 0.7016605967456313, 18.72145588308998, 0.2583262157940459], "isController": true}, {"data": ["SignUpUsingEmail", 80, 0, 0.0, 1029.4124999999995, 419, 2011, 1538.9, 1929.7000000000005, 2011.0, 0.6897919415056434, 8.316573544754563, 0.4079472654060719], "isController": true}]}, function(index, item){
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
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 177, 0, null, null, null, null, null, null, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
