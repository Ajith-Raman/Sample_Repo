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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.4546313799621928, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.524390243902439, 500, 1500, "navigateToLogin"], "isController": true}, {"data": [1.0, 500, 1500, "-- Executing TC001  -- Keywords: navigateToApp;navigateToDhaka;changeLanguage;navigateToLogin;chooseOptions;SignUpUsingEmail;signUp"], "isController": false}, {"data": [0.4878048780487805, 500, 1500, "changeLanguage"], "isController": true}, {"data": [0.5, 500, 1500, "verifyLogout"], "isController": true}, {"data": [0.09523809523809523, 500, 1500, "navigateToDashboard"], "isController": true}, {"data": [0.07317073170731707, 500, 1500, "navigateToSettings"], "isController": true}, {"data": [0.5123456790123457, 500, 1500, "chooseOptions"], "isController": true}, {"data": [1.0, 500, 1500, "-- Executing TC002  -- Keywords: navigateToDashboard;navigateToSettings;logout;verifyLogout"], "isController": false}, {"data": [0.41139240506329117, 500, 1500, "signUp"], "isController": true}, {"data": [0.2926829268292683, 500, 1500, "navigateToDhaka"], "isController": true}, {"data": [0.0375, 500, 1500, "logout"], "isController": true}, {"data": [0.4817073170731707, 500, 1500, "navigateToApp"], "isController": true}, {"data": [0.4810126582278481, 500, 1500, "SignUpUsingEmail"], "isController": true}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 176, 0, 0.0, 83.6875, 0, 2238, 1.0, 689.8000000000047, 2080.149999999998, 1.4505893019038985, 28.64436576640155, 0.06963028259704937], "isController": false}, "titles": ["Label", "#Samples", "KO", "Error %", "Average", "Min", "Max", "90th pct", "95th pct", "99th pct", "Throughput", "Received", "Sent"], "items": [{"data": ["navigateToLogin", 82, 0, 0.0, 972.5487804878051, 400, 1996, 1435.0, 1545.8999999999999, 1996.0, 0.7037418468932372, 8.516375944043942, 0.4019059228029523], "isController": true}, {"data": ["-- Executing TC001  -- Keywords: navigateToApp;navigateToDhaka;changeLanguage;navigateToLogin;chooseOptions;SignUpUsingEmail;signUp", 82, 0, 0.0, 0.3536585365853659, 0, 2, 1.0, 1.0, 2.0, 0.7043342323615812, 14.18461602779114, 0.0], "isController": false}, {"data": ["changeLanguage", 82, 0, 0.0, 1029.817073170731, 408, 1861, 1500.5000000000002, 1589.3999999999999, 1861.0, 0.7022471910112359, 14.473561490519662, 0.3914512912356125], "isController": true}, {"data": ["verifyLogout", 79, 0, 0.0, 1069.1518987341765, 407, 2005, 1516.0, 1704.0, 2005.0, 0.7353009614758141, 15.174917205926155, 0.4367485561574475], "isController": true}, {"data": ["navigateToDashboard", 84, 0, 0.0, 1931.7023809523812, 843, 3075, 2511.5, 2861.0, 3075.0, 0.7348759896767421, 9.320868509688989, 0.7664526923581645], "isController": true}, {"data": ["navigateToSettings", 82, 0, 0.0, 1997.1463414634147, 972, 3539, 2528.2, 2961.3999999999987, 3539.0, 0.7259142535919477, 9.04769884628323, 0.7677393912500775], "isController": true}, {"data": ["chooseOptions", 81, 0, 0.0, 1041.7407407407409, 394, 1991, 1498.2, 1551.7, 1991.0, 0.6896845331857465, 8.05462630114096, 0.4073050151134574], "isController": true}, {"data": ["-- Executing TC002  -- Keywords: navigateToDashboard;navigateToSettings;logout;verifyLogout", 84, 0, 0.0, 0.33333333333333337, 0, 4, 1.0, 1.0, 4.0, 0.743797262117697, 14.906763851010325, 0.0], "isController": false}, {"data": ["signUp", 79, 0, 0.0, 1112.0632911392406, 477, 2318, 1571.0, 1662.0, 2318.0, 0.6865923292862047, 8.478476566234432, 0.5543425063661883], "isController": true}, {"data": ["navigateToDhaka", 82, 0, 0.0, 1391.731707317073, 614, 2714, 2123.3, 2393.7499999999995, 2714.0, 0.6965977148196916, 46.842006846514884, 0.2714282111455634], "isController": true}, {"data": ["logout", 80, 0, 0.0, 2178.025, 1075, 3601, 2828.0, 3068.75, 3601.0, 0.7274380541032053, 15.854810752443738, 0.7936818026824278], "isController": true}, {"data": ["navigateToApp", 82, 0, 0.0, 1032.69512195122, 405, 1936, 1528.7, 1629.4499999999998, 1936.0, 0.6985203294971506, 18.637668400899557, 0.2571700822465095], "isController": true}, {"data": ["SignUpUsingEmail", 79, 0, 0.0, 1030.7974683544303, 448, 2029, 1515.0, 1544.0, 2029.0, 0.6866937867250791, 8.279220205964675, 0.4062219536655541], "isController": true}]}, function(index, item){
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
