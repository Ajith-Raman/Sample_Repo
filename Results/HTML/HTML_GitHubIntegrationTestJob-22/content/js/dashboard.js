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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.44364851957975165, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.47560975609756095, 500, 1500, "navigateToLogin"], "isController": true}, {"data": [1.0, 500, 1500, "-- Executing TC001  -- Keywords: navigateToApp;navigateToDhaka;changeLanguage;navigateToLogin;chooseOptions;SignUpUsingEmail;signUp"], "isController": false}, {"data": [0.5, 500, 1500, "changeLanguage"], "isController": true}, {"data": [0.42207792207792205, 500, 1500, "verifyLogout"], "isController": true}, {"data": [0.04878048780487805, 500, 1500, "navigateToDashboard"], "isController": true}, {"data": [0.11585365853658537, 500, 1500, "navigateToSettings"], "isController": true}, {"data": [0.46794871794871795, 500, 1500, "chooseOptions"], "isController": true}, {"data": [1.0, 500, 1500, "-- Executing TC002  -- Keywords: navigateToDashboard;navigateToSettings;logout;verifyLogout"], "isController": false}, {"data": [0.38461538461538464, 500, 1500, "signUp"], "isController": true}, {"data": [0.2621951219512195, 500, 1500, "navigateToDhaka"], "isController": true}, {"data": [0.0625, 500, 1500, "logout"], "isController": true}, {"data": [0.4817073170731707, 500, 1500, "navigateToApp"], "isController": true}, {"data": [0.5384615384615384, 500, 1500, "SignUpUsingEmail"], "isController": true}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 174, 0, 0.0, 111.98850574712644, 0, 2984, 1.0, 1371.75, 2951.0, 1.4261476800511446, 28.310747539075624, 0.06770711670232035], "isController": false}, "titles": ["Label", "#Samples", "KO", "Error %", "Average", "Min", "Max", "90th pct", "95th pct", "99th pct", "Throughput", "Received", "Sent"], "items": [{"data": ["navigateToLogin", 82, 0, 0.0, 1079.0731707317068, 406, 1997, 1679.3000000000002, 1928.75, 1997.0, 0.7000947689260376, 8.472240602081502, 0.39947290120979795], "isController": true}, {"data": ["-- Executing TC001  -- Keywords: navigateToApp;navigateToDhaka;changeLanguage;navigateToLogin;chooseOptions;SignUpUsingEmail;signUp", 82, 0, 0.0, 0.3170731707317073, 0, 2, 1.0, 1.0, 2.0, 0.7066163417954949, 14.230306233627182, 0.0], "isController": false}, {"data": ["changeLanguage", 82, 0, 0.0, 992.5121951219509, 405, 2241, 1484.7, 1765.05, 2241.0, 0.7026864904237542, 14.482615605852866, 0.39134469128925836], "isController": true}, {"data": ["verifyLogout", 77, 0, 0.0, 1148.7402597402597, 420, 2081, 1595.4, 1902.0, 2081.0, 0.7170394651071834, 14.798042007920028, 0.4261423160374723], "isController": true}, {"data": ["navigateToDashboard", 82, 0, 0.0, 1996.4024390243903, 820, 3040, 2530.8, 2918.649999999999, 3040.0, 0.7261842559710943, 9.210626090383373, 0.7573874857198523], "isController": true}, {"data": ["navigateToSettings", 82, 0, 0.0, 1965.0121951219514, 969, 3444, 2563.7000000000003, 2990.25, 3444.0, 0.7225051544575043, 9.005208287442509, 0.7641338694115989], "isController": true}, {"data": ["chooseOptions", 78, 0, 0.0, 1046.5512820512822, 400, 1987, 1524.6000000000001, 1861.0999999999997, 1987.0, 0.7013190192323254, 8.190502100585332, 0.41386181205549416], "isController": true}, {"data": ["-- Executing TC002  -- Keywords: navigateToDashboard;navigateToSettings;logout;verifyLogout", 82, 0, 0.0, 0.32926829268292673, 0, 1, 1.0, 1.0, 1.0, 0.7379874542132784, 14.790264190508761, 0.0], "isController": false}, {"data": ["signUp", 78, 0, 0.0, 1143.3076923076922, 430, 2199, 1839.1000000000001, 1975.2, 2199.0, 0.6988120195667366, 8.629373034591195, 0.5638826454962461], "isController": true}, {"data": ["navigateToDhaka", 82, 0, 0.0, 1499.1585365853664, 594, 2704, 2172.6000000000004, 2428.0, 2704.0, 0.6990741530119866, 48.72319061279817, 0.2723931514177565], "isController": true}, {"data": ["logout", 80, 0, 0.0, 2048.6875, 949, 3539, 2976.9, 3034.35, 3539.0, 0.7271933970839545, 15.84983342726248, 0.7935924035559757], "isController": true}, {"data": ["navigateToApp", 82, 0, 0.0, 1070.2073170731715, 413, 2084, 1713.9, 1827.4, 2084.0, 0.6976407830592398, 18.614200658930226, 0.2568462648567709], "isController": true}, {"data": ["SignUpUsingEmail", 78, 0, 0.0, 941.1410256410259, 403, 2014, 1487.5, 1512.4999999999998, 2014.0, 0.6967458396233999, 8.400414195303219, 0.41184350686473303], "isController": true}]}, function(index, item){
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
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 174, 0, null, null, null, null, null, null, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
