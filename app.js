var sync = angular.module('dataset', ['chart.js']);

sync.controller('DatasetController', ['$http', '$scope', function($http, $scope) {
    var self = this;

    //var api = 'http://prodsolr05-vh.gbif.org:8983/solr/occurrence_53_shard11_replica1/select?q=*:*&wt=json&indent=true&rows=0&' +
    var api = 'http://localhost:8983/solr/occurrence_53_shard11_replica1/select?q=*:*&wt=json&indent=true&rows=0&' +
               'json.facet={' +
               '  datasets:{' +
               '    type : terms,' +
               '    field : dataset_key,' +
               '    facet: {' +
               '      crawlId : {' +
               '        type:  terms,' +
               '        field : crawl_id,' +
               '        limit : 50' +
               '      }' +
               '    },' +
               '    limit : 100000' +
               '  }' +
               '}';
            
    self.datasets = [];
    self.total = 0;
    self.overcrawled = 0;

    var getDatasets = function() {

        $http.get(api).then(function (response) {
            
            self.datasets = []
            
            angular.forEach(response.data.facets.datasets.buckets, function(dataset) {
                dataset.key = dataset.val 
                self.total++
                if (dataset.crawlId.buckets.length > 1) {
                  self.overcrawled++
                  dataset.numCrawls = dataset.crawlId.buckets.length
                  dataset.crawls = dataset.crawlId.buckets                  
                  self.datasets.push(dataset)
                }
            });
        });
    }
    
    // call the function to populate the list
    getDatasets();
}]);

sync.controller('ChartController', ['$scope', function($scope) {

    function compare(a,b) {
      if (a.val < b.val)
        return -1;
      if (a.val > b.val)
        return 1;
      return 0;
    }

    var populateChart = function () {    
      var data = $scope.$parent.dataset.crawls; //[{val:1,count:2}]
      data.sort(compare);
      $scope.labels = [];
      $scope.data = [];
      data.forEach(function(datum) {
        $scope.labels.push(datum.val);
        $scope.data.push(datum.count);    
      })
    } 
    
    populateChart()   
}]);