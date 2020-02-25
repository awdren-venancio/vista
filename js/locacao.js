function LocacaoController($scope, $http, $state, $location, $rootScope, SweetAlert, notify) {

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

    $scope.salvarLocacao = function () {
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
                console.log('resposta do php:')
                console.log(response);

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

    $scope.buscarLocacao = function (id_imovel) {
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

    $scope.calcularMensalidades = function (){
        if ($rootScope.valor_aluguel > 0){
            $http.get(url + '/controllers/cliente.php?acao=buscar&id_cliente='+$rootScope.id_cliente+'&string_busca=')
                .then(function (response) {
                    $scope.formData.nome_cliente     = response.data[0].nome;
                    $scope.formData.email_cliente    = response.data[0].email;
                    $scope.formData.telefone_cliente = response.data[0].telefone;
                }
            );

            $http.get(url + '/controllers/imovel.php?acao=buscar&id_imovel='+$rootScope.id_imovel+'&string_busca=')
                .then(function (response) {
                    $scope.formData.endereco              = response.data[0].endereco;
                    $scope.formData.nome_proprietario     = response.data[0].nome_proprietario;
                    $scope.formData.email_proprietario    = response.data[0].email_proprietario;
                    $scope.formData.telefone_proprietario = response.data[0].telefone_proprietario;
                    $scope.formData.dia_repasse           = response.data[0].dia_repasse;
                }
            );

            $http.get(url + '/controllers/locacao.php?acao=gerarMensalidades'+
                '&data_ini='           +$rootScope.data_ini+
                '&data_fim='           +$rootScope.data_fim+
                '&taxa_administracao=' +$rootScope.taxa_administracao+
                '&valor_aluguel='      +$rootScope.valor_aluguel+
                '&valor_condominio='   +$rootScope.valor_condominio+
                '&valor_iptu='         +$rootScope.valor_iptu)
                .then(function (response) {
                    $scope.mensalidades = response.data;
                }
            );
        }
    }
    $scope.calcularMensalidades();

    $scope.finalizaLocacao = function(){
        SweetAlert.swal({
            title: "Locação salva com sucesso!",
            text: "Deseja iniciar uma nova Locação?",
            type: "success",
            showCancelButton: true,
            confirmButtonColor: "#1c84c6",
            confirmButtonText: "Iniciar Locação",
            cancelButtonText: "Fechar",
            closeOnConfirm: false,
            closeOnCancel: false

        }, function (isConfirm) {
            if (isConfirm) {
                $location.path("/locacao/novalocacao/cliente/");
                swal.close();
            } else {
                swal.close();
            }
        });
    }

    $scope.pegaCliente = function(){
        $rootScope.id_cliente = $scope.formData.id_cliente;
    }

    $scope.pegaImovel = function(){
        $rootScope.id_imovel = $scope.formData.id_imovel;
    }

    $scope.pegaValores = function(){
        $rootScope.data_ini           = $scope.formData.data_ini;
        $rootScope.data_fim           = $scope.formData.data_fim;
        $rootScope.taxa_administracao = $scope.formData.taxa_administracao;
        $rootScope.valor_aluguel      = $scope.formData.valor_aluguel;
        $rootScope.valor_condominio   = $scope.formData.valor_condominio;
        $rootScope.valor_iptu         = $scope.formData.valor_iptu;
    }

    $scope.carregaClientesChosen = function(){
        $http.get(url + '/controllers/locacao.php?acao=getClientes')
            .then(function (response) {
                $scope.clientes = response.data;
            }
        );
    }

    $scope.carregaImoveisChosen = function(){
        $http.get(url + '/controllers/locacao.php?acao=getImoveis')
            .then(function (response) {
                $scope.imoveis = response.data;
            }
        );
    }

    $scope.carregaClientesChosen();
    $scope.carregaImoveisChosen();

    $scope.pegaIdImovelDaUrl = function () {
        $scope.formData.id_imovel = $state.params.id_imovel;
        if ($scope.formData.id_imovel != '') {
            $scope.buscarLocacao($scope.formData.id_imovel);
        }
    };
    $scope.pegaIdImovelDaUrl();
}
angular
    .module('inspinia')
    .controller('LocacaoController', LocacaoController);
