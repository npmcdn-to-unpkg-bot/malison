 var job = angular.module('Job',['ngCookies']);
job.controller ('JobCtrl',['$scope','$http','$cookieStore', '$window', function($scope, $http,$cookieStore,$window){

$scope.job={};
$scope.job.currency = "Ksh";
$scope.jobs=[];
$scope.selectedjobs = [];

$scope.showJobs = true;
$scope.showJobDetails = false;

$scope.pageSize = 10;
$scope.search = "";
$scope.currentPage = 0;
$scope.addJob =function(){
	$http({
		url: './api/jobapi/create',
		method: 'POST',
		data: $.param($scope.job),
		headers: {'Content-Type':'application/x-www-form-urlencoded'}

	}).success(function(data){
		$scope.job={};
		getjobs();
	});

};

$scope.logout = function(){
	$http.post('./api/user/logout',{username: $scope.user})
		.success(function(response){
            $window.location.href = '/malison/login.jsp';
		});
};
/*$scope.user = {};
            function getuserdetails(){
                $http.get('/api/user/getuser')
                .success(function(data){
                    $scope.user = data;
                    });
            };
$cookieStore.put('userDetails', $rootScope.user);*/

function getjobs(){
	$http.get("./api/jobapi/list").
	success(function(data){
	$scope.jobs = data.job;
	});
};

getjobs();

$scope.numberOfPages=function(){
        return Math.ceil($scope.jobs.length/$scope.pageSize);                
    }


	var updateSelected = function (action, id){
		if (action === 'add' && $scope.selectedjobs.indexOf(id) === -1)
			$scope.selectedjobs.push(id);
		if (action === 'remove' && $scope.selectedjobs.indexOf(id) !== -1)
			$scope.selectedjobs.splice($scope.selectedjobs.indexOf(id), 1);
	};
	
	$scope.updateSelection = function  ($event, id, invoiced) {
		if(invoiced == false){
		 var checkbox = $event.target;
		 var action = (checkbox.checked ? 'add': 'remove');
		 updateSelected (action, id);
		}else{
			getjobs();
			alert("The job is invoiced,\n Delete the invoice first")
		}
	};
	$scope.isSelected = function (id) {
		 return $scope.selectedjobs.indexOf(id) >= 0;
	};

	$scope.deleteJobs = function () {
		 $http({
		 	url: './api/jobapi/delete',
		 	method: 'POST',
		 	data: JSON.stringify($scope.selectedjobs),
		 	headers: {'Content-Type':'application/json'}
		 }).success(function(data) {
		 	$scope.selectedjobs = [];
		 	getjobs();
		 });
	};
	function showhidejobs (status) {
					$scope.showJobs = status;
					$scope.showJobDetails= !status; 
					$scope.showcreatejob = false;
				};
	$scope.createNewJob = function (status) {
		 			$scope.showJobs = status;
					$scope.showJobDetails= false; 
					$scope.showcreatejob = !status;
	};

	$scope.showdetails = function (status) {
		 $scope.showJobs = status;
		 $scope.showJobDetails = !status;
		 $scope.showcreatejob = false;
	};
	$scope.date = {};
	$scope.getSelectedJob = function(){
		if($scope.selectedjobs.length == 1){
		$http({
			url: './api/jobapi/selectedjob',
		 	method: 'POST',
		 	data: JSON.stringify($scope.selectedjobs),
		 	headers: {'Content-Type':'application/json'}
		}
			).success(function(data){
				$scope.job = data;
				var k = new Date($scope.job.date);
				$scope.job.date = k;
				showhidejobs(false);
				$scope.selectedjobs = [];
			});
		}else{
			alert("Select only one Job to Edit");
		}
	};

$scope.editJob =function(){
	$http({
		url: './api/jobapi/edit',
		method: 'POST',
		data: $.param($scope.job),
		headers: {'Content-Type':'application/x-www-form-urlencoded'}

	}).success(function(data){
		$scope.job={};
		getjobs();
	});
};



}]);
job.filter('startFrom', function() {
    return function(input, start) {
        start = +start; //parse to int
        return input.slice(start);
    }
});