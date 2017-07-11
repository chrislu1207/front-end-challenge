Date.prototype.yyyymmdd = function() {
  var mm = this.getMonth() + 1;
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

  /*
  * Global variables, binded two ways
  */
  $scope.categoryFilters = [];
  $scope.dateIcon = 'fa fa-caret-up';
  $scope.filterAll = true;
  $scope.startDate = new Date(2014, 0, 1);
  $scope.endDate = new Date();
  $scope.filterDate = true;
  $scope.ascendingDate = true;

  /*
  * GETs the required data from the api every time the app is first loaded and stores it in the $scope
  */
  factory.getAll()
  .then(function(data) {
    $scope.data = data;
    $scope.data.totalBalance = 0;
    $scope.data.accounts.forEach(function(account) {
      $scope.data.totalBalance += account.balance;
    });
  });

  /*
  * Reverses transactions order and changes icon, might require refactoring if transactions are not
  * sorted by date by default
  */
  $scope.reverseDateSort = function() {
    if ($scope.dateIcon === 'fa fa-caret-up') {
      $scope.dateIcon = 'fa fa-caret-down';
    } else {
      $scope.dateIcon = 'fa fa-caret-up';
    }
    $scope.data.transactionData.transactions.reverse();
  };

  /*
  * Custom transaction filter function that filters between two input dates
  */
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

  /*
  * Pushes category to filter by into storage array that contains all categories to be filtered
  */
  $scope.filterByCategory = function(category) {
    $scope.filterAll = false;
    if ($scope.categoryFilters.includes(category)) {
      $scope.categoryFilters.splice($scope.categoryFilters.indexOf(category), 1);
    } else {
      $scope.categoryFilters.push(category);
    }
  };

  /*
  * Custom transaction filter function that filters through categories in an array
  */
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