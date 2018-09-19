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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.4342885375494071, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.44155844155844154, 500, 1500, "navigateToLogin"], "isController": true}, {"data": [1.0, 500, 1500, "-- Executing TC001  -- Keywords: navigateToApp;navigateToDhaka;changeLanguage;navigateToLogin;chooseOptions;SignUpUsingEmail;signUp"], "isController": false}, {"data": [0.4675324675324675, 500, 1500, "changeLanguage"], "isController": true}, {"data": [0.4868421052631579, 500, 1500, "verifyLogout"], "isController": true}, {"data": [0.08641975308641975, 500, 1500, "navigateToDashboard"], "isController": true}, {"data": [0.07792207792207792, 500, 1500, "navigateToSettings"], "isController": true}, {"data": [0.4473684210526316, 500, 1500, "chooseOptions"], "isController": true}, {"data": [1.0, 500, 1500, "-- Executing TC002  -- Keywords: navigateToDashboard;navigateToSettings;logout;verifyLogout"], "isController": false}, {"data": [0.3684210526315789, 500, 1500, "signUp"], "isController": true}, {"data": [0.2911392405063291, 500, 1500, "navigateToDhaka"], "isController": true}, {"data": [0.019736842105263157, 500, 1500, "logout"], "isController": true}, {"data": [0.46875, 500, 1500, "navigateToApp"], "isController": true}, {"data": [0.45394736842105265, 500, 1500, "SignUpUsingEmail"], "isController": true}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 171, 0, 0.0, 105.61988304093568, 0, 2804, 1.0, 1309.0000000000002, 2658.5600000000004, 1.4027201286236937, 28.353292893192293, 0.06363765934408479], "isController": false}, "titles": ["Label", "#Samples", "KO", "Error %", "Average", "Min", "Max", "90th pct", "95th pct", "99th pct", "Throughput", "Received", "Sent"], "items": [{"data": ["navigateToLogin", 77, 0, 0.0, 1085.6883116883116, 421, 1951, 1620.2, 1673.499999999999, 1951.0, 0.6538278649548265, 7.912338771992392, 0.37318472547720943], "isController": true}, {"data": ["-- Executing TC001  -- Keywords: navigateToApp;navigateToDhaka;changeLanguage;navigateToLogin;chooseOptions;SignUpUsingEmail;signUp", 80, 0, 0.0, 0.5124999999999998, 0, 2, 1.0, 1.0, 2.0, 0.6732023393781293, 13.436311705831615, 0.0], "isController": false}, {"data": ["changeLanguage", 77, 0, 0.0, 1105.9480519480517, 420, 2160, 1649.0000000000002, 1853.6999999999998, 2160.0, 0.6577092924927183, 13.554977449967115, 0.36640800504813237], "isController": true}, {"data": ["verifyLogout", 76, 0, 0.0, 1091.657894736842, 437, 1926, 1509.8999999999999, 1637.7499999999995, 1926.0, 0.7366054121113438, 15.201118719469644, 0.43807880466387533], "isController": true}, {"data": ["navigateToDashboard", 81, 0, 0.0, 2012.283950617284, 890, 3473, 2795.2, 2948.2999999999997, 3473.0, 0.7181742414838721, 9.109030320695831, 0.7490332909226323], "isController": true}, {"data": ["navigateToSettings", 77, 0, 0.0, 2038.4285714285718, 903, 3372, 2643.4, 3011.5999999999995, 3372.0, 0.6989261952091786, 8.711323270951901, 0.7391963568472075], "isController": true}, {"data": ["chooseOptions", 76, 0, 0.0, 1108.5131578947369, 415, 2267, 1761.9999999999993, 2015.3999999999992, 2267.0, 0.6754054654521218, 7.887865196622973, 0.3987134803377027], "isController": true}, {"data": ["-- Executing TC002  -- Keywords: navigateToDashboard;navigateToSettings;logout;verifyLogout", 81, 0, 0.0, 0.4197530864197531, 0, 2, 1.0, 1.0, 2.0, 0.7326868803820826, 14.552549719249765, 0.0], "isController": false}, {"data": ["signUp", 76, 0, 0.0, 1207.7105263157894, 513, 2619, 1882.6, 2064.5499999999997, 2619.0, 0.675495511510088, 8.341446038129943, 0.5452119533819216], "isController": true}, {"data": ["navigateToDhaka", 79, 0, 0.0, 1474.2405063291137, 594, 2875, 1992.0, 2109.0, 2875.0, 0.6651679338536799, 45.31625933024325, 0.2591816461011897], "isController": true}, {"data": ["logout", 76, 0, 0.0, 2167.1447368421054, 986, 3375, 2762.1, 2954.6, 3375.0, 0.7235752232610393, 15.770972078088999, 0.78999716758383], "isController": true}, {"data": ["navigateToApp", 80, 0, 0.0, 1103.7124999999994, 407, 2394, 1596.5, 1888.6500000000003, 2394.0, 0.6659341391136417, 17.766264400825758, 0.24517301801351846], "isController": true}, {"data": ["SignUpUsingEmail", 76, 0, 0.0, 1088.3421052631584, 409, 2442, 1657.9999999999998, 1971.149999999999, 2442.0, 0.6745422432079808, 8.132713412739973, 0.3988626252562817], "isController": true}]}, function(index, item){
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
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 171, 0, null, null, null, null, null, null, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
