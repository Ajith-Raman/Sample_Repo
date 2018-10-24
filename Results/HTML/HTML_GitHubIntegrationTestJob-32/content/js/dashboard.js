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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.46415270018621974, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.49390243902439024, 500, 1500, "navigateToLogin"], "isController": true}, {"data": [1.0, 500, 1500, "-- Executing TC001  -- Keywords: navigateToApp;navigateToDhaka;changeLanguage;navigateToLogin;chooseOptions;SignUpUsingEmail;signUp"], "isController": false}, {"data": [0.5060240963855421, 500, 1500, "changeLanguage"], "isController": true}, {"data": [0.46835443037974683, 500, 1500, "verifyLogout"], "isController": true}, {"data": [0.09523809523809523, 500, 1500, "navigateToDashboard"], "isController": true}, {"data": [0.10365853658536585, 500, 1500, "navigateToSettings"], "isController": true}, {"data": [0.4695121951219512, 500, 1500, "chooseOptions"], "isController": true}, {"data": [1.0, 500, 1500, "-- Executing TC002  -- Keywords: navigateToDashboard;navigateToSettings;logout;verifyLogout"], "isController": false}, {"data": [0.4876543209876543, 500, 1500, "signUp"], "isController": true}, {"data": [0.3235294117647059, 500, 1500, "navigateToDhaka"], "isController": true}, {"data": [0.08125, 500, 1500, "logout"], "isController": true}, {"data": [0.4588235294117647, 500, 1500, "navigateToApp"], "isController": true}, {"data": [0.5182926829268293, 500, 1500, "SignUpUsingEmail"], "isController": true}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 179, 0, 0.0, 88.22346368715084, 0, 2479, 1.0, 1005.0, 2102.199999999995, 1.4755341598522818, 30.162113947404215, 0.06443225938077024], "isController": false}, "titles": ["Label", "#Samples", "KO", "Error %", "Average", "Min", "Max", "90th pct", "95th pct", "99th pct", "Throughput", "Received", "Sent"], "items": [{"data": ["navigateToLogin", 82, 0, 0.0, 1065.5609756097558, 391, 2009, 1520.0, 1804.8499999999997, 2009.0, 0.7103810934670929, 8.596721201410366, 0.4055622244024569], "isController": true}, {"data": ["-- Executing TC001  -- Keywords: navigateToApp;navigateToDhaka;changeLanguage;navigateToLogin;chooseOptions;SignUpUsingEmail;signUp", 85, 0, 0.0, 0.44705882352941184, 0, 2, 1.0, 1.0, 2.0, 0.719053218397611, 14.481074228498194, 0.0], "isController": false}, {"data": ["changeLanguage", 83, 0, 0.0, 981.5180722891569, 417, 1891, 1495.6000000000004, 1702.3999999999994, 1891.0, 0.7042014525215503, 14.513839507292303, 0.39240141179664695], "isController": true}, {"data": ["verifyLogout", 79, 0, 0.0, 1100.4683544303796, 420, 2048, 1504.0, 1944.0, 2048.0, 0.7375250898566961, 15.220818089786679, 0.4381425628996873], "isController": true}, {"data": ["navigateToDashboard", 84, 0, 0.0, 2028.5238095238096, 789, 3630, 2928.5, 2986.75, 3630.0, 0.7379555118248585, 9.359927917559826, 0.7696645377235829], "isController": true}, {"data": ["navigateToSettings", 82, 0, 0.0, 1936.7317073170734, 939, 3077, 2530.4, 2659.9, 3077.0, 0.7387587051902303, 9.207790385100498, 0.7813239040244331], "isController": true}, {"data": ["chooseOptions", 82, 0, 0.0, 1014.40243902439, 413, 1996, 1519.3, 1616.9499999999996, 1996.0, 0.7102026675905075, 8.294251661830938, 0.4193315054997402], "isController": true}, {"data": ["-- Executing TC002  -- Keywords: navigateToDashboard;navigateToSettings;logout;verifyLogout", 84, 0, 0.0, 0.3690476190476191, 0, 3, 1.0, 1.0, 3.0, 0.7511334066582612, 15.053755778809096, 0.0], "isController": false}, {"data": ["signUp", 81, 0, 0.0, 941.987654320988, 423, 2178, 1522.4, 1571.3999999999999, 2178.0, 0.72008961115161, 8.892122200207137, 0.5812702525203136], "isController": true}, {"data": ["navigateToDhaka", 85, 0, 0.0, 1329.4352941176464, 559, 2433, 1878.4, 2051.9, 2433.0, 0.7072900804646479, 48.41234017064413, 0.27559447471229936], "isController": true}, {"data": ["logout", 80, 0, 0.0, 2046.9750000000001, 1017, 3459, 2982.6000000000004, 3046.35, 3459.0, 0.7341200653366858, 16.000555465065062, 0.8010260761741332], "isController": true}, {"data": ["navigateToApp", 85, 0, 0.0, 1135.7529411764706, 457, 2150, 1872.4, 1955.9, 2150.0, 0.7099899766120948, 18.943697403316072, 0.26139279412378885], "isController": true}, {"data": ["SignUpUsingEmail", 82, 0, 0.0, 1007.951219512195, 397, 2062, 1488.0, 1574.1999999999998, 2062.0, 0.7098891014708556, 8.558877780038266, 0.41983961484187654], "isController": true}]}, function(index, item){
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
