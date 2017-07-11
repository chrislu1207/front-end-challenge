Date.prototype.yyyymmdd = function() {
  var mm = this.getMonth() + 1; // getMonth() is zero-based
  var dd = this.getDate();

  return [this.getFullYear(),
    (mm > 9 ? '' : '0') + mm,
    (dd > 9 ? '' : '0') + dd
  ].join('');
};

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
  $scope.dateIcon = 'fa fa-caret-up';
  $scope.filterAll = true;
  $scope.startDate = new Date(2014, 0, 1);
  $scope.endDate = new Date();
  $scope.filterDate = true;
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
    if ($scope.dateIcon === 'fa fa-caret-up') {
      $scope.dateIcon = 'fa fa-caret-down';
    } else {
      $scope.dateIcon = 'fa fa-caret-up';
    }
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

  // $scope.filterBetweenDates = function() {
  //   console.log($scope.startDate.yyyymmdd());
  //   console.log($scope.endDate.yyyymmdd());
  //   var startDate = parseInt($scope.startDate.yyyymmdd());
  //   var endDate = parseInt($scope.endDate.yyyymmdd());
  //   var filteredTransactions = $scope.data.transactionData.transactions.filter(function(transaction) {
  //     var transactionDate = parseInt(transaction.transactionDate.split('-').join(''));
  //     return (transactionDate > startDate && transactionDate < endDate);
  //   });
  //   $scope.data.transactionData.transactions = filteredTransactions;
  // };

  $scope.filterBetweenDates = function() {
    var startDate = parseInt($scope.startDate.yyyymmdd());
    var endDate = parseInt($scope.endDate.yyyymmdd());
    return function(p) {
      var transactionDate = parseInt(p.transactionDate.split('-').join(''));
      if ($scope.filterDate) {
        if (transactionDate > startDate && transactionDate < endDate) {
          return true;
        }
      } else {
        return true;
      }
    };
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













