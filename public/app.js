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
  $scope.categoryFilters = [];
  $scope.filterAll = true;
  $scope.ascendingDate = true;

  factory.getAll()
  .then(function(data) {
    $scope.data = data;
    $scope.data.totalBalance = 0;
    $scope.data.accounts.forEach(function(account) {
      $scope.data.totalBalance += account.balance;
    });
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

  $scope.filterByCategory = function(category) {
    $scope.filterAll = false;
    if ($scope.categoryFilters.includes(category)) {
      $scope.categoryFilters.splice($scope.categoryFilters.indexOf(category), 1);
    } else {
      $scope.categoryFilters.push(category);
    }
  };

  $scope.filterTransactions = function() {
    return function(p) {
      if (!$scope.filterAll) {
        for (var i = 0; i < $scope.categoryFilters.length; i++) {
          if ($scope.categoryFilters.includes(p.category)) {
            return true;
          }
        }
      } else {
        return true;
      }
    };
  };

});













