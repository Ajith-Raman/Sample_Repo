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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.423582995951417, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.4533333333333333, 500, 1500, "navigateToLogin"], "isController": true}, {"data": [1.0, 500, 1500, "-- Executing TC001  -- Keywords: navigateToApp;navigateToDhaka;changeLanguage;navigateToLogin;chooseOptions;SignUpUsingEmail;signUp"], "isController": false}, {"data": [0.44805194805194803, 500, 1500, "changeLanguage"], "isController": true}, {"data": [0.4246575342465753, 500, 1500, "verifyLogout"], "isController": true}, {"data": [0.03896103896103896, 500, 1500, "navigateToDashboard"], "isController": true}, {"data": [0.06493506493506493, 500, 1500, "navigateToSettings"], "isController": true}, {"data": [0.42, 500, 1500, "chooseOptions"], "isController": true}, {"data": [1.0, 500, 1500, "-- Executing TC002  -- Keywords: navigateToDashboard;navigateToSettings;logout;verifyLogout"], "isController": false}, {"data": [0.41216216216216217, 500, 1500, "signUp"], "isController": true}, {"data": [0.358974358974359, 500, 1500, "navigateToDhaka"], "isController": true}, {"data": [0.04666666666666667, 500, 1500, "logout"], "isController": true}, {"data": [0.3974358974358974, 500, 1500, "navigateToApp"], "isController": true}, {"data": [0.42567567567567566, 500, 1500, "SignUpUsingEmail"], "isController": true}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 165, 0, 0.0, 92.5878787878788, 0, 2830, 1.0, 967.6999999999996, 2316.5200000000027, 1.3653176225269132, 26.958623118550943, 0.0662376216373882], "isController": false}, "titles": ["Label", "#Samples", "KO", "Error %", "Average", "Min", "Max", "90th pct", "95th pct", "99th pct", "Throughput", "Received", "Sent"], "items": [{"data": ["navigateToLogin", 75, 0, 0.0, 1149.1066666666663, 715, 2005, 1514.4, 1629.0000000000007, 2005.0, 0.6466353407768246, 7.9743272298142, 0.3690031307927749], "isController": true}, {"data": ["-- Executing TC001  -- Keywords: navigateToApp;navigateToDhaka;changeLanguage;navigateToLogin;chooseOptions;SignUpUsingEmail;signUp", 78, 0, 0.0, 0.5512820512820513, 0, 3, 1.0, 1.0, 3.0, 0.6624203821656051, 13.023926817940552, 0.0], "isController": false}, {"data": ["changeLanguage", 77, 0, 0.0, 1182.792207792208, 736, 2408, 1523.8, 1858.4999999999998, 2408.0, 0.6541944911726224, 13.754055859819715, 0.36436695000934566], "isController": true}, {"data": ["verifyLogout", 73, 0, 0.0, 1160.8493150684928, 738, 2019, 1509.8, 1971.8, 2019.0, 0.7128349347707211, 15.006428407082455, 0.42349367847238495], "isController": true}, {"data": ["navigateToDashboard", 77, 0, 0.0, 2063.7532467532474, 1348, 3042, 2526.2, 2841.3999999999996, 3042.0, 0.7031706604324957, 9.010060776889429, 0.7333850247479544], "isController": true}, {"data": ["navigateToSettings", 77, 0, 0.0, 2066.831168831169, 1200, 3518, 2853.0000000000005, 3065.0, 3518.0, 0.699434094232848, 8.80849812424493, 0.7397335195841547], "isController": true}, {"data": ["chooseOptions", 75, 0, 0.0, 1106.2400000000002, 701, 2142, 1527.4, 1587.4, 2142.0, 0.6473106400607609, 7.64382837853, 0.38203127697127665], "isController": true}, {"data": ["-- Executing TC002  -- Keywords: navigateToDashboard;navigateToSettings;logout;verifyLogout", 77, 0, 0.0, 0.4025974025974027, 0, 3, 1.0, 1.0, 3.0, 0.7146768639607949, 13.981663781661577, 0.0], "isController": false}, {"data": ["signUp", 74, 0, 0.0, 1183.0810810810815, 750, 2121, 1607.0, 1974.5, 2121.0, 0.6534100943029704, 8.15358807129234, 0.5272913226697984], "isController": true}, {"data": ["navigateToDhaka", 78, 0, 0.0, 1324.3076923076917, 831, 2118, 1788.2000000000003, 1963.8, 2118.0, 0.6578725414122331, 45.72110381840188, 0.2563390078354307], "isController": true}, {"data": ["logout", 75, 0, 0.0, 2148.253333333334, 1310, 3549, 2875.8, 3048.8, 3549.0, 0.6943287229906128, 15.420805878418411, 0.7576229337934418], "isController": true}, {"data": ["navigateToApp", 78, 0, 0.0, 1252.0384615384614, 701, 2016, 1561.7000000000007, 1918.95, 2016.0, 0.6583389601620527, 17.831727928764348, 0.24237674607528695], "isController": true}, {"data": ["SignUpUsingEmail", 74, 0, 0.0, 1156.2567567567562, 713, 1735, 1532.0, 1564.0, 1735.0, 0.6511619721408269, 7.93540063510291, 0.3849431443203717], "isController": true}]}, function(index, item){
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
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 165, 0, null, null, null, null, null, null, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
