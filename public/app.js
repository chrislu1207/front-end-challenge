angular.module('app', [])
.factory('factory', function($http) {
  var getAll = function() {
    return $http({
      method: 'GET',
      url: 'http://demo7235469.mockable.io/transactions'
    })
    .then(function(resp) {
      return resp.data;
    });
  };

  return {
    getAll: getAll,
  };
})
.controller('mainCtrl', function(factory, $scope) {
  $scope.data = {};
  $scope.ascendingDate = true;

  factory.getAll()
  .then(function(data) {
    $scope.data = data;
    console.log($scope.data);
  });

  $scope.reverseDateSort = function() {
    // if ($scope.ascendingDate) {    
    //   $scope.data.transactionData.transactions.sort(function(a, b) {
    //     var aa = a.transactionDate.split('-').join('');
    //     var bb = b.transactionDate.split('-').join('');
    //     return aa < bb ? -1 : (aa > bb ? 1 : 0);
    //   });
    // } else {
    //   $scope.data.transactionData.transactions.sort(function(a, b) {
    //     var bb = a.transactionDate.split('-').join('');
    //     var aa = b.transactionDate.split('-').join('');
    //     return aa < bb ? -1 : (aa > bb ? 1 : 0);
    //   });
    // }
    // $scope.ascendingDate = !$scope.ascendingDate;
    $scope.data.transactionData.transactions.reverse();
  };

})
.filter('unique', function() {
  return function(collection, keyname) {
    var output = [];
    var keys = [];

    angular.forEach(collection, function(item) {
      var key = item[keyname];
      if (keys.indexOf(key) === -1) {
        keys.push(key);
        output.push(item);
      }
    });
    return output;
  };
});