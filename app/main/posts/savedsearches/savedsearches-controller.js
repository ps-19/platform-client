module.exports = [
    '$scope',
    '$translate',
    '$transition$',
    '_',
    'PostFilters',
    'savedSearch',
    'UserEndpoint',
    'Notify',
    '$state',
    function (
        $scope,
        $translate,
        $transition$,
        _,
        PostFilters,
        savedSearch,
        UserEndpoint,
        Notify,
        $state
    ) {
        var viewLayouts = {'data': 'd', 'list': 'a', 'map': 'a'};
        // Set view based on route or set view
        $scope.currentView = function () {
            return $transition$.params().view || savedSearch.view;
        };
        $scope.isLoading = {state: true};
        $scope.layout = viewLayouts[$scope.currentView()];
        // Add set to the scope
        $scope.savedSearch = savedSearch;
        $scope.getSavedSearchUser = function () {
            return $scope.savedSearch.user ? UserEndpoint.get({id: $scope.savedSearch.user.id}) : undefined;
        };
        $scope.savedSearch.user = $scope.getSavedSearchUser();

        $translate('post.posts').then(function (title) {
            $scope.title = title;
            $scope.$emit('setPageTitle', title);
        });

        // Set initial filter state
        PostFilters.setMode('savedsearch', savedSearch.id);

        var filters = savedSearch.filter;
        PostFilters.setFilters(filters);
        $scope.filters = PostFilters.getFilters();
        // Slight hack: to avoid incorrectly detecting a changed search
        // we push the real query we're using back into the saved search.
        // This will now include any default params we excluded before
        savedSearch.filter = angular.copy(PostFilters.getFilters());
    }
];
