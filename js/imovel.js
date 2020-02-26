function ImovelController($scope, $http, $state, $location, SweetAlert, notify) {

    var url = 'http://' + location.host;

    $scope.formData = {
        id_imovel: '',
        endereco: '',
        id_proprietario: ''
    }

    $scope.formData.error = {
        endereco: false,
        id_proprietario: false
    }

    $scope.input_busca = '';

    $scope.limparCampos = function () {
        $scope.formData.id_imovel = '';
        $scope.formData.endereco = '';
        $scope.formData.id_proprietario = '';
    }

    $scope.salvarImovel = function () {
        $scope.formData.error.endereco = false;
        
        if ($scope.formData.endereco.length <= 2) {
            $scope.formData.error.endereco = true;
        }
        if ($scope.formData.error.endereco || $scope.formData.error.id_proprietario) {
            SweetAlert.swal({
                title: "Ops..!",
                text: 'Campo em destaque obrigatório!',
                type: "error"
            });
        } else {
            $http.get(url + '/controllers/imovel.php?acao=salvar&'+
                '&id_imovel='         + $scope.formData.id_imovel+
                '&endereco='          + $scope.formData.endereco+
                '&id_proprietario='   + $scope.formData.id_proprietario
            ).then(function (response) {
                
                if (response.status) {

                    SweetAlert.swal({
                        title: "Imóvel salvo com sucesso!",
                        text: "Deseja iniciar uma Locação?",
                        type: "success",
                        showCancelButton: true,
                        confirmButtonColor: "#1c84c6",
                        confirmButtonText: "Iniciar Locação",
                        cancelButtonText: "Fechar",
                        closeOnConfirm: false,
                        closeOnCancel: false

                    }, function (isConfirm) {
                        if (isConfirm) {
                            $location.path("/locacao/novalocacao/imovel/" + response.data.id_imovel);
                            swal.close();
                        } else {
                            swal.close();
                        }
                    });
                } else {
                    SweetAlert.swal('', response.data.dados.msg, 'error');
                }
            });
            $scope.limparCampos();
        }
    };

    $scope.buscarImovel = function (id_imovel) {
        if (id_imovel > 0 || $scope.input_busca.length >= 1) {
            $http.get(url + '/controllers/imovel.php?acao=buscar&'+
            '&id_imovel='    + id_imovel+
            '&string_busca=' + $scope.input_busca)
            .then(function (response) {
                $scope.imoveis = response.data;

                if (id_imovel > 0 && response.data.length > 0){
                    $scope.formData.endereco     = response.data[0].endereco;
                    $scope.formData.id_proprietario = response.data[0].id_proprietario;
                } else if (id_imovel > 0 && response.data.length == 0){
                    SweetAlert.swal({
                        title: "Ops..!",
                        text: 'Imóvel com ID: '+id_imovel+' não encontrado!',
                        type: "error"
                    })
                }
            });
        }
    };

    $scope.carregaProprietariosChosen = function(){
        $http.get(url + '/controllers/proprietario.php?acao=buscar&'+
            '&id_proprietario=0'+
            '&string_busca=')
            .then(function (response) {
                $scope.proprietarios = response.data;
            }
        );
    }
    $scope.carregaProprietariosChosen();

    this.editarCadastro = function (componente) {
        location.href = url + "/#/imovel/cadastroimovel/" + componente.x.id_imovel;
    };

    this.iniciarLocacao = function (componente) {
        location.href = url + "/#/locacao/novalocacao/imovel/" + componente.x.id_imovel;
    };

    $scope.pegaIdImovelDaUrl = function () {
        $scope.formData.id_imovel = $state.params.id_imovel;
        if ($scope.formData.id_imovel != '') {
            $scope.buscarImovel($scope.formData.id_imovel);
        }
    };
    $scope.pegaIdImovelDaUrl();
}
angular
    .module('inspinia')
    .controller('ImovelController', ImovelController);
