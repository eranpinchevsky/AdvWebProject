(function(){
    "use strict";
    //var myApp = angular.module("myApp");
    myApp.controller("userCtrl",['$scope','userService','$location', '$cookieStore','$window' , function($scope,userService,$location, $cookieStore, $window) {
        var self = this;
        var currentUser = null;

        $scope.connected = false;
        $scope.currentUser = {};
        $scope.loginError = false;

        if ($cookieStore.get('currentUser') != undefined){
            $scope.connected = true;
            $scope.currentUser = $cookieStore.get('currentUser');
        }
        //else {}

        userService.getAllUsers().then(function(data) {
            $scope.appUsers = data;});

        // Register
         $scope.createNewUser = function() {
             this.userCtrl.user.role = "user";
             userService.createUser(this.userCtrl.user).then(function(data,err) {
                if(err){
                    console.log(err);
                }else{
                    $scope.connected = true;
                    // Get the user data
                    userService.getUserByID(data.data.id).then(function(user,err) {
                        $scope.currentUser = user.data;

                        var expireDate = new Date();
                        expireDate.setDate(expireDate.getDate() + 1);

                        // Save the user
                        $cookieStore.put('currentUser',user.data,{
                            expires: expireDate
                        });

                        $location.path('/home');

                    });
                }
            });
        }

        // Login
        $scope.checkLoginUser = function() {
             var userEmail= this.userCtrl.userEmail;
            userService.checkUser(this.userCtrl.userEmail,this.userCtrl.userPassword).then(function(data,err) {

                if(err){
                    console.log(err);
                }else{
                    if(data.data){
                        $scope.loginError = false;
                        $scope.connected = true;
                        // Get the user data
                        userService.getUserByEmail(userEmail).then(function(user,err) {
                            $scope.currentUser = user.data;

                            var expireDate = new Date();
                            expireDate.setDate(expireDate.getDate() + 1);

                            // Save the user
                            $cookieStore.put('currentUser',user.data,{
                                expires: expireDate
                            });

                        });

                       $location.path('/home');
                    }
                    else{
                        $scope.loginError = true;
                    }
                }
            });
        }

        // Logout
        $scope.logout = function () {
            $cookieStore.remove('currentUser');
            $scope.currentUser = {};
            $scope.connected = false;

        }

    }])

    myApp.controller("branchCtrl", function($scope,branchService) {
        var self = this;
        branchService.getAllBranches().then(function(data) {
            $scope.appBranches = data;});

    })

    myApp.controller("transactionCtrl", function($scope,transactionService) {
        var self = this;
        transactionService.GetAllTransactions().then(function(data) {
            $scope.appTransaction = data;});

        transactionService.GetGroupTransactions().then(function(data) {
            $scope.appGroupTransaction = data;});

        /*********************
         * Bar Chart
         * ******************/
        // set the dimensions and margins of the graph
        var margin = {top: 20, right: 20, bottom: 30, left: 40},
            width = 960 - margin.left - margin.right,
            height = 500 - margin.top - margin.bottom;

        // set the ranges
        var x = d3.scaleBand()
            .range([0, width])
            .padding(0.1);
        var y = d3.scaleLinear()
            .range([height, 0]);

        // append the svg object
        var svg = d3.select("#userTransactionBarChart").append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform",
                "translate(" + margin.left + "," + margin.top + ")");

        // Get the data
        d3.json("/Transactions/GetGroup", function(error, data) {

            if (data != undefined){
                data = data.filter(function(i) {
                    return i.totalPrice ;
                });
                data.sort(function(a, b){
                    return b.totalPrice-a.totalPrice;
                });

                // Scale the range of the data in the domains
                x.domain(data.map(function(d) { return d._id.month +"/" + d._id.year + " "+  d._id.catagory; }));
                y.domain([0, d3.max(data, function(d) { return d.totalPrice; })]);

                if (error) throw error;
                // append the rectangles for the bar chart
                svg.selectAll(".bar")
                    .data(data)
                    .enter().append("rect")
                    .attr("class", "bar")
                    .attr("x", function(d) { return x(d._id.month +"/" + d._id.year + " "+  d._id.catagory); })
                    .attr("width", x.bandwidth())
                    .attr("y", function(d) { return y(d.totalPrice); })
                    .attr("height", function(d) { return height - y(d.totalPrice); });

                // add the x Axis
                svg.append("g")
                    .attr("transform", "translate(0," + height + ")")
                    .call(d3.axisBottom(x));

                // add the y Axis
                svg.append("g")
                    .call(d3.axisLeft(y));


            }

        });

        /*********************
         * End Bar Chart
         * ******************/
    })

    //angular.module('app').controller('userCtrl', ['$scope', 'userService', userCtrl])
    //angular.module('myApp').controller('userCtrl', ['$scope', 'userService', userCtrl])
})();