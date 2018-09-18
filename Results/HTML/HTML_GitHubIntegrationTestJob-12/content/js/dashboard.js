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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.3668903803131991, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.39855072463768115, 500, 1500, "navigateToLogin"], "isController": true}, {"data": [1.0, 500, 1500, "-- Executing TC001  -- Keywords: navigateToApp;navigateToDhaka;changeLanguage;navigateToLogin;chooseOptions;SignUpUsingEmail;signUp"], "isController": false}, {"data": [0.35507246376811596, 500, 1500, "changeLanguage"], "isController": true}, {"data": [0.3805970149253731, 500, 1500, "verifyLogout"], "isController": true}, {"data": [0.03571428571428571, 500, 1500, "navigateToDashboard"], "isController": true}, {"data": [0.014705882352941176, 500, 1500, "navigateToSettings"], "isController": true}, {"data": [0.39552238805970147, 500, 1500, "chooseOptions"], "isController": true}, {"data": [1.0, 500, 1500, "-- Executing TC002  -- Keywords: navigateToDashboard;navigateToSettings;logout;verifyLogout"], "isController": false}, {"data": [0.291044776119403, 500, 1500, "signUp"], "isController": true}, {"data": [0.10714285714285714, 500, 1500, "navigateToDhaka"], "isController": true}, {"data": [0.0, 500, 1500, "logout"], "isController": true}, {"data": [0.3380281690140845, 500, 1500, "navigateToApp"], "isController": true}, {"data": [0.4253731343283582, 500, 1500, "SignUpUsingEmail"], "isController": true}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 151, 0, 0.0, 136.3774834437086, 0, 3080, 1.0, 1819.800000000001, 2978.599999999998, 1.2410414885922807, 24.813678437212342, 0.059883398090768626], "isController": false}, "titles": ["Label", "#Samples", "KO", "Error %", "Average", "Min", "Max", "90th pct", "95th pct", "99th pct", "Throughput", "Received", "Sent"], "items": [{"data": ["navigateToLogin", 69, 0, 0.0, 1167.5942028985512, 447, 2850, 1852.0, 2017.0, 2850.0, 0.5912191109435515, 7.1546750222778215, 0.33739720606128115], "isController": true}, {"data": ["-- Executing TC001  -- Keywords: navigateToApp;navigateToDhaka;changeLanguage;navigateToLogin;chooseOptions;SignUpUsingEmail;signUp", 71, 0, 0.0, 0.32394366197183116, 0, 3, 1.0, 1.0, 3.0, 0.5937149833592561, 11.849311112922917, 0.0], "isController": false}, {"data": ["changeLanguage", 69, 0, 0.0, 1301.4492753623188, 452, 3015, 1956.0, 2090.0, 3015.0, 0.5931249086673601, 12.223933664566374, 0.33037567801053874], "isController": true}, {"data": ["verifyLogout", 67, 0, 0.0, 1229.776119402985, 558, 2230, 1833.2000000000003, 1984.6, 2230.0, 0.6381256250297633, 13.168819050907185, 0.37894289609028997], "isController": true}, {"data": ["navigateToDashboard", 70, 0, 0.0, 2228.485714285713, 973, 3695, 2978.5, 3135.9, 3695.0, 0.6231472496951029, 7.903746561562497, 0.6499231080804394], "isController": true}, {"data": ["navigateToSettings", 68, 0, 0.0, 2357.176470588235, 1024, 4383, 3044.4, 3410.7999999999997, 4383.0, 0.631835202512474, 7.875110048502643, 0.6682397698447358], "isController": true}, {"data": ["chooseOptions", 67, 0, 0.0, 1191.7164179104477, 418, 2149, 1646.0000000000002, 1863.7999999999997, 2149.0, 0.5927524948687097, 6.922585045053613, 0.34987326597777624], "isController": true}, {"data": ["-- Executing TC002  -- Keywords: navigateToDashboard;navigateToSettings;logout;verifyLogout", 70, 0, 0.0, 0.4999999999999999, 0, 9, 1.0, 1.0, 9.0, 0.6379585326953748, 12.6709974510139, 0.0], "isController": false}, {"data": ["signUp", 67, 0, 0.0, 1355.0298507462685, 486, 2144, 1954.6, 2002.3999999999999, 2144.0, 0.5920558476560774, 7.311080267198339, 0.47781792625811864], "isController": true}, {"data": ["navigateToDhaka", 70, 0, 0.0, 1826.2571428571425, 786, 2874, 2423.7, 2631.65, 2874.0, 0.5872729560803726, 40.74402764377701, 0.22882998972272328], "isController": true}, {"data": ["logout", 68, 0, 0.0, 2428.838235294118, 1525, 4110, 3318.4, 3640.5999999999995, 4110.0, 0.6291170157649323, 13.711050255347496, 0.686307829037451], "isController": true}, {"data": ["navigateToApp", 71, 0, 0.0, 1348.69014084507, 618, 2594, 1863.7999999999997, 2175.0, 2594.0, 0.5903825845452806, 15.750646315617699, 0.21735765075544025], "isController": true}, {"data": ["SignUpUsingEmail", 67, 0, 0.0, 1143.1343283582084, 417, 2008, 1672.6000000000001, 1973.8, 2008.0, 0.5952169432500622, 7.17631677867702, 0.3519091777788636], "isController": true}]}, function(index, item){
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
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 151, 0, null, null, null, null, null, null, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
