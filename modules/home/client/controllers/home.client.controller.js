(function() {
  "use strict";

  angular.module("home").controller("HomeController", HomeController);

  HomeController.$inject = [
    "$state",
    "UsersService",
    "BookingsService",
    "$timeout"
  ];

  function HomeController($state, UsersService, BookingsService, $timeout) {
    var vm = this;
    vm.isLoading = 0;

    vm.users = UsersService.query();

    BookingsService.getHomePageData().$promise.then(function(response) {
      vm.totalBookings = response.total;
      vm.totalOrders = response.count;
      vm.totalConsignor = response.consignor.length;
      vm.totalBusiness = vm.changeNumberFormat(
        vm.calculateTotalAmountAndExtras(response.amount, response.extras),
        0,
        false
      );
      vm.isLoading++;
    });

    vm.calculateTotalAmountAndExtras = function(amount, extras) {
      var total = 0;

      for (var d = 0; d < amount.length; d++) {
        for (var k = 0; k < amount[d].length; k++) {
          if (amount[d][k] !== "") total += parseInt(amount[d][k]);
        }
      }

      for (var e = 0; e < extras.length; e++) {
        for (var f = 0; f < extras[e][0].length; f++) {
          if (extras[e][0][f] !== [] && extras[e][0][f].extra_value !== "")
            total += parseInt(extras[e][0][f].extra_value);
        }
      }
      return total;
    };

    vm.changeNumberFormat = function(number, decimals, recursiveCall) {
      const decimalPoints = decimals || 2;
      const noOfLakhs = number / 100000;
      let displayStr;
      let isPlural;

      // Rounds off digits to decimalPoints decimal places
      function roundOf(integer) {
        return +integer.toLocaleString(undefined, {
          minimumFractionDigits: decimalPoints,
          maximumFractionDigits: decimalPoints
        });
      }

      if (noOfLakhs >= 1 && noOfLakhs <= 99) {
        const lakhs = roundOf(noOfLakhs);
        isPlural = lakhs > 1 && !recursiveCall;
        displayStr = `${lakhs} Lakh${isPlural ? "s" : ""}`;
      } else if (noOfLakhs >= 100) {
        const crores = roundOf(noOfLakhs / 100);
        const crorePrefix =
          crores >= 100000
            ? changeNumberFormat(crores, decimals, true)
            : crores;
        isPlural = crores > 1 && !recursiveCall;
        displayStr = `${crorePrefix} Crore${isPlural ? "s" : ""}`;
      } else {
        displayStr = roundOf(+number);
      }

      return displayStr;
    };

    BookingsService.getMonthGraphData().$promise.then(function(response) {
      var data = response.data;
      var displayData = [["x"], ["Bookings"], ["Amount"]];
      for (var i = 0; i < data.length; i++) {
        if (data[i]._id.year >= 2019) {
          displayData[0].push(
            moment()
              .month(data[i]._id.month - 1)
              .year(data[i]._id.year)
          );
          displayData[1].push(data[i].count);
          displayData[2].push(
            vm.calculateTotalAmountAndExtras(data[i].values, data[i].extras)
          );
        }
      }
      vm.isLoading++;
      vm.chart = c3.generate({
        bindto: "#pickup",
        data: {
          x: "x",
          columns: displayData,
          names: {
            x: "",
            Bookings: "Bookings",
            Amount: "Amount"
          },
          axes: {
            Amount: "y2"
          },
          type: "bar"
        },
        transition: {
            duration: 300
        },
        bar: {
          width: {
            ratio: 0.7
          }
        },
        axis: {
          x: {
            type: "timeseries",
            localtime: false,
            tick: {
              format: function(x) {
                return moment(x).format("MMM YYYY");
              },
              centered: true
            },
            label: {
              text: "Dates",
              position: "outer-right"
            }
          },
          y: {
            label: {
              text: "Bookings",
              position: "outer-top"
            },
            padding: {
              bottom: 0
            }
          },
          y2: {
            show: true,
            label: {
              text: "Amount",
              position: "outer-top"
            },
            padding: {
              bottom: 0
            }
          }
        },
        point: {
          show: true,
          focus: {
            expand: {
              enabled: true
            }
          }
        },
        tooltip: {
          format: {
            title: function(x) {
              return moment(x).format("MMM YYYY");
            },
            value: function(value, ratio, id) {
              if (id === "Bookings") {
                var format = d3.format(",");
                var cal = format(value);
                return cal;
              } else {
                var cal = vm.changeNumberFormat(value, 2, false);
                return cal;
              }
            }
          }
        }
      });
    });

    BookingsService.getClientGraphData().$promise.then(function(response) {
      var data = response.data;
      var displayData = [["x"], ["Bookings"], ["Amount"]];
      for (var i = 0; i < data.length; i++) {
        if (data[i].count > 100) {
          displayData[0].push(data[i]._id);
          displayData[1].push(data[i].count);
          displayData[2].push(
            vm.calculateTotalAmountAndExtras(data[i].values, data[i].extras)
          );
        }
      }
      vm.isLoading++;
      vm.chart = c3.generate({
        bindto: "#clients",
        data: {
          x: "x",
          columns: displayData,
          names: {
            x: "",
            Bookings: "Bookings",
            Amount: "Amount"
          },
          axes: {
            Amount: "y2"
          },
          type: "bar"
        },
        bar: {
          width: {
            ratio: 0.6
          }
        },
        axis: {
          x: {
            type: "category",
            tick: {
              centered: true
            },
            label: {
              text: "Client",
              position: "outer-right"
            }
          },
          y: {
            label: {
              text: "Bookings",
              position: "outer-top"
            },
            padding: {
              bottom: 0
            }
          },
          y2: {
            show: true,
            label: {
              text: "Amount",
              position: "outer-top"
            },
            padding: {
              bottom: 0
            }
          }
        },
        point: {
          show: true,
          focus: {
            expand: {
              enabled: true
            }
          }
        },
        tooltip: {
          format: {
            value: function(value, ratio, id) {
              if (id === "Bookings") {
                var format = d3.format(",");
                var cal = format(value);
                return cal;
              } else {
                var cal = vm.changeNumberFormat(value, 2, false);
                return cal;
              }
            }
          }
        }
      });
    });
  }
})();
